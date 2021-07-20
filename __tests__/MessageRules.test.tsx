import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import "jest";
import * as helper from "../src/firebase/rule_helper";
import { firestore } from "@firebase/rules-unit-testing";
import { firestore as adminFirestore } from "firebase-admin";
import "setimmediate";

// エミュレーターホスト指定
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

// FirebaseのProject ID
const projectID = "happyhorse-bc5f6";
const myId = "user_abc";
const theirId = "user_xyz";
const auth = { uid: myId, email: "user_abc@gmail.com" };

describe("message", () => {
  // テスト開始時に1回だけ実行される
  beforeAll(async () => {
    await helper.loadRules(projectID);
  });

  describe("read operation", () => {
    describe("user authenticated", () => {
      let ref;
      beforeEach(async () => {
        ref = helper
          .adminApp(projectID)
          .firestore()
          .collection("users")
          .doc(theirId)
          .collection("posts")
          .doc("postID")
          .collection("chatrooms")
          .doc("sendUserID")
          .collection("messages")
          .doc();

        await ref.set({
          userID: myId,
          username: "username",
          avatar: "avatar",
          messageReceiverID: theirId,
          messageReceiverName: "receiver",
          postID: "postID",
          postTitle: "title",
          image: "image",
          messageText: "ooo",
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
          firstOnDate: false,
          clientDecision: false,
          dealInterruption: false,
          dealCompleted: false,
          pleaseRate: false,
          rateCompleted: false,
          deletedAccount: false,
        });
      });

      test("should be succeeded", () => {
        const db = helper.app(projectID, auth).firestore();
        assertSucceeds(db.doc(ref.path).get());
        assertSucceeds(db.collectionGroup("messages").get());
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be succeeded", () => {
        const db = helper.app(projectID).firestore();

        const ref = db
          .collection("users")
          .doc(theirId)
          .collection("posts")
          .doc("postID")
          .collection("chatrooms")
          .doc(myId)
          .collection("messages")
          .doc("messageId");

        assertSucceeds(
          ref.set({
            userID: myId,
            username: "username",
            avatar: "avatar",
            messageReceiverID: theirId,
            messageReceiverName: "receiver",
            postID: "postID",
            postTitle: "title",
            image: "image",
            messageText: "ooo",
            createdAt: firestore.FieldValue.serverTimestamp(),
            firstOnDate: false,
            clientDecision: false,
            dealInterruption: false,
            dealCompleted: false,
            pleaseRate: false,
            rateCompleted: false,
            deletedAccount: false,
          })
        );

        ref.delete();
      });
    });
  });
  afterAll(async () => await helper.cleanup());
});
