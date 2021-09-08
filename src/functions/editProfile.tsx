import { NextRouter } from "next/router";
import fetch from "node-fetch";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { storage, db } from "../firebase/firebase";
import { User } from "../types/types";
import { setUserState } from "../utils/states";

const editProfile = async (
  e: React.FormEvent<HTMLFormElement>,
  username: string,
  profileText: string,
  siteURL: string,
  address: string,
  image,
  currentUser,
  cover,
  setUser: Dispatch<SetStateAction<User>>,
  router: NextRouter
) => {
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

    if (siteURL) {
      await db.collection("users").doc(`${currentUser.uid}`).update({
        siteURL: siteURL,
      });
    }

    if (address) {
      await console.log(
        address,
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`
        )
      );

      await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          await db
            .collection("users")
            .doc(`${currentUser.uid}`)
            .update({
              location: {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
              },
            });

          await db.collection("users").doc(`${currentUser.uid}`).update({
            address: address,
          });
        })
        .catch(async (error) => {
          await alert(error.message);
        });
    }

    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .get()
      .then(async (snapshot) => {
        await setUser(setUserState(snapshot.data()));
      });

    await router.push({
      pathname: "/profile",
      query: {
        uid: currentUser.uid,
      },
    });
  }
};

export default editProfile;
