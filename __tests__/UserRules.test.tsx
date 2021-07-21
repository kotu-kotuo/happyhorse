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

describe("user", () => {
  // テスト開始時に1回だけ実行される
  beforeAll(async () => {
    await helper.loadRules(projectID);
  });

  describe("read operation", () => {
    describe("user is authenticated", () => {
      let ref;
      beforeEach(async () => {
        ref = helper.adminApp(projectID).firestore().collection("users").doc();

        await ref.set({
          id: myId,
          username: "username",
          avatar: "avatar",
          cover: "cover",
          profileText: "ooo",
          good: 5,
          bad: 1,
          likePostIDs: ["iii", "uuu"],
          deletedAccount: false,
        });
      });

      test("should be succeeded", () => {
        const db = helper.app(projectID, auth).firestore();
        assertSucceeds(db.doc(ref.path).get());
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be succeeded", () => {
        const db = helper.app(projectID, auth).firestore();

        const ref = db.collection("users").doc(myId);

        ref.set({
          id: myId,
          username: "username",
          avatar: "avatar",
          cover: "cover",
          profileText: "",
          good: 0,
          bad: 0,
          likePostIDs: [],
          deletedAccount: false,
        });

        ref.update({
          username: "Username",
          avatar: "Avatar",
          cover: "Cover",
        });

        ref.delete();
      });
    });
  });

  afterAll(async () => await helper.cleanup());
});
