import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  databeseURL: "https://happyhorse-bc5f6.firebaseio.com",
  apiKey: "AIzaSyALVUSMrSXBQClXbPvzk87yEkAH9GdhNNg",
  authDomain: "happyhorse-bc5f6.firebaseapp.com",
  projectId: "happyhorse-bc5f6",
  storageBucket: "happyhorse-bc5f6.appspot.com",
  messagingSenderId: "362079704601",
  appId: "1:362079704601:web:dfa9135a9d83bb38db3c88",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
