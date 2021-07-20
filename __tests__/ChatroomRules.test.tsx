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
