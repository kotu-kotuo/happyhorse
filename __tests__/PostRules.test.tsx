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
  serverTimestamp,
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

describe("post", () => {
  // テスト開始時に1回だけ実行される
  beforeAll(async () => {
    await helper.loadRules(projectID);
  });

  describe("read operation", () => {
    describe("user is authenticated", () => {
      let ref;
      beforeEach(async () => {
        await helper.withAdminDb(async (adminDb) => {
          ref = doc(collection(adminDb, "users", myId, "posts"));

          await setDoc(ref, {
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
          createdAt: serverTimestamp(),
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
      });

      test("should be succeeded", () => {
        const db = helper.db(auth);
        assertSucceeds(getDoc(doc(db, ref.path)));
        assertSucceeds(getDocs(collectionGroup(db, "posts")));
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be succeeded", () => {
        const db = helper.db(auth);

        const ref = doc(db, "users", myId, "posts", "postID");

        assertSucceeds(
          setDoc(ref, {
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
            createdAt: serverTimestamp(),
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
          })
        );

        assertSucceeds(
          updateDoc(ref, {
            title: "title 変更",
          })
        );

        assertSucceeds(deleteDoc(ref));
      });
    });
  });

  afterAll(async () => await helper.cleanup());
});
