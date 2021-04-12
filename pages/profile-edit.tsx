import { useState, useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";
import { storage, db } from "../src/utils/firebase";
import firebase from "firebase/app";

const ProfileEdit = () => {
  const { currentUser, user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState<any>("");
  const [cover, setCover] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [profileText, setProfileText] = useState<string>("");
  const router = useRouter();

  const handleImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };
  const handleCover = (e) => {
    const image = e.target.files[0];
    setCover(image);
  };

  const handleName = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const handleText = (e) => {
    const text = e.target.value;
    setProfileText(text);
  };

  const editProfile = async (e) => {
    e.preventDefault();
    if (image !== "") {
      const next = () => {};
      const error = (error) => {
        console.log(error.message);
      };

      const complete = () => {
        storage
          .ref(`images/${currentUser.uid}/avatar/`)
          .getDownloadURL()
          .then(async (url) => {
            await db.collection("users").doc(`${currentUser.uid}`).update({
              avatar: url,
            });
          });
      };
      const uploadTask = storage
        .ref(`images/${currentUser.uid}/avatar/`)
        .put(image);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        next,
        error,
        complete
      );
    }

    if (cover !== "") {
      const next = () => {};
      const error = (error) => {
        console.log(error.message);
      };

      const complete = () => {
        storage
          .ref(`images/${currentUser.uid}/cover/`)
          .getDownloadURL()
          .then(async (url) => {
            await db.collection("users").doc(`${currentUser.uid}`).update({
              cover: url,
            });
          });
      };
      const uploadTask = storage
        .ref(`images/${currentUser.uid}/cover/`)
        .put(cover);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        next,
        error,
        complete
      );
    }

    username &&
      (await db.collection("users").doc(`${currentUser.uid}`).update({
        username: username,
      }));

    profileText &&
      (await db.collection("users").doc(`${currentUser.uid}`).update({
        profileText: profileText,
      }));

    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .get()
      .then((snapshot) => {
        setUser(snapshot.data());
      });
      router.push("/profile");
  };

  return (
    <Layout title="profile-edit">
      {currentUser && (
        <div className="my-20 px-2">
          <form className="mx-auto max-w-2xl" onSubmit={editProfile}>
            <div className="text-xs text-gray-500 mb-2 ml-1">アバター画像</div>
            <div className="flex items-center mb-6">
              <img
                className="w-20 h-20 mr-6 object-cover rounded-full"
                src={user.avatar}
                alt="uploaded"
              />
              <input
                className="inline w-full text-gray-500"
                type="file"
                onChange={handleImage}
              />
            </div>
            <div className="text-xs text-gray-500 mb-2 ml-1">カバー画像</div>
            <div className="flex items-center mb-6">
              <img
                className="w-20 h-20 mr-6 object-cover rounded"
                src={user.cover}
                alt="uploaded"
              />
              <input
                className="inline w-full text-gray-500"
                type="file"
                onChange={handleCover}
              />
            </div>
            <div className="text-xs text-gray-500 mb-1 ml-1">ユーザネーム</div>
            <input
              className="block w-full mb-6 appearance-none relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              type="text"
              onChange={handleName}
              defaultValue={user.username}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">
              プロフィール文
            </div>
            <textarea
              className="block w-full mb-7 h-40 appearance-none relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={handleText}
              defaultValue={user.profileText}
            />
            <div className="text-center">
              <button
                type="submit"
                className="focus:outline-none text-white text-base font-medium py-2.5 px-24 rounded-md bg-mainGreen  max-w-full hover:opacity-90 hover:shadow-lg"
              >
                更新する
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ProfileEdit;