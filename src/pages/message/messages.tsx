import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { db, storage } from "../../utils/firebase";
import firebase from "firebase/app";
import { postInitialValues } from "../../utils/initialValues";
import { Post } from "../../types/types";
import { IoSend, IoChevronBack } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { CgSmile } from "react-icons/cg";
import { CgSmileNone } from "react-icons/cg";
import TextareaAutosize from "react-textarea-autosize";
import ImageModal from "../../components/molecules/ImageModal";
import {
  setChatroomStates,
  setMessageStates,
  setPostStates,
  setReviewStates,
  setUserState,
} from "../../utils/states";
import { generateFileName } from "../../functions/utils";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import DealProgressButton from "../../components/atoms/DealProgressButton";
import isFirstOnDate from "../../functions/messages/isFirstOnDate";

const messages = () => {
  const { user, currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [post, setPost] = useState<Post>(postInitialValues);
  const [messages, setMessages] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [isOpenMyModal, setIsOpenMyModal] = useState(false);
  const [isOpenYourModal, setIsOpenYourModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [reviewsOnHold, setReviewsOnHold]: any = useState([]);
  const [rateValue, setRateValue] = useState("good");
  const [reviewText, setReviewText] = useState("");
  const [postReviews, setPostReviews] = useState([]);
  const [reviewSwitch, setReviewSwitch] = useState("OFF");
  const [messageReceiver, setMessageReceiver] = useState(null);

  const ref = useRef(null);

  //初期値セット
  useEffect(() => {
    if (router.query.pid) {
      db.collectionGroup("posts")
        .where("postID", "==", router.query.pid)
        .onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            setPost(setPostStates(doc.data()));
          });
        });
    }
    if (router.query.uid && router.query.pid && router.query.cid) {
      db.collection("users")
        .doc(`${router.query.uid}`)
        .collection("posts")
        .doc(`${router.query.pid}`)
        .collection("chatrooms")
        .doc(`${router.query.cid}`)
        .get()
        .then((snapshot) => {
          if (!snapshot.data()) return;
          setChatroom(setChatroomStates(snapshot.data()));
        });
    }
    if (router.query.uid && router.query.pid && router.query.cid) {
      db.collection("users")
        .doc(`${router.query.uid}`)
        .collection("posts")
        .doc(`${router.query.pid}`)
        .collection("chatrooms")
        .doc(`${router.query.cid}`)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => setMessageStates(doc.data())))
        );
    }
    if (router.query.pid) {
      db.collection("reviewsOnHold")
        .get()
        .then((snapshot) => {
          if (!snapshot) return;
          setReviewsOnHold(
            snapshot.docs
              .filter((doc) => doc.data().postID === router.query.pid)
              .map((element) => setReviewStates(element.data()))
          );
        });
    }
  }, [router.query.uid, router.query.pid, router.query.cid]);

  useEffect(() => {
    if (currentUser && chatroom !== null) {
      if (currentUser.uid === chatroom.postUserID) {
        db.collection("users")
          .doc(`${chatroom.sendUserID}`)
          .get()
          .then((snapshot) =>
            setMessageReceiver(setUserState(snapshot.data()))
          );
      }
      if (currentUser.uid === chatroom.sendUserID) {
        db.collection("users")
          .doc(`${chatroom.postUserID}`)
          .get()
          .then((snapshot) =>
            setMessageReceiver(setUserState(snapshot.data()))
          );
      }
    }
    if (user && chatroom === null) {
      setMessageReceiver(user);
    }
  }, [currentUser, chatroom, user]);

  useEffect(() => {
    if (post.userID && post.postID && router.query.cid) {
      db.collection("users")
        .doc(`${post.userID}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .collection("chatrooms")
        .doc(`${router.query.cid}`)
        .get()
        .then((snapshot) => {
          if (!snapshot.data()) return;
          setChatroom(setChatroomStates(snapshot.data()));
        });
      db.collectionGroup("reviews")
        .where("postID", "==", post.postID)
        .get()
        .then((snapshot) =>
          setPostReviews(
            snapshot.docs.map((doc) => setReviewStates(doc.data()))
          )
        );
    }
  }, [post]);

  //レビュー送信時、レビューを保持する
  useEffect(() => {
    if (reviewSwitch === "ON")
      db.collection("reviewsOnHold").add({
        postID: post.postID,
        postUserID: post.userID,
        postTitle: post.title,
        postImage: post.images[0],
        reviewerID: currentUser.uid,
        reviewerName: user.username,
        reviewerAvatar: user.avatar,
        rating: rateValue,
        reviewText: reviewText,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

    db.collection("reviewsOnHold")
      .get()
      .then((snapshot) => {
        setReviewsOnHold(
          snapshot.docs.map((doc) =>
            setReviewStates(doc.data({ serverTimestamps: "estimate" }))
          )
        );
      });
  }, [reviewSwitch]);

  //レビューが2つ揃ったら
  useEffect(() => {
    if (
      reviewsOnHold.length !== 0 &&
      reviewsOnHold.filter((review) => review.postID === post.postID).length ===
        2 &&
      post &&
      chatroom &&
      user
    ) {
      reviewsOnHold
        .filter((review) => review.postID === post.postID)
        .map((review) => {
          console.log(review.reviewText);

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
                rating: review.rating,
                reviewText: review.reviewText,
                createdAt: review.createdAt,
              });
            if (review.rating === "good") {
              db.collection("users")
                .doc(`${post.clientUserID}`)
                .update({
                  good: firebase.firestore.FieldValue.increment(1),
                });
            } else {
              db.collection("users")
                .doc(`${post.clientUserID}`)
                .update({
                  bad: firebase.firestore.FieldValue.increment(1),
                });
            }
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
                rating: review.rating,
                reviewText: review.reviewText,
                createdAt: review.createdAt,
              });
            if (review.rating === "good") {
              db.collection("users")
                .doc(`${post.userID}`)
                .update({
                  good: firebase.firestore.FieldValue.increment(1),
                });
            } else {
              db.collection("users")
                .doc(`${post.userID}`)
                .update({
                  bad: firebase.firestore.FieldValue.increment(1),
                });
            }
          }
        });

      db.collection("reviewsOnHold")
        .where("postID", "==", post.postID)
        .get()
        .then((snapshot) => snapshot.docs.forEach((doc) => doc.ref.delete()));

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
    }
  }, [reviewsOnHold]);

  //時間をUNIXから変換
  const createdTime = (post) => {
    const time = new Date(post?.createdAt?.seconds * 1000);
    return time.toLocaleDateString();
  };
  const createdMessageTime = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const createdMessageDate = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleDateString();
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  //メッセージ送信
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentUser && post.postID) {
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
        if (post.sendMessageUserIDs.length === 0) {
          await db
            .collection("users")
            .doc(`${post.userID}`)
            .collection("posts")
            .doc(`${post.postID}`)
            .update({
              sendMessageUserIDs: [currentUser.uid],
              messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              latestMessage: messageText,
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
              latestMessage: messageText,
            });
        }

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
              snapshot.docs.map((doc) => setMessageStates(doc.data()))
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

  //画像送信
  const sendImage = async (e) => {
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

  const decideClient = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <p className="text-center">この方を取引者に決定しますか？</p>
            <div className="flex justify-around mt-8 max-w-xs mx-auto">
              <button
                onClick={async () => {
                  await db
                    .collection("users")
                    .doc(`${post.userID}`)
                    .collection("posts")
                    .doc(`${post.postID}`)
                    .update({
                      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                      latestMessage: "取引者を決定しました",
                      clientUserID: chatroom.sendUserID,
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
                      latestMessage: "取引者を決定しました",
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
                      messageText: "取引者を決定しました",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: isFirstOnDate(messages),
                      clientDecision: true,
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
                      text: `${user.username}さんがあなたを取引者に決定しました。`,
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

  const interruptionDeal = () => {
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
                      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
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
                      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
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

  const completedDeal = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <p className="text-center">この方との取引を完了させますか？</p>
            <div className="flex justify-around mt-8 max-w-xs mx-auto">
              <button
                onClick={async () => {
                  await db
                    .collection("users")
                    .doc(`${post.userID}`)
                    .collection("posts")
                    .doc(`${post.postID}`)
                    .update({
                      messageUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                      latestMessage: "評価をお願いします",
                      isAvairable: false,
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
                      latestMessage: "評価をお願いします",
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
                      messageText: "取引完了しました",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: isFirstOnDate(messages),
                      clientDecision: false,
                      dealInterruption: false,
                      dealCompleted: true,
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
                    .add({
                      userID: currentUser.uid,
                      username: user.username,
                      avatar: user.avatar,
                      messageReceiverID: messageReceiver.id,
                      messageReceiverName: messageReceiver.username,
                      postID: post.postID,
                      postTitle: post.title,
                      image: "",
                      messageText: "評価をお願いします",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: isFirstOnDate(messages),
                      clientDecision: false,
                      dealInterruption: false,
                      dealCompleted: false,
                      pleaseRate: true,
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
                      text: `${user.username}さんとの取引が完了しました。評価をお願いします。`,
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

  const rating = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        const submitReview = async (e) => {
          e.preventDefault();
          setReviewSwitch("ON");

          onClose();
        };
        return (
          <div className="custom-ui w-full">
            <form className="mx-auto p-2 max-w-2xl" onSubmit={submitReview}>
              <div className="flex items-center justify-center mb-3">
                <label className="good-button mr-3">
                  <input
                    type="radio"
                    value="good"
                    name="rate"
                    defaultChecked={true}
                    onChange={(e) => {
                      setRateValue(e.target.value);
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <CgSmile className="text-3xl" />
                    <p className="text-lg">良い</p>
                  </div>
                </label>

                <label className="bad-button ml-3">
                  <input
                    type="radio"
                    value="bad"
                    name="rate"
                    onChange={(e) => {
                      setRateValue(e.target.value);
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <CgSmileNone className="text-3xl" />
                    <p className="text-lg">残念</p>
                  </div>
                </label>
              </div>
              <textarea
                className="w-full h-36 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="この度はありがとうございました！"
                onChange={(e) => {
                  setReviewText(e.target.value);
                }}
              />
              <div className="text-right w-full block">
                <p className="text-xs text-gray-500 text-right ml-auto inline">
                  ※お互いに評価が完了したのち反映されます
                </p>
              </div>

              <div className="flex justify-around mt-8">
                <button
                  type="submit"
                  className="focus:outline-none text-white text-base font-semibold py-1.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                >
                  評価を送信
                </button>
                <button
                  onClick={onClose}
                  className="focus:outline-none text-gray-500 text-base border border-gray-400 font-semibold py-1.5 px-5 rounded-md bg-white hover:opacity-90 hover:shadow-lg"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        );
      },
    });
  };

  //既読機能
  // if (process.browser) {
  //   const targetMessages = document.querySelectorAll(".targetMessage");
  //   console.log(targetMessages)
  //   const options = {
  //     root: null, // 今回はビューポートをルート要素とする
  //     rootMargin: "0px",
  //     threshold: 0,
  //   };

  //   const markAsRead = () => {};
  //   const observer = new IntersectionObserver(markAsRead, options);
  //   // それぞれのboxを監視する
  //   if (targetMessages) {
  //     targetMessages.forEach((targetMessage) => {
  //       observer.observe(targetMessage);
  //     });
  //   }
  // }

  return (
    <div>
      {console.log(isFirstOnDate(messages))}

      <div>
        <Layout title="messages">
          <div className="sm:hidden">
            <div className="absolute top-0 right-0 left-0">
              <div className="flex items-center bg-white h-10 align-middle border-b border-gray-500">
                <IoChevronBack
                  className="text-2xl text-gray-500 ml-2 mr-3 cursor-pointer"
                  onClick={() => {
                    Router.back();
                  }}
                />
                <div className="text-sm text-gray-900 line-clamp-1">
                  {messageReceiver?.username}
                </div>
              </div>
            </div>
            <div className="absolute top-10 right-0 left-0 h-10 align-middle">
              {currentUser &&
                chatroom &&
                !post.clientUserID &&
                currentUser.uid === chatroom?.postUserID && (
                  <div
                    className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white"
                    onClick={decideClient}
                  >
                    <p className="text-mainGreen font-semibold">取引者に決定</p>
                  </div>
                )}
              {currentUser &&
                chatroom &&
                post.clientUserID &&
                post.isAvairable &&
                currentUser.uid === chatroom?.postUserID && (
                  <div className="flex items-center bg-white">
                    <div
                      className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white w-3/5"
                      onClick={completedDeal}
                    >
                      <p className="mt-1 text-mainGreen font-semibold">
                        取引を完了する
                      </p>
                    </div>
                    <div
                      className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white w-2/5"
                      onClick={interruptionDeal}
                    >
                      <p className="mt-1 text-gray-300 font-semibold">
                        取引を中断する
                      </p>
                    </div>
                  </div>
                )}
              {currentUser &&
                chatroom &&
                post.clientUserID &&
                !post.isAvairable &&
                currentUser.uid === chatroom?.postUserID && (
                  <div className="rounded-xl p-2 text-center bg-white">
                    <p className="text-mainGreen font-semibold">
                      取引完了しました
                    </p>
                  </div>
                )}
            </div>
          </div>
          <div className="mx-auto flex flex-row-reverse p-0 sm:px-2 sm:mt-10">
            {/* サイドメニュー =========================================*/}
            <div className="ml-4 hidden sm:block sm:w-1/4">
              <Link href={`/post/postShow/${post.postID}`}>
                <div className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80">
                  <div className="pb-image w-full h-0 relative">
                    <img
                      src={post.images[0]}
                      className="object-cover outline-none w-full h-full cursor-pointer absolute rounded-t-xl"
                    />
                  </div>
                  <div className="p-2 text-sm text-gray-900">
                    <div className="m-1 text-sm line-clamp-2">{post.title}</div>
                    <div className="p-1"> {post.price}円</div>
                  </div>
                </div>
              </Link>
              <DealProgressButton
                currentUser={currentUser}
                chatroom={chatroom}
                post={post}
                decideClient={decideClient}
                completedDeal={completedDeal}
                interruptionDeal={interruptionDeal}
              />
            </div>
            {/* メッセージリスト =========================================*/}
            <div className="shadow-xl w-full">
              <div className="w-full bg-white rounded-lg overflow-y-scroll z-10 chatScreenHeight pb-16 px-2 sm:px-0">
                <div className="pt-20 sm:pt-0">
                  <div className="sm:hidden">
                    <Link href={`/post/postShow/${post.postID}`}>
                      <div
                        className={
                          currentUser?.uid === chatroom?.postUserID
                            ? "flex items-center w-full border-b border-t border-gray-500 mt-8 mb-6 cursor-pointer"
                            : "flex items-center w-full border-b border-t border-gray-500 -mt-3 mb-6 cursor-pointer"
                        }
                      >
                        <div>
                          <img
                            src={post.images[0]}
                            className="min-h-10 h-10 min-w-18 w-18 mr-2 object-cover"
                          />
                        </div>
                        <div className="text-gray-900 line-clamp-1 text-sm text-left ">
                          {post.title}
                        </div>
                      </div>
                    </Link>
                  </div>
                  {messages &&
                    messages.map((message, index) => (
                      <div key={index}>
                        {message.clientDecision ? (
                          <div className="messageAnnounce">
                            取引者を決定しました
                          </div>
                        ) : message.dealInterruption ? (
                          <div className="messageAnnounce">
                            取引を中断しました
                          </div>
                        ) : message.dealCompleted ? (
                          <div className="messageAnnounce">取引完了です！</div>
                        ) : message.pleaseRate ? (
                          //レビューしたか判定
                          reviewsOnHold &&
                          reviewsOnHold.filter(
                            (review) => review.reviewerID === currentUser.uid
                          ).length === 1 ? (
                            postReviews.length !== 2 && (
                              <div className="messageAnnounce">
                                評価完了です！
                              </div>
                            )
                          ) : (
                            postReviews.length !== 2 && (
                              <div
                                className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3 mb-5 mx-3"
                                onClick={rating}
                              >
                                <p className="mt-1 text-mainGreen font-semibold">
                                  評価をお願いします
                                </p>
                              </div>
                            )
                          )
                        ) : message.rateCompleted ? (
                          <div className="messageAnnounce">評価完了です！</div>
                        ) : message.userID === currentUser.uid ? (
                          <>
                            {message.firstOnDate && (
                              <div className="text-center mx-auto text-gray-600 text-sm border border-gray-600 rounded-full py-0.5 w-36">
                                {createdMessageDate(message)}
                              </div>
                            )}
                            <div className="flex w-full max-w-2xl ml-auto justify-end p-0 sm:p-4 my-4 sm:mt-2">
                              <div className="flex">
                                <p className="text-xs text-gray-500 leading-none whitespace-nowrap mt-auto mr-1 sm:mr-2">
                                  {createdMessageTime(message)}
                                </p>
                                <div>
                                  <p className="text-gray-500 text-xs ml-auto text-right hidden sm:inline-block">
                                    {message.username}
                                  </p>
                                  {message.image === "" ? (
                                    <div className="bg-mainGreen text-white px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-l-lg rounded-br-lg">
                                      <p className="text-sm whitespace-pre-wrap">
                                        {message.messageText}
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      <img
                                        src={message.image}
                                        className="block max-h-80 rounded-lg"
                                        onClick={() => setIsOpenMyModal(true)}
                                      />
                                      {isOpenMyModal && (
                                        <ImageModal
                                          image={message.image}
                                          setIsOpenModal={setIsOpenMyModal}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              {message.deletedAccount === true ? (
                                <img
                                  src={message.avatar}
                                  className="h-8 w-8 rounded-full bg-gray-300 ml-3 object-cover sm:h-10 sm:w-10"
                                />
                              ) : (
                                <Link
                                  href={{
                                    pathname: "/profile",
                                    query: {
                                      uid: message.userID,
                                    },
                                  }}
                                >
                                  <img
                                    src={message.avatar}
                                    className="h-8 w-8 rounded-full bg-gray-300 ml-3 object-cover cursor-pointer hover:opacity-80 sm:h-8 sm:w-8"
                                  />
                                </Link>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {message.firstOnDate && (
                              <div className="text-center mx-auto text-gray-600 text-sm border border-gray-600 rounded-full py-0.5 w-36">
                                {createdMessageDate(message)}
                              </div>
                            )}
                            <div className="flex w-full space-x-3 max-w-2xl p-0  targetMessage sm:p-4 my-4 sm:mt-2">
                              {/* プロフィールへのリンクの切り替え */}
                              {message.deletedAccount === true ? (
                                <img
                                  src={message.avatar}
                                  className="h-8 w-8 rounded-full ml-0 object-cover sm:h-10 sm:w-10 sm:ml-3"
                                />
                              ) : (
                                <Link
                                  href={{
                                    pathname: "/profile",
                                    query: {
                                      uid: message.userID,
                                    },
                                  }}
                                >
                                  <img
                                    src={message.avatar}
                                    className="h-8 w-8 rounded-full ml-0 object-cover cursor-pointer hover:opacity-80 sm:h-10 sm:w-10 sm:ml-3"
                                  />
                                </Link>
                              )}
                              <div className="flex">
                                <div>
                                  <p className="text-gray-500 text-xs mr-auto text-left hidden sm:inline-block">
                                    {message.username}
                                  </p>
                                  {message.image === "" ? (
                                    <div className="bg-gray-300 px-2.5 py-2 rounded-r-lg rounded-bl-lg sm:px-3 sm:py-2.5">
                                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {message.messageText}
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      <img
                                        src={message.image}
                                        className="block max-h-80 rounded-lg"
                                        onClick={() => setIsOpenYourModal(true)}
                                      />
                                      {isOpenYourModal && (
                                        <ImageModal
                                          image={message.image}
                                          setIsOpenModal={setIsOpenYourModal}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 leading-none mt-auto ml-1 sm:ml-2">
                                  {createdMessageTime(message)}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  <div ref={ref} />
                </div>
              </div>
              <form onSubmit={sendMessage}>
                <div className="relative z-20">
                  <div className="absolute bottom-0 w-full">
                    <div className="bg-gray-300 p-1 flex items-center sm:rounded-b-lg sm:p-2">
                      <div className="relative w-full z-20">
                        <TextareaAutosize
                          maxRows={5}
                          className="flex items-center h-10 w-full rounded pl-3 pr-8 text-sm resize-none focus:outline-none focus:border-subBlue z-20"
                          placeholder="Type your message…"
                          onChange={(e) => {
                            setMessageText(e.target.value);
                          }}
                          value={messageText}
                        />
                        <label htmlFor="image">
                          <BsFillImageFill className="text-lg text-gray-500 opacity-70 absolute bottom-2.5 right-3 z-20 cursor-pointer hover:opacity-100" />
                        </label>
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          onChange={sendImage}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-9 h-9 bg-subBlue rounded-lg ml-1 mt-auto cursor-pointer z-20 hover:opacity-90 align-middle mb-sendButton sm:h-10 sm:w-10 sm:mb-0"
                        disabled={messageText === ""}
                      >
                        <IoSend className="text-white text-xl mx-auto sm:my-2.5" />
                      </button>
                    </div>
                  </div>
                  {/* <div className="opacity-0 z-0 h-14 bg-transparent"></div> */}
                </div>
              </form>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default messages;
