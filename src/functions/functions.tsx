export const generateFileName = (file) => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N = 16;
  const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
    .map((n) => S[n % S.length])
    .join("");
  return randomChar + "_" + file.size;
}

//いいね機能
export const clickHeart = async(e,currentUser,user,setUser,router,db) => {
if (!currentUser) {
  router.push("login");
} else {
  const pid = e.currentTarget.getAttribute("data-id");
  if (user.likePostIDs.includes(`${pid}`)) {
    console.log("unlike");

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
          ...snapshot.data().likeUserIDs.filter((id) => id !== currentUser.uid),
        ],
      })
    );
  } else {
    console.log(user.likePostIDs);
    console.log("like");

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

    posts.docs.forEach((snapshot) =>
      snapshot.ref.update({
        likeUserIDs: [currentUser.uid, ...snapshot.data().likeUserIDs],
      })
    );
  }
}
}
