import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import { setChatroomStates, setMessageStates } from "../../utils/states";
import isFirstOnDate from "./isFirstOnDate";
import { Chatroom, Message, Post, User } from "../../types/types";
import { Dispatch, SetStateAction } from "react";

//メッセージ送信
const sendMessage = async (
  e: React.FormEvent<HTMLFormElement>,
  currentUser,
  user: User,
  post: Post,
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>,
  messageText: string,
  setMessageText: Dispatch<SetStateAction<string>>,
  messageReceiver: User,
  chatroom: Chatroom,
  setChatroom: Dispatch<SetStateAction<Chatroom>>
) => {
  e.preventDefault();
  if (currentUser && post.postID) {
    if (currentUser.uid !== post.userID && messages[0].userID === "") {
      //最初にメッセージ送る時チャットルーム作成
      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${currentUser.uid}`)
        .set({
          sendUserID: currentUser.uid,
          sendUserName: user.username,
          sendUserAvatar: user.avatar,
          postUserID: post.userID,
          postID: post.postID,
          postImage: post.images[0],
          postTitle: post.title,
          latestMessage: messageText,
          messageCount: 1,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => setChatroom(setChatroomStates(snapshot.data())));

      //postにメッセージ送った人を記録
      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .update({
          sendMessageUserIDs: Array.from(
            new Set([currentUser.uid, ...post.sendMessageUserIDs])
          ),
          messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          latestMessage: messageText,
        });

      //メッセージ保存
      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${currentUser.uid}`)
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
          messageText: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          firstOnDate: isFirstOnDate(messages),
          clientDecision: false,
          dealInterruption: false,
          dealCompleted: false,
          pleaseRate: false,
          rateCompleted: false,
          deletedAccount: false,
        });

      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${currentUser.uid}`)
        .collection("messages")
        .orderBy("createdAt")
        .get()
        .then((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) =>
              setMessageStates(doc.data({ serverTimestamps: "estimate" }))
            )
          )
        );
      await setMessageText("");

      db.collection("users")
        .doc(`${post.userID}`)
        .collection("notifications")
        .add({
          postID: post.postID,
          postUserID: post.userID,
          sendUserID: currentUser.uid,
          receiveUserID: post.userID,
          sendMessageUserID: currentUser.uid,
          image: post.images[0],
          avatar: user.avatar,
          text: `${user.username}さんから「${post.title}」に新着メッセージがあります。`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          checked: false,
          toMessage: true,
          toProfile: false,
          noLink: false,
        });
    } else {
      //２通目以降

      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .update({
          messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          latestMessage: messageText,
        });

      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${chatroom.sendUserID}`)
        .update({
          messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          latestMessage: messageText,
          messageCount: chatroom.messageCount + 1,
        });

      await db
        .collection("users")
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
          messageText: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          firstOnDate: isFirstOnDate(messages),
          clientDecision: false,
          dealInterruption: false,
          dealCompleted: false,
          pleaseRate: false,
          rateCompleted: false,
        });

      await db
        .collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${chatroom.sendUserID}`)
        .collection("messages")
        .orderBy("createdAt")
        .get()
        .then((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) =>
              setMessageStates(doc.data({ serverTimestamps: "estimate" }))
            )
          )
        );
      await setMessageText("");

      if (currentUser.uid === post.userID) {
        db.collection("users")
          .doc(`${chatroom.sendUserID}`)
          .collection("notifications")
          .add({
            postID: post.postID,
            postUserID: post.userID,
            sendUserID: currentUser.uid,
            receiveUserID: chatroom.sendUserID,
            sendMessageUserID: chatroom.sendUserID,
            image: post.images[0],
            avatar: user.avatar,
            text: `${user.username}さんから「${post.title}」に新着メッセージがあります。`,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            checked: false,
            toMessage: true,
            toProfile: false,
            noLink: false,
          });
      } else {
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
            avatar: user.avatar,
            text: `${user.username}さんから「${post.title}」に新着メッセージがあります。`,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            checked: false,
            toMessage: true,
            toProfile: false,
            noLink: false,
          });
      }
    }
  }
};

export default sendMessage;
