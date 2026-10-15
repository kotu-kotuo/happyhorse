import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { firebaseConfig } from "./config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  firebase?.analytics?.isSupported()?.then((isSupported) => {
    if (isSupported) {
      firebase.analytics();
    }
  });
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
