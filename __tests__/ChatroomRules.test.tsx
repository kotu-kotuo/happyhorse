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

describe("chatroom", () => {
  // テスト開始時に1回だけ実行される
  beforeAll(async () => {
    await helper.loadRules(projectID);
  });

  describe("read operation", () => {
    describe("user authenticated", () => {
      let ref;
      beforeEach(async () => {
        await helper.withAdminDb(async (adminDb) => {
          ref = doc(
            collection(
              adminDb,
              "users",
              theirId,
              "posts",
              "postID",
              "chatrooms"
            )
          );

          await setDoc(ref, {
            sendUserID: myId,
            sendUserName: "username",
            sendUserAvatar: "avatar",
            postUserID: theirId,
            postID: "postID",
            postImage: "image",
            postTitle: "title",
            latestMessage: "ooo",
            messageCount: null,
            createdAt: serverTimestamp(),
            messageUpdatedAt: serverTimestamp(),
            deletedAccount: false,
          });
        });
      });

      test("should be succeeded", () => {
        const db = helper.db(auth);
        assertSucceeds(getDoc(doc(db, ref.path)));
        assertSucceeds(getDocs(collectionGroup(db, "chatrooms")));
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be denied by security rules", () => {
        const db = helper.db(auth);

        const ref = doc(
          db,
          "users",
          theirId,
          "posts",
          "postID",
          "chatrooms",
          myId
        );

        // create requires incomingData().messageCount == 1, so this is denied
        assertFails(
          setDoc(ref, {
            sendUserID: myId,
            sendUserName: "username",
            sendUserAvatar: "avatar",
            postUserID: theirId,
            postID: "postID",
            postImage: "image",
            postTitle: "title",
            latestMessage: "ooo",
            messageCount: null,
            createdAt: serverTimestamp(),
            messageUpdatedAt: serverTimestamp(),
            deletedAccount: false,
          })
        );

        // update is allowed only for sendUserID / postUserID owners, and the
        // document does not exist
        assertFails(
          updateDoc(ref, {
            latestMessage: "uuu",
            messageCount: 3,
            messageUpdatedAt: serverTimestamp(),
          })
        );

        // delete requires existingData().postUserID == auth.uid
        assertFails(deleteDoc(ref));
      });
    });
  });
  afterAll(async () => await helper.cleanup());
});
