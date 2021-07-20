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

describe("post", () => {
  // テスト開始時に1回だけ実行される
  beforeAll(async () => {
    // ローカルにあるRulesファイルを読み込む
    await helper.loadRules(projectID);
  });

  describe("collection posts", () => {
    describe("get operation", () => {
      describe("user is authenticated", () => {
        let ref;
        beforeEach(async () => {
          ref = helper
            .adminApp(projectID)
            .firestore()
            .collection("users")
            .doc(myId)
            .collection("posts")
            .doc();

          await ref.set({
            postID: "postID",
            userID: myId,
            username: "username",
            avatar: "avatar",
            images: ["image", "image2"],
            title: "title",
            postText: "postText",
            horseName: "horseName",
            category: "category",
            breed: "breed",
            gender: "gender",
            color: "color",
            birth: { year: 2000, month: 2, day: 2 },
            age: 11,
            height: 160,
            area: "area",
            features: ["empty"],
            price: 3000000,
            createdAt: adminFirestore.FieldValue.serverTimestamp(),
            updatedAt: "",
            likeUserIDs: [theirId],
            isAvairable: true,
            pv: 0,
            sendMessageUserIDs: [theirId],
            messageUpdatedAt: "",
            latestMessage: "ooooo",
            clientUserID: theirId,
            ratingCompleted: false,
            deletedAccount: false,
          });
        });

        test("should be succeeded", () => {
          const db = helper.app(projectID, auth).firestore();
          assertSucceeds(db.doc(ref.path).get());
          assertSucceeds(db.collectionGroup("posts").get());
        });
      });
    });

    describe("create update operation", () => {
      describe("user authenticated", () => {
        test("should be succeeded", () => {
          const db = helper.app(projectID, auth).firestore();

          const ref = db
            .collection("users")
            .doc(myId)
            .collection("posts")
            .doc("postID");

          ref.set({
            postID: "postID",
            userID: myId,
            username: "username",
            avatar: "avatar",
            images: ["image", "image2"],
            title: "title",
            postText: "postText",
            horseName: "horseName",
            category: "category",
            breed: "breed",
            gender: "gender",
            color: "color",
            birth: { year: 2000, month: 2, day: 2 },
            age: 11,
            height: 160,
            area: "area",
            features: ["empty"],
            price: 3000000,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: "",
            likeUserIDs: [theirId],
            isAvairable: true,
            pv: 0,
            sendMessageUserIDs: [theirId],
            messageUpdatedAt: "",
            latestMessage: "ooooo",
            clientUserID: theirId,
            ratingCompleted: false,
            deletedAccount: false,
          });

          ref.update({
            title: "title 変更",
          });

          ref.delete();
        });
      });
    });
  });

  afterAll(async () => await helper.cleanup());
});
