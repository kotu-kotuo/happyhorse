/** @jest-environment node */

import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import "jest";
import * as helper from "../src/firebase/rule_helper";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
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
      const ref = doc(as(client), "users", owner, "reviews", "other");
      await assertFails(setDoc(ref, review(client, owner)));
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
      await assertFails(
        updateDoc(doc(as(stranger), "users", owner, "reviews", postID), {
          reviewerID: stranger,
          reviewerName: "x",
        })
      );
    });
  });

  describe("posts deal fields (#31)", () => {
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

    test("inquirer can still record their message", async () => {
      await assertSucceeds(
        updateDoc(doc(as(stranger), ...postPath), {
          sendMessageUserIDs: [stranger, client],
          latestMessage: "hi",
        })
      );
    });

    test("anyone can still like", async () => {
      await assertSucceeds(
        updateDoc(doc(as(stranger), ...postPath), { likeUserIDs: [stranger] })
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
          ratingCompleted: true,
          latestMessage: "評価完了しました",
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

    test("receiver cannot be an outsider", async () => {
      await assertFails(addDoc(messages(client), message(client, stranger)));
    });

    test("outsider cannot post into the room", async () => {
      await assertFails(addDoc(messages(stranger), message(stranger, owner)));
    });

    test("owner cannot open a room for someone else", async () => {
      await assertFails(addDoc(messages(owner, stranger), message(owner, stranger)));
      await assertFails(
        setDoc(doc(as(owner), ...postPath, "chatrooms", stranger), {
          sendUserID: owner,
          postUserID: owner,
          messageCount: 1,
        })
      );
    });

    test("inquirer can open their own room", async () => {
      await assertSucceeds(
        setDoc(doc(as(stranger), ...postPath, "chatrooms", stranger), {
          sendUserID: stranger,
          postUserID: owner,
          messageCount: 1,
        })
      );
    });

    test("author cannot redirect a sent message", async () => {
      const ref = await addDoc(messages(client), message(client, owner));
      await assertSucceeds(updateDoc(ref, { username: "退会ユーザー" }));
      await assertFails(updateDoc(ref, { messageReceiverID: stranger }));
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
      await assertFails(
        updateDoc(doc(as(stranger), ...chatroomPath), { sendUserID: stranger })
      );
      await assertFails(
        updateDoc(doc(as(client), ...chatroomPath), { postUserID: client })
      );
    });
  });
});
