/** @jest-environment node */

import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import "jest";
import * as helper from "../src/firebase/rule_helper";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import "setimmediate";

process.env.FIRESTORE_EMULATOR_HOST ||= "localhost:8099";

// Covers #31 (review counts) and #32 (message receivers): every case is awaited
// so a wrong rule fails the test instead of an unhandled rejection.
const projectID = "happyhorse-bc5f6";
const owner = "owner";
const client = "client";
const stranger = "stranger";
const postID = "post1";
const as = (uid: string) => helper.db({ uid, email: `${uid}@example.com` });

const postPath = ["users", owner, "posts", postID] as const;
const chatroomPath = [...postPath, "chatrooms", client] as const;

const basePost = {
  postID,
  userID: owner,
  title: "title",
  clientUserID: client,
  isAvairable: false,
  sendMessageUserIDs: [client],
  likeUserIDs: [],
  latestMessage: "",
};

const review = (reviewerID: string, receiverID: string, rating = "good") => ({
  postID,
  postUserID: owner,
  reviewerID,
  receiverID,
  rating,
  reviewText: "",
});

const message = (userID: string, messageReceiverID: string) => ({
  userID,
  messageReceiverID,
  postID,
  messageText: "hi",
});

describe("abuse rules", () => {
  beforeAll(async () => {
    await helper.loadRules(projectID);
  });

  beforeEach(async () => {
    await helper.clearFirestoreData();
    await helper.withAdminDb(async (adminDb) => {
      for (const uid of [owner, client, stranger]) {
        await setDoc(doc(adminDb, "users", uid), {
          id: uid,
          username: uid,
          good: 0,
          bad: 0,
        });
      }
      await setDoc(doc(adminDb, ...postPath), basePost);
      await setDoc(doc(adminDb, ...chatroomPath), {
        sendUserID: client,
        postUserID: owner,
        messageCount: 1,
      });
    });
  });

  afterAll(async () => await helper.cleanup());

  describe("users good / bad (#31)", () => {
    test("owner cannot raise their own count", async () => {
      await assertFails(updateDoc(doc(as(owner), "users", owner), { good: 99 }));
    });

    test("owner cannot change their id", async () => {
      await assertFails(updateDoc(doc(as(owner), "users", owner), { id: "other" }));
    });

    test("owner can still edit the profile", async () => {
      await assertSucceeds(
        updateDoc(doc(as(owner), "users", owner), { username: "new" })
      );
    });

    test("signup must start at zero", async () => {
      const ref = doc(as("newbie"), "users", "newbie");
      await assertFails(setDoc(ref, { id: "newbie", good: 5, bad: 0 }));
      await assertSucceeds(setDoc(ref, { id: "newbie", good: 0, bad: 0 }));
    });
  });

  describe("reviews (#31)", () => {
    const reviewRef = (uid: string, receiver: string) =>
      doc(as(uid), "users", receiver, "reviews", postID);

    test("stranger cannot review a deal party", async () => {
      await assertFails(setDoc(reviewRef(stranger, owner), review(stranger, owner)));
    });

    test("deal party can review the other party", async () => {
      await assertSucceeds(setDoc(reviewRef(client, owner), review(client, owner)));
    });

    test("second rater writes the held review of themselves", async () => {
      // sendReviews: the client writes the owner's review of the client.
      await assertSucceeds(setDoc(reviewRef(client, client), review(owner, client)));
    });

    test("receiverID must be the path user", async () => {
      await assertFails(setDoc(reviewRef(client, owner), review(client, stranger)));
    });

    test("nobody reviews themselves", async () => {
      await assertFails(setDoc(reviewRef(client, client), review(client, client)));
    });

    test("doc ID must be the post ID", async () => {
      await assertFails(
        setDoc(reviewRef(client, owner), { ...review(client, owner), postID: "other" })
      );
    });

    test("reviewer must be a deal party", async () => {
      await assertFails(setDoc(reviewRef(client, owner), review(stranger, owner)));
    });

    test("owner as the second rater writes both reviews", async () => {
      await assertSucceeds(setDoc(reviewRef(owner, client), review(owner, client)));
      await assertSucceeds(setDoc(reviewRef(owner, owner), review(client, owner)));
    });

    test("owner cannot fabricate a deal with someone who never inquired", async () => {
      // Without the chatroom check the owner could name anyone as the client and
      // give them a bad rating once per fake post.
      for (const fake of ["fake1", "fake2"]) {
        await assertSucceeds(
          setDoc(doc(as(owner), "users", owner, "posts", fake), {
            ...basePost,
            postID: fake,
            clientUserID: stranger,
          })
        );
        await assertFails(
          setDoc(doc(as(owner), "users", stranger, "reviews", fake), {
            ...review(owner, stranger, "bad"),
            postID: fake,
          })
        );
      }
    });

    test("deal must be closed", async () => {
      await helper.withAdminDb(async (adminDb) => {
        await updateDoc(doc(adminDb, ...postPath), { isAvairable: true });
      });
      await assertFails(setDoc(reviewRef(client, owner), review(client, owner)));
    });

    test("collection-group path no longer allows writes", async () => {
      const ref = doc(as(stranger), "anything", "x", "reviews", postID);
      await assertFails(setDoc(ref, review(stranger, owner)));
    });

    test("reviewer can rename but not change the rating", async () => {
      await helper.withAdminDb(async (adminDb) => {
        await setDoc(doc(adminDb, "users", owner, "reviews", postID), review(client, owner));
      });
      const ref = reviewRef(client, owner);
      await assertSucceeds(updateDoc(ref, { reviewerName: "退会ユーザー" }));
      await assertFails(updateDoc(ref, { rating: "bad" }));
      await assertFails(updateDoc(ref, { reviewText: "edited" }));
      await assertFails(
        updateDoc(doc(as(stranger), "users", owner, "reviews", postID), {
          reviewerID: stranger,
          reviewerName: "x",
        })
      );
    });
  });

  describe("posts deal fields (#31)", () => {
    test("client cannot close the deal themselves", async () => {
      const ref = doc(as(client), ...postPath);
      await assertFails(updateDoc(ref, { isAvairable: true }));
      await assertFails(updateDoc(ref, { clientUserID: stranger }));
    });

    test("stranger cannot make themselves the client", async () => {
      await assertFails(
        updateDoc(doc(as(stranger), ...postPath), {
          clientUserID: stranger,
          sendMessageUserIDs: [stranger, client],
        })
      );
      await assertFails(
        updateDoc(doc(as(stranger), ...postPath), { userID: stranger })
      );
    });

    test("inquirer can still record their first message", async () => {
      // sendMessage: first message from a new inquirer.
      await assertSucceeds(
        updateDoc(doc(as(stranger), ...postPath), {
          sendMessageUserIDs: [stranger, client],
          messageUpdatedAt: serverTimestamp(),
          latestMessage: "hi",
        })
      );
    });

    test("inquirer can still update the latest message", async () => {
      // sendMessage: later messages leave sendMessageUserIDs as it is.
      await assertSucceeds(
        updateDoc(doc(as(client), ...postPath), {
          messageUpdatedAt: serverTimestamp(),
          latestMessage: "again",
        })
      );
    });

    test("inquirer cannot drop other inquirers", async () => {
      await assertFails(
        updateDoc(doc(as(stranger), ...postPath), {
          sendMessageUserIDs: [stranger],
          latestMessage: "hi",
        })
      );
    });

    test("anyone can still like and unlike", async () => {
      const ref = doc(as(stranger), ...postPath);
      await assertSucceeds(updateDoc(ref, { likeUserIDs: [stranger] }));
      await assertSucceeds(updateDoc(ref, { likeUserIDs: [] }));
    });

    test("liking cannot touch other fields or other likes", async () => {
      const ref = doc(as(stranger), ...postPath);
      await assertFails(
        updateDoc(ref, { likeUserIDs: [stranger], sendMessageUserIDs: [] })
      );
      await assertFails(
        updateDoc(ref, { likeUserIDs: [stranger], ratingCompleted: true })
      );
      await assertFails(updateDoc(ref, { likeUserIDs: [stranger, "someone"] }));
    });

    test("only the client can mark rating completed", async () => {
      await assertFails(
        updateDoc(doc(as(stranger), ...postPath), { ratingCompleted: true })
      );
    });

    test("owner can still close the deal", async () => {
      await assertSucceeds(
        updateDoc(doc(as(owner), ...postPath), { isAvairable: true, clientUserID: "" })
      );
    });

    test("client can mark rating completed", async () => {
      await assertSucceeds(
        updateDoc(doc(as(client), ...postPath), {
          messageUpdatedAt: serverTimestamp(),
          latestMessage: "評価完了しました",
          ratingCompleted: true,
        })
      );
    });
  });

  describe("messages (#32)", () => {
    const messages = (uid: string, room = client) =>
      collection(as(uid), ...postPath, "chatrooms", room, "messages");

    test("party can message the other party", async () => {
      await assertSucceeds(addDoc(messages(client), message(client, owner)));
      await assertSucceeds(addDoc(messages(owner), message(owner, client)));
    });

    test("sender cannot pose as the other party", async () => {
      await assertFails(addDoc(messages(client), message(owner, client)));
    });

    test("receiver cannot be an outsider", async () => {
      await assertFails(addDoc(messages(client), message(client, stranger)));
    });

    test("outsider cannot post into the room", async () => {
      await assertFails(addDoc(messages(stranger), message(stranger, owner)));
    });

    test("no message without an existing chatroom", async () => {
      await assertFails(addDoc(messages(owner, stranger), message(owner, stranger)));
    });

    test("owner cannot open a room for someone else", async () => {
      await assertFails(
        setDoc(doc(as(owner), ...postPath, "chatrooms", stranger), {
          sendUserID: owner,
          postUserID: owner,
          messageCount: 1,
        })
      );
    });

    test("new inquiry: open room, record on post, message, owner replies", async () => {
      await assertSucceeds(
        setDoc(doc(as(stranger), ...postPath, "chatrooms", stranger), {
          sendUserID: stranger,
          postUserID: owner,
          messageCount: 1,
        })
      );
      await assertSucceeds(
        updateDoc(doc(as(stranger), ...postPath), {
          sendMessageUserIDs: [stranger, client],
          messageUpdatedAt: serverTimestamp(),
          latestMessage: "hi",
        })
      );
      await assertSucceeds(
        addDoc(messages(stranger, stranger), message(stranger, owner))
      );
      await assertSucceeds(
        addDoc(messages(owner, stranger), message(owner, stranger))
      );
    });

    test("inquirer cannot claim someone else's post owner", async () => {
      await assertFails(
        setDoc(doc(as(stranger), ...postPath, "chatrooms", stranger), {
          sendUserID: stranger,
          postUserID: stranger,
          messageCount: 1,
        })
      );
    });

    test("author cannot redirect a sent message", async () => {
      const ref = await addDoc(messages(client), message(client, owner));
      await assertSucceeds(updateDoc(ref, { username: "退会ユーザー" }));
      await assertFails(updateDoc(ref, { messageReceiverID: stranger }));
      await assertFails(updateDoc(ref, { dealCompleted: true }));
      await assertFails(
        updateDoc(doc(as(stranger), ref.path), { userID: stranger, messageText: "x" })
      );
    });
  });

  describe("chatrooms", () => {
    test("parties can update, outsiders cannot take over", async () => {
      await assertSucceeds(
        updateDoc(doc(as(owner), ...chatroomPath), { messageCount: 2 })
      );
      await assertSucceeds(
        updateDoc(doc(as(client), ...chatroomPath), { messageCount: 3 })
      );
      await assertFails(
        updateDoc(doc(as(stranger), ...chatroomPath), { sendUserID: stranger })
      );
      await assertFails(
        updateDoc(doc(as(client), ...chatroomPath), { postUserID: client })
      );
    });
  });
});
