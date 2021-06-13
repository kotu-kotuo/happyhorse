import { db } from "../../firebase/firebase";
import firebase from "firebase/app";

const deletePost = async (e, post, currentUser,router) => {
  e.preventDefault();

  if (post.clientUserID) {
    alert("取引の途中で記事は削除できません。");
    return;
  }
  const result = window.confirm("本当に削除しますか？");
  if (result) {
    await Promise.all(
      post.likeUserIDs.map(async (likeUserID) => {
        await db
          .collection("users")
          .doc(`${likeUserID}`)
          .update({
            likePostIDs: firebase.firestore.FieldValue.arrayRemove(
              `${post.postID}`
            ),
          });

        await db
          .collection("users")
          .doc(`${likeUserID}`)
          .collection("notifications")
          .add({
            postID: post.postID,
            postUserID: post.userID,
            sendUserID: post.userID,
            receiveUserID: likeUserID,
            sendMessageUserID: "",
            image: post.images[0],
            avatar: "",
            text: `お気に入りにした「${post.title}」が削除されました。`,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            checked: false,
            toMessage: false,
            toProfile: false,
            noLink: true,
          });

        await db
          .collection("users")
          .doc(`${likeUserID}`)
          .collection("likePosts")
          .where("postID", "==", post.postID)
          .get()
          .then(
            async (snapshot) =>
              await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
          );
      })
    );

    await db
      .collectionGroup("messages")
      .where("postID", "==", post.postID)
      .get()
      .then(
        async (snapshot) =>
          await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
      );

    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(post.postID)
      .collection("chatrooms")
      .get()
      .then(
        async (snapshot) =>
          await Promise.all(
            snapshot.docs.map((doc) => {
              db.collection("users")
                .doc(`${currentUser.uid}`)
                .collection("posts")
                .doc(post.postID)
                .collection("chatrooms")
                .doc(`${doc.id}`)
                .collection("messages")
                .get()
                .then(
                  async (snapshot) =>
                    await Promise.all(
                      snapshot.docs.map((document) => document.ref.delete())
                    )
                );
              doc.ref.delete();
            })
          )
      );

    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(post.postID)
      .delete();

    await router.push("/");
  }
};

export default deletePost;
