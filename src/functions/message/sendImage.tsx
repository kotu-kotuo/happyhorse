import { generateFileName } from "../generateFileName";
import { db, storage } from "../../firebase/firebase";
import firebase from "firebase/app";
import { setChatroomStates, setMessageStates } from "../../utils/states";
import isFirstOnDate from "./isFirstOnDate";

const sendImage = async (
  e,
  currentUser,
  user,
  post,
  messages,
  setMessages,
  messageReceiver,
  chatroom,
  setChatroom
) => {
  if (currentUser && post.postID && e.target.files[0]) {
    const fileName = await generateFileName(e.target.files[0]);

    if (currentUser.uid !== post.userID && messages.length === 0) {
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
          latestMessage: `${user.username}が画像を送信しました。`,
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
      if (post.sendMessageUserIDs.length === 0) {
        await db
          .collection("users")
          .doc(`${post.userID}`)
          .collection("posts")
          .doc(`${post.postID}`)
          .update({
            sendMessageUserIDs: [currentUser.uid],
            messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            latestMessage: `${user.username}が画像を送信しました。`,
          });
      } else {
        await db
          .collection("users")
          .doc(`${post.userID}`)
          .collection("posts")
          .doc(`${post.postID}`)
          .update({
            sendMessageUserIDs: [currentUser.uid, ...post.sendMessageUserIDs],
            messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            latestMessage: `${user.username}が画像を送信しました。`,
          });
      }

      //画像保存
      await storage
        .ref(`posts/${post.postID}/messages/${fileName}`)
        .put(e.target.files[0])
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (error) => {
            console.log(error.message);
          },
          () => {
            storage
              .ref(`posts/${post.postID}/messages/${fileName}`)
              .getDownloadURL()
              .then(async (url) => {
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
                    image: url,
                    messageText: "",
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
                  .doc(`${currentUser.uid}`)
                  .collection("messages")
                  .orderBy("createdAt")
                  .get()
                  .then((snapshot) =>
                    setMessages(
                      snapshot.docs.map((doc) => setMessageStates(doc.data()))
                    )
                  );
              });
          }
        );
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
          latestMessage: `${user.username}が画像を送信しました。`,
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
          latestMessage: `${user.username}が画像を送信しました。`,
          messageCount: chatroom.messageCount + 1,
        });

      await storage
        .ref(`posts/${post.postID}/messages/${fileName}`)
        .put(e.target.files[0])
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (error) => {
            console.log(error.message);
          },
          () => {
            storage
              .ref(`posts/${post.postID}/messages/${fileName}`)
              .getDownloadURL()
              .then(async (url) => {
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
                    image: url,
                    messageText: "",
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
                      snapshot.docs.map((doc) => setMessageStates(doc.data()))
                    )
                  );
              });
          }
        );

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

export default sendImage;
