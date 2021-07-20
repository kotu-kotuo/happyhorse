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

describe("chatroom", () => {
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
          .doc();

        await ref.set({
          sendUserID: myId,
          sendUserName: "username",
          sendUserAvatar: "avatar",
          postUserID: theirId,
          postID: "postID",
          postImage: "image",
          postTitle: "title",
          latestMessage: "ooo",
          messageCount: null,
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
          messageUpdatedAt: adminFirestore.FieldValue.serverTimestamp(),
          deletedAccount: false,
        });
      });

      test("should be succeeded", () => {
        const db = helper.app(projectID, auth).firestore();
        assertSucceeds(db.doc(ref.path).get());
        assertSucceeds(db.collectionGroup("chatrooms").get());
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be succeeded", () => {
        const db = helper.app(projectID, auth).firestore();

        const ref = db
          .collection("users")
          .doc(theirId)
          .collection("posts")
          .doc("postID")
          .collection("chatrooms")
          .doc(myId);

        ref.set({
          sendUserID: myId,
          sendUserName: "username",
          sendUserAvatar: "avatar",
          postUserID: theirId,
          postID: "postID",
          postImage: "image",
          postTitle: "title",
          latestMessage: "ooo",
          messageCount: null,
          createdAt: firestore.FieldValue.serverTimestamp(),
          messageUpdatedAt: firestore.FieldValue.serverTimestamp(),
          deletedAccount: false,
        });

        ref.update({
          latestMessage: "uuu",
          messageCount: 3,
          messageUpdatedAt: firestore.FieldValue.serverTimestamp(),
        });

        ref.delete();
      });
    });
  });
  afterAll(async () => await helper.cleanup());
});
