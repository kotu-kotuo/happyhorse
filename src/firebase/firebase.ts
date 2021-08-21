import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import { firebaseConfig } from "./config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics.isSupported().then((isSupported) => {
    if (isSupported) {
      firebase.analytics();
    }
  });
} else {
  firebase.app();
}

// const analytics = firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
