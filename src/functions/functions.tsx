export const generateFileName = (file) => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N = 16;
  const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
    .map((n) => S[n % S.length])
    .join("");
  return randomChar + "_" + file.size;
};

//いいね機能
import firebase from "firebase/app";

export const clickHeart = async (e, currentUser, user, setUser, router, db) => {
  if (!currentUser) {
    router.push("login");
  } else {
    const pid = e.currentTarget.getAttribute("data-id");
    if (user.likePostIDs.includes(`${pid}`)) {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .update({
          likePostIDs: [...user.likePostIDs.filter((id) => id !== pid)],
        });

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      const posts = await db
        .collectionGroup("posts")
        .where("postID", "==", pid)
        .get();

      await posts.docs.forEach((snapshot) =>
        snapshot.ref.update({
          likeUserIDs: [
            ...snapshot
              .data()
              .likeUserIDs.filter((id) => id !== currentUser.uid),
          ],
        })
      );

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("likePosts")
        .where("postID", "==", pid)
        .get()
        .then((snapshot) => snapshot.docs.forEach((doc) => doc.ref.delete()));
    } else {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .update({
          likePostIDs: [pid, ...user.likePostIDs],
        });

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      const posts = await db
        .collectionGroup("posts")
        .where("postID", "==", pid)
        .get();

      posts.docs.forEach((snapshot) => {
        snapshot.ref.update({
          likeUserIDs: [currentUser.uid, ...snapshot.data().likeUserIDs],
        });

        //likedAtを追加
        db.collection("users")
          .doc(`${currentUser.uid}`)
          .collection("likePosts")
          .add({
            postID: snapshot.data().postID,
            userID: snapshot.data().userID,
            username: snapshot.data().username,
            avatar: snapshot.data().avatar,
            images: snapshot.data().images,
            title: snapshot.data().title,
            postText: snapshot.data().postText,
            horseName: snapshot.data().horseName,
            category: snapshot.data().category,
            breed: snapshot.data().breed,
            color: snapshot.data().color,
            birth: {
              year: snapshot.data().birth.year,
              month: snapshot.data().birth.month,
              day: snapshot.data().birth.day,
            },
            age: snapshot.data().age,
            height: snapshot.data().height,
            area: snapshot.data().area,
            features: snapshot.data().features,
            price: snapshot.data().price,
            createdAt: snapshot.data().createdAt,
            updatedAt: snapshot.data().updatedAt,
            likeUserIDs: snapshot.data().likeUserIDs,
            isAvairable: snapshot.data().isAvairable,
            pv: snapshot.data().pv,
            sendMessageUserIDs: snapshot.data().sendMessageUserIDs,
            messageUpdatedAt: snapshot.data().messageUpdatedAt,
            latestMessage: snapshot.data().latestMessage,
            clientUserID: snapshot.data().clientUserID,
            likedAt:firebase.firestore.FieldValue.serverTimestamp()
          });
      });
    }
  }
};
