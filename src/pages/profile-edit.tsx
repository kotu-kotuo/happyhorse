import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { storage, db } from "../firebase/firebase";
import { NextPage } from "next";

const ProfileEdit: NextPage = () => {
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
          .then(async () => {
            await storage
              .ref(`images/${currentUser.uid}/avatar/`)
              .getDownloadURL()
              .then(async (url) => {
                await db.collection("users").doc(`${currentUser.uid}`).update({
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
          });
      }

      if (cover) {
        await storage
          .ref(`images/${currentUser.uid}/cover/`)
          .put(cover)
          .then(async () => {
            await storage
              .ref(`images/${currentUser.uid}/cover/`)
              .getDownloadURL()
              .then(async (url) => {
                await db.collection("users").doc(`${currentUser.uid}`).update({
                  cover: url,
                });
              });
          });
      }

      if (username) {
        await db.collection("users").doc(`${currentUser.uid}`).update({
          username: username,
        });

        await db
          .collection("users")
          .doc(`${currentUser.uid}`)
          .collection("posts")
          .get()
          .then(
            async (snapshot) =>
              await Promise.all(
                snapshot.docs.map((doc) =>
                  doc.ref.update({
                    username: username,
                  })
                )
              )
          );

        await db
          .collectionGroup("chatrooms")
          .where("sendUserID", "==", currentUser.uid)
          .get()
          .then(
            async (snapshot) =>
              await Promise.all(
                snapshot.docs.map((doc) =>
                  doc.ref.update({ sendUserName: username })
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
                username: username,
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
                    reviewerName: username,
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
                    reviewerName: username,
                  })
                )
              )
          );
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
      {currentUser && user && (
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
                className="text-sm inline w-full text-gray-500 sm:text-base"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                className="text-sm inline w-full text-gray-500 sm:text-base"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCover(e.target.files[0]);
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mb-1 ml-1">
              ユーザネーム(20字以内)
            </div>
            <input
              className="mb-6 rounded-md inputText"
              type="text"
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
              defaultValue={user.username}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">
              プロフィール文
            </div>
            <div className="mb-7">
              <textarea
                className="h-40 rounded-md inputText"
                onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
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
                className="buttonGreen"
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
