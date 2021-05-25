import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { storage, db } from "../utils/firebase";
import firebase from "firebase/app";

const ProfileEdit = () => {
  const { currentUser, user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState<any>("");
  const [cover, setCover] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [profileText, setProfileText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileText(user.profileText);
    }
  }, [user]);

  const editProfile = async (e) => {
    e.preventDefault();
    if (username.length > 20) {
      alert("ユーザーネームは20字以内でお願いします");
    } else if (profileText.length > 2000) {
      alert("プロフィール文は2000字以内でお願いします");
    } else {
      //アバター画像変更
      if (image) {
        await storage
          .ref(`images/${currentUser.uid}/avatar/`)
          .put(image)
          .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            () => {},
            (error) => {
              console.log(error.message);
            },
            () => {
              storage
                .ref(`images/${currentUser.uid}/avatar/`)
                .getDownloadURL()
                .then(async (url) => {
                  await db
                    .collection("users")
                    .doc(`${currentUser.uid}`)
                    .update({
                      avatar: url,
                    });

                  await db
                    .collection("users")
                    .doc(`${currentUser.uid}`)
                    .collection("posts")
                    .get()
                    .then(async (snapshot) => {
                      await Promise.all(
                        snapshot.docs.map((doc) => {
                          doc.ref.update({ avatar: url });
                        })
                      );
                    });

                  await db
                    .collectionGroup("chatrooms")
                    .where("sendUserID", "==", currentUser.uid)
                    .get()
                    .then(
                      async (snapshot) =>
                        await Promise.all(
                          snapshot.docs.map((doc) =>
                            doc.ref.update({ sendUserAvatar: url })
                          )
                        )
                    );

                  await db
                    .collectionGroup("messages")
                    .where("userID", "==", currentUser.uid)
                    .get()
                    .then((snapshot) =>
                      snapshot.docs.map((doc) =>
                        doc.ref.update({
                          avatar: url,
                        })
                      )
                    );

                  await db
                    .collectionGroup("reviews")
                    .where("reviewerID", "==", currentUser.uid)
                    .get()
                    .then(
                      async (snapshot) =>
                        await Promise.all(
                          snapshot.docs.map((doc) =>
                            doc.ref.update({
                              reviewerAvatar: url,
                            })
                          )
                        )
                    );

                  await db
                    .collectionGroup("reviewsOnHold")
                    .where("reviewerID", "==", currentUser.uid)
                    .get()
                    .then(
                      async (snapshot) =>
                        await Promise.all(
                          snapshot.docs.map((doc) =>
                            doc.ref.update({
                              reviewerAvatar: url,
                            })
                          )
                        )
                    );
                });
            }
          );
      }

      if (cover) {
        console.log("おおお")
        const uploadTask = storage
          .ref(`images/${currentUser.uid}/cover/`)
          .put(cover);
        await uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (error) => {
            console.log(error.message);
          },
          () => {
            storage
              .ref(`images/${currentUser.uid}/cover/`)
              .getDownloadURL()
              .then((url) => {
                db.collection("users").doc(`${currentUser.uid}`).update({
                  cover: url,
                });
              });
          }
        );
      }

      if (username) {
        await db.collection("users").doc(`${currentUser.uid}`).update({
          username: username,
        });
      }

      if (profileText) {
        await db.collection("users").doc(`${currentUser.uid}`).update({
          profileText: profileText,
        });
      }

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      await router.push({
        pathname: "/profile",
        query: {
          uid: currentUser.uid,
        },
      });
    }
  };

  return (
    <Layout title="profile-edit">
      {currentUser && (
        <div className="my-20 px-2">
          <form className="mx-auto max-w-2xl" onSubmit={editProfile}>
            <div className="text-xs text-gray-500 mb-2 ml-1">アバター画像</div>
            <div className="flex items-center mb-6">
              {image ? (
                <img
                  className="w-20 h-20 mr-6 object-cover rounded-full"
                  src={URL.createObjectURL(image)}
                  alt="uploaded"
                />
              ) : (
                <img
                  className="w-20 h-20 mr-6 object-cover rounded-full"
                  src={user.avatar}
                  alt="uploaded"
                />
              )}
              <input
                className="inline w-full text-gray-500"
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mb-2 ml-1">カバー画像</div>
            <div className="flex items-center mb-6">
              {cover ? (
                <img
                  className="w-20 h-20 mr-6 object-cover rounded"
                  src={URL.createObjectURL(cover)}
                  alt="uploaded"
                />
              ) : (
                <img
                  className="w-20 h-20 mr-6 object-cover rounded"
                  src={user.cover}
                  alt="uploaded"
                />
              )}
              <input
                className="inline w-full text-gray-500"
                type="file"
                onChange={(e) => {
                  setCover(e.target.files[0]);
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mb-1 ml-1">
              ユーザネーム(20字以内)
            </div>
            <input
              className="block w-full mb-6 appearance-none relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              defaultValue={user.username}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">
              プロフィール文
            </div>
            <div className="mb-7">
              <textarea
                className="block w-full h-40 appearance-none relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={(e) => {
                  setProfileText(e.target.value);
                }}
                defaultValue={user.profileText}
              />
              <div className="text-xs text-gray-500 text-right">
                {`${profileText.length}` + "/4000"}
              </div>
            </div>
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
