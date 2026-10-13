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
} from "firebase/firestore";
import "setimmediate";

// エミュレーターホスト指定
process.env.FIRESTORE_EMULATOR_HOST ||= "localhost:8099";

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
        await helper.withAdminDb(async (adminDb) => {
          ref = doc(
            collection(
              adminDb,
              "users",
              theirId,
              "posts",
              "postID",
              "chatrooms",
              "sendUserID",
              "messages"
            )
          );

          await setDoc(ref, {
            userID: myId,
            username: "username",
            avatar: "avatar",
            messageReceiverID: theirId,
            messageReceiverName: "receiver",
            postID: "postID",
            postTitle: "title",
            image: "image",
            messageText: "ooo",
            createdAt: serverTimestamp(),
            firstOnDate: false,
            clientDecision: false,
            dealInterruption: false,
            dealCompleted: false,
            pleaseRate: false,
            rateCompleted: false,
            deletedAccount: false,
          });
        });
      });

      test("should be succeeded", () => {
        const db = helper.db(auth);
        assertSucceeds(getDoc(doc(db, ref.path)));
        assertSucceeds(getDocs(collectionGroup(db, "messages")));
      });
    });
  });

  describe("write operation", () => {
    describe("user authenticated", () => {
      test("should be denied without authentication", () => {
        const db = helper.db();

        const ref = doc(
          db,
          "users",
          theirId,
          "posts",
          "postID",
          "chatrooms",
          myId,
          "messages",
          "messageId"
        );

        // create requires isAuthenticated() && userID == auth.uid
        assertFails(
          setDoc(ref, {
            userID: myId,
            username: "username",
            avatar: "avatar",
            messageReceiverID: theirId,
            messageReceiverName: "receiver",
            postID: "postID",
            postTitle: "title",
            image: "image",
            messageText: "ooo",
            createdAt: serverTimestamp(),
            firstOnDate: false,
            clientDecision: false,
            dealInterruption: false,
            dealCompleted: false,
            pleaseRate: false,
            rateCompleted: false,
            deletedAccount: false,
          })
        );

        // delete requires userID or messageReceiverID match on existing data
        assertFails(deleteDoc(ref));
      });
    });
  });
  afterAll(async () => await helper.cleanup());
});
