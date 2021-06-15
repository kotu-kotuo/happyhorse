//いいね機能
import firebase from "firebase/app";

const clickHeart = async (
  e,
  currentUser,
  user,
  setUser,
  router,
  db,
  notifications
) => {
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

      await posts.docs.map((doc) =>
        doc.ref.update({
          likeUserIDs: [
            ...doc.data().likeUserIDs.filter((id) => id !== currentUser.uid),
          ],
        })
      );
      await db
        .collectionGroup("likePosts")
        .where("postID", "==", pid)
        .get()
        .then(
          async (snapshot) =>
            await Promise.all(
              snapshot.docs.map((doc) =>
                doc.ref.update({
                  likeUserIDs: [
                    ...doc
                      .data()
                      .likeUserIDs.filter((id) => id !== currentUser.uid),
                  ],
                })
              )
            )
        );

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("likePosts")
        .where("postID", "==", pid)
        .get()
        .then(
          async (snapshot) =>
            await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
        );
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

      await db
        .collectionGroup("likePosts")
        .where("postID", "==", pid)
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) =>
            doc.ref.update({
              likeUserIDs: [currentUser.uid, ...doc.data().likeUserIDs],
            })
          )
        );

      const posts = await db
        .collectionGroup("posts")
        .where("postID", "==", pid)
        .get()
        .then((snapshot) =>
          snapshot.docs.map(async (doc) => {
            await doc.ref.update({
              likeUserIDs: [currentUser.uid, ...doc.data().likeUserIDs],
            });

            console.log([currentUser.uid, ...doc.data().likeUserIDs]);

            //likedAtを追加
            await db
              .collection("users")
              .doc(`${currentUser.uid}`)
              .collection("likePosts")
              .add({
                likePostUserID: currentUser.uid,
                postID: doc.data().postID,
                userID: doc.data().userID,
                username: doc.data().username,
                avatar: doc.data().avatar,
                images: doc.data().images,
                title: doc.data().title,
                postText: doc.data().postText,
                horseName: doc.data().horseName,
                category: doc.data().category,
                breed: doc.data().breed,
                gender: doc.data().gender,
                color: doc.data().color,
                birth: {
                  year: doc.data().birth.year,
                  month: doc.data().birth.month,
                  day: doc.data().birth.day,
                },
                age: doc.data().age,
                height: doc.data().height,
                area: doc.data().area,
                features: doc.data().features,
                price: doc.data().price,
                createdAt: doc.data().createdAt,
                updatedAt: doc.data().updatedAt,
                likeUserIDs: [currentUser.uid, ...doc.data().likeUserIDs],
                isAvairable: doc.data().isAvairable,
                pv: doc.data().pv,
                sendMessageUserIDs: doc.data().sendMessageUserIDs,
                messageUpdatedAt: doc.data().messageUpdatedAt,
                latestMessage: doc.data().latestMessage,
                clientUserID: doc.data().clientUserID,
                ratingCompleted: doc.data().ratingCompleted,
                deletedAccount: doc.data().deletedAccount,
                likedAt: firebase.firestore.FieldValue.serverTimestamp(),
              });

            //通知
            if (
              currentUser.uid !== doc.data().userID && //自分の投稿へのいいねは通知されない
              notifications.filter(
                //通知が重複しないように
                (notification) =>
                  notification.postID === doc.data().postID &&
                  notification.sendUserID === currentUser.uid
              ).length === 0
            ) {
              db.collection("users")
                .doc(`${doc.data().userID}`)
                .collection("notifications")
                .add({
                  postID: doc.data().postID,
                  postUserID: doc.data().userID,
                  sendUserID: currentUser.uid,
                  receiveUserID: doc.data().userID,
                  sendMessageUserID: "",
                  image: doc.data().images[0],
                  avatar: doc.data().avatar,
                  text: `${user.username}さんが「${
                    doc.data().title
                  }」にいいねしました。`,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  checked: false,
                  toMessage: false,
                  toProfile: false,
                  noLink: false,
                });

              // db.collection("users") TODO:他のユーザーのnotificationsのリアルタイムの更新は可能か？
              //   .doc(`${snapshot.data().userID}`)
              //   .collection("notifications")
              //   .orderBy("createdAt", "desc")
              //   .get()
              //   .then(async (snapshot) =>
              //     setNotifications(
              //       snapshot.docs.map((doc) => setNotificationStates(doc.data()))
              //     )
              //   );
            }
          })
        );
    }
  }
};

export default clickHeart;
