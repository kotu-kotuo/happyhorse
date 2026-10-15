/** @jest-environment node */

import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import "jest";
import * as helper from "../src/firebase/rule_helper";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import "setimmediate";

// エミュレーターホスト指定
process.env.FIRESTORE_EMULATOR_HOST ||= "localhost:8099";

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
        await helper.withAdminDb(async (adminDb) => {
          ref = doc(collection(adminDb, "users"));

          await setDoc(ref, {
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
      });

      test("should be succeeded", () => {
        const db = helper.db(auth);
        assertSucceeds(getDoc(doc(db, ref.path)));
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be succeeded", () => {
        const db = helper.db(auth);

        const ref = doc(db, "users", myId);

        assertSucceeds(
          setDoc(ref, {
            id: myId,
            username: "username",
            avatar: "avatar",
            cover: "cover",
            profileText: "",
            good: 0,
            bad: 0,
            likePostIDs: [],
            deletedAccount: false,
          })
        );

        assertSucceeds(
          updateDoc(ref, {
            username: "Username",
            avatar: "Avatar",
            cover: "Cover",
          })
        );

        assertSucceeds(deleteDoc(ref));
      });
    });
  });

  afterAll(async () => await helper.cleanup());
});
