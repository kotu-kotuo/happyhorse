import { db, auth } from "../utils/firebase";
import firebase from "firebase/app";

const deleteAccountData = async (currentUser, password, router) => {
  const authuser = auth.currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(
    authuser.email,
    password
  );
  authuser
    .reauthenticateWithCredential(credential)
    .then(async () => {
      await db.collection("users").doc(`${currentUser.uid}`).update({
        username: "退会ユーザー",
        avatar: "/avatar(2).png",
        cover: "/cover1.png",
        profileText: "",
        deletedAccount: true,
      });

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) =>
            doc.ref.update({
              username: "退会ユーザー",
              avatar: "/avatar(2).png",
              deletedAccount: true,
            })
          )
        );

      await db
        .collectionGroup("chatrooms")
        .where("sendUserID", "==", currentUser.uid)
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) =>
            doc.ref.update({
              sendUserName: "退会ユーザー",
              sendUserAvatar: "/avatar(2).png",
              deletedAccount: true,
            })
          )
        );

      await db
        .collectionGroup("messages")
        .where("userID", "==", currentUser.uid)
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) =>
            doc.ref.update({
              username: "退会ユーザー",
              avatar: "/avatar(2).png",
              deletedAccount: true,
            })
          )
        );

      await db
        .collectionGroup("reviews")
        .where("reviewerID", "==", currentUser.uid)
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) =>
            doc.ref.update({
              reviewerName: "退会ユーザー",
              reviewerAvatar: "/avatar(2).png",
              deletedAccount: true,
            })
          )
        );

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .where("userID", "==", currentUser.uid)
        .where("clientUserID", "==", "")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("likePosts")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

      // await db                messages.tsxの評価表示切り替えでで不具合が出るため
      //   .collection("users")
      //   .doc(`${currentUser.uid}`)
      //   .collection("reviews")
      //   .get()
      //   .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("notifications")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

      await auth.currentUser.delete().catch((error) => alert(error.message));

      await alert(
        "退会が完了しました。\n今までご使用いただきありがとうございました！"
      );

      await router.push("/");
    })
    .catch((error) => alert(error.message));
};

export default deleteAccountData;
