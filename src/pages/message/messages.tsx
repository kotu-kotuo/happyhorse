import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { db, storage } from "../../utils/firebase";
import firebase from "firebase/app";
import { postInitialValues } from "../../utils/initialValues";
import { Post } from "../../types/types";
import { IoSend } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { CgSmile } from "react-icons/cg";
import { CgSmileNone } from "react-icons/cg";
import TextareaAutosize from "react-textarea-autosize";
import Div100vh from "react-div-100vh";
import ImageModal from "../../components/molecules/ImageModal";
import {
  setChatroomStates,
  setMessageStates,
  setPostStates,
  setReviewStates,
} from "../../utils/states";
import { generateFileName } from "../../functions/functions";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
    if (currentUser) {
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
  }, [router.query.uid, router.query.pid, router.query.cid, currentUser]);

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
          postID: post.postID,
          username: user.username,
          avatar: user.avatar,
          messageText: "評価完了しました",
          image: "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          firstOnDate: handleShowDate,
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

  //日付を表示するか判定
  if (
    messages &&
    messages
      .map(
        (message) =>
          new Date(message.createdAt?.seconds * 1000).toLocaleDateString
      )
      .includes(new Date().toLocaleDateString)
  ) {
    var handleShowDate = false;
  } else {
    var handleShowDate = true;
  }

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
            postID: post.postID,
            username: user.username,
            avatar: user.avatar,
            messageText: messageText,
            image: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            firstOnDate: handleShowDate,
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
            postID: post.postID,
            username: user.username,
            avatar: user.avatar,
            messageText: messageText,
            image: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "",
                      image: url,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "",
                      image: url,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "取引者を決定しました",
                      image: "",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "取引を中断しました",
                      image: "",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "取引完了しました",
                      image: "",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
                      postID: post.postID,
                      username: user.username,
                      avatar: user.avatar,
                      messageText: "評価をお願いします",
                      image: "",
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      firstOnDate: handleShowDate,
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
      {console.log(rateValue)}
      {console.log(reviewText)}
      <div>
        <Div100vh className="relative">
          <Layout title="messages">
            <div className=" mx-auto flex flex-row-reverse mt-10 px-2">
              <div className="w-1/4 ml-4">
                <Link href={`/post/postShow/${post.postID}`}>
                  <div className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80">
                    <div className="pb-image w-full h-0 relative">
                      <img
                        src={post.images[0]}
                        className="object-cover outline-none w-full h-full cursor-pointer absolute rounded-t-xl"
                      />
                    </div>
                    <div className="p-2 text-sm text-gray-900">
                      <div className="m-1 myPostTitle">{post.title}</div>
                      <div className="p-1"> {post.price}円</div>
                      <div className="p-1">{createdTime(post)}</div>
                    </div>
                  </div>
                </Link>
                {currentUser &&
                  chatroom &&
                  !post.clientUserID &&
                  currentUser.uid === chatroom?.postUserID && (
                    <div
                      className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
                      onClick={decideClient}
                    >
                      <p className="mt-1 text-mainGreen font-semibold">
                        取引者に決定
                      </p>
                    </div>
                  )}
                {currentUser &&
                  chatroom &&
                  post.clientUserID &&
                  post.isAvairable &&
                  currentUser.uid === chatroom?.postUserID && (
                    <>
                      <div
                        className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
                        onClick={completedDeal}
                      >
                        <p className="mt-1 text-mainGreen font-semibold">
                          取引を完了する
                        </p>
                      </div>
                      <div
                        className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
                        onClick={interruptionDeal}
                      >
                        <p className="mt-1 text-gray-300 font-semibold">
                          取引を中断する
                        </p>
                      </div>
                    </>
                  )}
                {currentUser &&
                  chatroom &&
                  post.clientUserID &&
                  !post.isAvairable &&
                  currentUser.uid === chatroom?.postUserID && (
                    <div className="rounded-xl p-2 text-center mt-3">
                      <p className="mt-1 text-mainGreen font-semibold">
                        取引完了しました
                      </p>
                    </div>
                  )}
              </div>
              <div className="shadow-xl w-full">
                <div className="w-full bg-white rounded-lg overflow-y-scroll z-10 chatScreenHeight">
                  <div>
                    {messages &&
                      messages.map((message, index) =>
                        message.clientDecision ? (
                          <div className="text-center text-gray-900 border-gray-200 border-b-2 border-t-2 my-5 py-2">
                            取引者を決定しました
                          </div>
                        ) : message.dealInterruption ? (
                          <div className="text-center text-gray-900 border-gray-200 border-b-2 border-t-2 my-5 py-2">
                            取引を中断しました
                          </div>
                        ) : message.dealCompleted ? (
                          <div className="text-center text-gray-900 border-gray-200 border-b-2 border-t-2 my-5 py-2">
                            取引完了です！
                          </div>
                        ) : message.pleaseRate ? (
                          //レビューしたか判定
                          reviewsOnHold &&
                          reviewsOnHold.filter(
                            (review) => review.reviewerID === currentUser.uid
                          ).length === 1 ? (
                            postReviews.length !== 2 && (
                              <div className="text-center text-gray-900 border-gray-200 border-b-2 border-t-2 my-5 py-2">
                                評価完了です！
                              </div>
                            )
                          ) : (
                            postReviews.length !== 2 && (
                              <div
                                className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3 mx-3"
                                onClick={rating}
                              >
                                <p className="mt-1 text-mainGreen font-semibold">
                                  評価をお願いします
                                </p>
                              </div>
                            )
                          )
                        ) : message.rateCompleted ? (
                          <div className="text-center text-gray-900 border-gray-200 border-b-2 border-t-2 my-5 py-2">
                            評価完了です！
                          </div>
                        ) : message.userID === currentUser.uid ? (
                          <div key={index}>
                            {message.firstOnDate && (
                              <div className="text-center mx-auto text-gray-600 text-sm border border-gray-600 rounded-full py-0.5 w-36">
                                {createdMessageDate(message)}
                              </div>
                            )}
                            <div className="flex w-full mt-2 max-w-2xl ml-auto justify-end p-4">
                              <div className="flex">
                                <p className="text-xs text-gray-500 leading-none whitespace-nowrap mt-auto mr-2">
                                  {createdMessageTime(message)}
                                </p>
                                <div>
                                  <p className="text-gray-500 text-xs ml-auto text-right">
                                    {message.username}
                                  </p>
                                  {message.image === "" ? (
                                    <div className="bg-mainGreen text-white px-3 py-2.5 rounded-l-lg rounded-br-lg">
                                      <p className="text-sm whitespace-pre-wrap ">
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
                                      {console.log("カレント", message.image)}
                                    </>
                                  )}
                                </div>
                              </div>
                              <img
                                src={message.avatar}
                                className="h-10 w-10 rounded-full bg-gray-300 ml-3"
                              />
                            </div>
                          </div>
                        ) : (
                          <div key={index}>
                            {message.firstOnDate && (
                              <div className="text-center mx-auto text-gray-600 text-sm border border-gray-600 rounded-full py-0.5 w-36">
                                {createdMessageDate(message)}
                              </div>
                            )}
                            <div className="flex w-full mt-2 space-x-3 max-w-2xl p-4  targetMessage">
                              <img
                                src={message.avatar}
                                className="h-10 w-10 rounded-full bg-gray-300 ml-3"
                              />
                              <div className="flex">
                                <div>
                                  <p className="text-gray-500 text-xs mr-auto text-left">
                                    {message.username}
                                  </p>
                                  {message.image === "" ? (
                                    <div className="bg-gray-300 px-3 py-2.5 rounded-r-lg rounded-bl-lg">
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
                                      {console.log("相手", message.image)}
                                    </>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 leading-none mt-auto ml-2">
                                  {createdMessageTime(message)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    <div ref={ref} />
                  </div>
                </div>
                <form onSubmit={sendMessage}>
                  <div className="relative z-20">
                    <div className="absolute bottom-0 w-full">
                      <div className="bg-gray-300 p-2 flex items-center rounded-b-lg">
                        <div className="relative w-full z-20">
                          <TextareaAutosize
                            maxRows={5}
                            className="flex items-center h-10 w-full rounded pl-3 pr-8 text-sm resize-none focus:outline-none focus:border-sendBG z-20"
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
                          className="w-10 h-10 bg-sendBG rounded-lg ml-1 mt-auto cursor-pointer z-20 hover:opacity-90"
                          disabled={messageText === ""}
                        >
                          <IoSend className="text-white text-xl mx-auto my-2.5" />
                        </button>
                      </div>
                    </div>
                    <div className="opacity-0 h-14 z-0"></div>
                  </div>
                </form>
              </div>
            </div>
          </Layout>
        </Div100vh>
      </div>
    </div>
  );
};

export default messages;
