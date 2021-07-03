import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import alertMessage from "../../functions/post/alertMessage";
import { NextRouter } from "next/router";
import { FormEvent } from "react";
import { User } from "../../types/types";

const posting = async (
  e: FormEvent<HTMLFormElement>,
  isDraft: boolean,
  currentUser: { uid: any },
  user: User,
  postId: string,
  title: string,
  postText: string,
  horseName: string,
  category: string,
  breed: string,
  gender: string,
  color: string,
  year: number,
  month: number,
  day: number,
  age: number,
  height: number,
  features: string[],
  area: string,
  price: number,
  uploadImages: {
    (images: any): Promise<void>;
    (images: any): Promise<void>;
    (arg0: any): any;
  },
  images: string[] | any[],
  router: NextRouter
) => {
  e.preventDefault();

  if (isDraft) {
    const setPost = async () => {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .doc(`${postId}`)
        .set({
          postID: postId,
          userID: currentUser.uid,
          username: user.username,
          avatar: user.avatar,
          images: [],
          title: title,
          postText: postText,
          horseName: horseName,
          category: category,
          breed: breed,
          gender: gender,
          color: color,
          birth: {
            year: year,
            month: month,
            day: day,
          },
          age: age,
          height: height,
          features: features,
          area: area,
          price: price,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: "",
          likeUserIDs: [],
          isAvairable: true,
          pv: 0,
          sendMessageUserIDs: [],
          messageUpdatedAt: "",
          latestMessage: "",
          clientUserID: "",
          ratingCompleted: false,
          deletedAccount: false,
        });
    };

    const processAll = async () => {
      await setPost();
      await uploadImages(images);
    };

    await processAll();

    await router.push("/");
  } else {
    if (
      images.length !== 0 &&
      postText &&
      horseName &&
      horseName.length <= 20 &&
      category &&
      breed &&
      gender &&
      color &&
      year &&
      month &&
      day &&
      age &&
      height &&
      area &&
      price
    ) {
      const setPost = async () => {
        await db
          .collection("users")
          .doc(`${currentUser.uid}`)
          .collection("posts")
          .doc(`${postId}`)
          .set({
            postID: postId,
            userID: currentUser.uid,
            username: user.username,
            avatar: user.avatar,
            images: [],
            title: title,
            postText: postText,
            horseName: horseName,
            category: category,
            breed: breed,
            gender,
            color: color,
            birth: {
              year: year,
              month: month,
              day: day,
            },
            age: age,
            height: height,
            features: features,
            area: area,
            price: price,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: "",
            likeUserIDs: [],
            isAvairable: true,
            pv: 0,
            sendMessageUserIDs: [],
            messageUpdatedAt: "",
            latestMessage: "",
            clientUserID: "",
            ratingCompleted: false,
            deletedAccount: false,
          });
      };

      const processAll = async () => {
        await setPost();
        await uploadImages(images);
      };

      await processAll();

      await router.push("/");
    } else {
      alertMessage(
        images,
        postText,
        horseName,
        category,
        breed,
        gender,
        color,
        year,
        month,
        day,
        age,
        height,
        price,
        area
      );
    }
  }
};

export default posting;
