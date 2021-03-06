import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import isFirstOnDate from "./isFirstOnDate";
import { setMessageStates } from "../../utils/states";
import { Chatroom, Message, Post, Review, User } from "../../types/types";
import { Dispatch, SetStateAction } from "react";

const sendReviews = (
  reviewsOnHold: Review[],
  user: User,
  currentUser,
  post: Post,
  messages: Message[],
  chatroom: Chatroom,
  messageReceiver: User,
  setMessages: Dispatch<SetStateAction<Message[]>>
) => {
  reviewsOnHold.map((review) => {
    if (review.postUserID === review.reviewerID) {
      db.collection("users")
        .doc(`${post.clientUserID}`)
        .collection("reviews")
        .doc(`${review.postID}`)
        .set({
          postID: review.postID,
          postUserID: review.postUserID,
          postTitle: review.postTitle,
          postImage: review.postImage,
          reviewerID: review.reviewerID,
          reviewerName: review.reviewerName,
          reviewerAvatar: review.reviewerAvatar,
          receiverID: post.clientUserID,
          rating: review.rating,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
        });
    } else {
      db.collection("users")
        .doc(`${post.userID}`)
        .collection("reviews")
        .doc(`${review.postID}`)
        .set({
          postID: review.postID,
          postUserID: review.postUserID,
          postTitle: review.postTitle,
          postImage: review.postImage,
          reviewerID: review.reviewerID,
          reviewerName: review.reviewerName,
          reviewerAvatar: review.reviewerAvatar,
          receiverID: post.userID,
          rating: review.rating,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
        });
    }
  });

  db.collection("users")
    .doc(`${post.userID}`)
    .collection("posts")
    .doc(`${post.postID}`)
    .update({
      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      latestMessage: "評価完了しました",
      ratingCompleted: true,
    });

  db.collection("users")
    .doc(`${post.userID}`)
    .collection("posts")
    .doc(`${post.postID}`)
    .collection("chatrooms")
    .doc(`${chatroom.sendUserID}`)
    .update({
      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      latestMessage: "評価完了しました",
      messageCount: chatroom.messageCount + 1,
    });

  db.collection("users")
    .doc(`${post.userID}`)
    .collection("posts")
    .doc(`${post.postID}`)
    .collection("chatrooms")
    .doc(`${chatroom.sendUserID}`)
    .collection("messages")
    .add({
      userID: currentUser.uid,
      username: user.username,
      avatar: user.avatar,
      messageReceiverID: messageReceiver.id,
      messageReceiverName: messageReceiver.username,
      postID: post.postID,
      postTitle: post.title,
      image: "",
      messageText: "評価完了しました",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      firstOnDate: isFirstOnDate(messages),
      clientDecision: false,
      dealInterruption: false,
      dealCompleted: false,
      pleaseRate: false,
      rateCompleted: true,
    });

  db.collection("users")
    .doc(`${post.userID}`)
    .collection("posts")
    .doc(`${post.postID}`)
    .collection("chatrooms")
    .doc(`${chatroom.sendUserID}`)
    .collection("messages")
    .orderBy("createdAt")
    .get()
    .then((snapshot) =>
      setMessages(snapshot.docs.map((doc) => setMessageStates(doc.data())))
    );

  db.collection("users")
    .doc(`${chatroom.sendUserID}`)
    .get()
    .then((snapshot) => {
      db.collection("users")
        .doc(`${post.userID}`)
        .collection("notifications")
        .add({
          postID: post.postID,
          postUserID: post.userID,
          sendUserID: chatroom.sendUserID,
          receiveUserID: post.userID,
          sendMessageUserID: chatroom.sendUserID,
          image: post.images[0],
          avatar: snapshot.data().avatar,
          text: `${snapshot.data().username}さんから評価が届きました。`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          checked: false,
          toMessage: false,
          toProfile: true,
          noLink: false,
        });
    });

  db.collection("users")
    .doc(`${post.userID}`)
    .get()
    .then((snapshot) => {
      db.collection("users")
        .doc(`${chatroom.sendUserID}`)
        .collection("notifications")
        .add({
          postID: post.postID,
          postUserID: post.userID,
          sendUserID: post.userID,
          receiveUserID: chatroom.sendUserID,
          sendMessageUserID: chatroom.sendUserID,
          image: post.images[0],
          avatar: snapshot.data().avatar,
          text: `${snapshot.data().username}さんから評価が届きました。`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          checked: false,
          toMessage: false,
          toProfile: true,
          noLink: false,
        });
    });
};

export default sendReviews;
