import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import Link from "next/link";
import { Layout } from "../components/organisms/Layout";
import { db, auth } from "../utils/firebase";
import { PageTitle } from "../components/atoms/Atoms";
import { IoChevronForwardOutline } from "react-icons/io5";
import { setPostStates } from "../utils/states";

const setting = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [duringDealingPosts, setDuringDealingPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .get()
        .then((snapshot) =>
          setMyPosts(snapshot.docs.map((doc) => setPostStates(doc.data())))
        );

      db.collectionGroup("posts")
        .where("clientUserID", "==", currentUser.uid)
        .where("isAvairable", "==", true)
        .get()
        .then((snapshot) =>
          setDuringDealingPosts(
            snapshot.docs.map((doc) => setPostStates(doc.data()))
          )
        );
    }
  }, [currentUser]);
  const deleteAccount = async () => {
    const filterResult = myPosts.filter(
      (post) => post.clientUserID && post.isAvairable === true
    );
    console.log(filterResult.length !== 0);
    console.log(duringDealingPosts.length !== 0);
    if (filterResult.length !== 0 || duringDealingPosts.length !== 0) {
      alert("取引の途中で退会はできません。");
      return;
    }
    const result = window.confirm(
      "本当に退会しますか？\n削除したユーザーデータは二度と復元することはできません。\n"
    );
    if (result) {
      await db.collection("users").doc(`${currentUser.uid}`).update({
        username: "退会ユーザー",
        avatar: "/avatar(1).png",
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
              avatar: "/avatar(1).png",
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
              sendUserAvatar: "/avatar(1).png",
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
              avatar: "/avatar(1).png",
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
              reviewerAvatar: "/avatar(1).png",
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

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("reviews")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.ref.delete()));

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
    }

    await auth.currentUser.delete();
  };
  return (
    <div>
      <Layout title="setting">
        <div className="max-w-2xl mx-auto">
          <PageTitle title="設定" />
          <ul className="mt-12">
            <div className="border-b cursor-pointer" onClick={deleteAccount}>
              <div className="px-4 py-4 hover:bg-gray-100 flex items-center">
                <p className="font-medium text-red-600 leading-none">
                  退会する
                </p>
                <IoChevronForwardOutline className="text-red-600 text-lg ml-auto" />
              </div>
            </div>
          </ul>
        </div>
      </Layout>
    </div>
  );
};

export default setting;
