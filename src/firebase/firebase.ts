import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from "./config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
