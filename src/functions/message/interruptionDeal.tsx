import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import { setMessageStates } from "../../utils/states";
import isFirstOnDate from "./isFirstOnDate";
import { confirmAlert } from "react-confirm-alert";
import { Chatroom, Message, Post, User } from "../../types/types";
import { Dispatch, SetStateAction } from "react";

const interruptionDeal = (
  post: Post,
  chatroom: Chatroom,
  user: User,
  currentUser,
  messageReceiver: User,
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>
) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="custom-ui">
          <p className="text-center">この方との取引を中断しますか？</p>
          <div className="flex justify-around mt-8 max-w-xs mx-auto">
            <button
              onClick={async () => {
                await db
                  .collection("users")
                  .doc(`${post.userID}`)
                  .collection("posts")
                  .doc(`${post.postID}`)
                  .update({
                    messageUpdatedAt:
                      firebase.firestore.FieldValue.serverTimestamp(),
                    latestMessage: "取引を中断しました",
                    clientUserID: "",
                  });

                await db
                  .collection("users")
                  .doc(`${post.userID}`)
                  .collection("posts")
                  .doc(`${post.postID}`)
                  .collection("chatrooms")
                  .doc(`${chatroom.sendUserID}`)
                  .update({
                    messageUpdatedAt:
                      firebase.firestore.FieldValue.serverTimestamp(),
                    latestMessage: "取引を中断しました",
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
                    messageText: "取引を中断しました",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    firstOnDate: isFirstOnDate(messages),
                    clientDecision: false,
                    dealInterruption: true,
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
                    text: `${user.username}さんがあなたとの取引を中断しました。`,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    checked: false,
                    toMessage: true,
                    toProfile: false,
                    noLink: false,
                  });
                onClose();
              }}
              className="focus:outline-none text-white text-base font-semibold py-1.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="focus:outline-none text-gray-500 text-base border border-gray-400 font-semibold py-1.5 px-5 rounded-md bg-white hover:opacity-90 hover:shadow-lg"
            >
              No
            </button>
          </div>
        </div>
      );
    },
  });
};

export default interruptionDeal;
