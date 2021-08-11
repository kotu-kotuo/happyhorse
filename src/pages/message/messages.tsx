import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db } from "../../firebase/firebase";
import {
  chatroomInitialValues,
  messageInitialValues,
  postInitialValues,
  reviewInitialValues,
} from "../../utils/initialValues";
import { Chatroom, Message, Post, Review, User } from "../../types/types";
import {
  setChatroomStates,
  setMessageStates,
  setPostStates,
  setReviewStates,
  setUserState,
} from "../../utils/states";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NextPage } from "next";
import decideClient from "../../functions/message/decideClient";
import interruptionDeal from "../../functions/message/interruptionDeal";
import completedDeal from "../../functions/message/completedDeal";
import RatingModal from "../../components/pages/messages/RatingModal";
import MessageAnnounce from "../../components/pages/messages/MessageAnnounce";
import MobileProgressButton from "../../components/pages/messages/MobileProgressButton";
import MessageSidemenu from "../../components/pages/messages/MessageSidemenu";
import MobileMessageHeader from "../../components/pages/messages/MobileMessageHeader";
import MobilePostInfo from "../../components/pages/messages/MobilePostInfo";
import MyMessage from "../../components/pages/messages/MyMessage";
import YourMessage from "../../components/pages/messages/YourMessage";
import MessageSend from "../../components/pages/messages/MessageSend";
import sendReviews from "../../functions/message/sendReviews";
import useRedirectLogin from "../../hooks/useRedirectLogin";

const messages: NextPage = () => {
  const { user, currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [post, setPost] = useState<Post>(postInitialValues);
  const [chatroom, setChatroom] = useState<Chatroom>(chatroomInitialValues);
  const [messages, setMessages] = useState<Message[]>([messageInitialValues]);
  const [reviewsOnHold, setReviewsOnHold] = useState<Review[]>([
    reviewInitialValues,
  ]);
  const [postReviews, setPostReviews] = useState<Review[]>([
    reviewInitialValues,
  ]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageReceiver, setMessageReceiver] = useState<User>(null);
  const [rateValue, setRateValue] = useState("good");
  const [reviewText, setReviewText] = useState("");
  const [isOpenRatingModal, setIsOpenRatingModal] = useState(false);
  const ref = useRef(null);

  useRedirectLogin(currentUser);

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
    // if (router.query.uid && router.query.pid && router.query.cid) {
    //   db.collection("users")
    //     .doc(`${router.query.uid}`)
    //     .collection("posts")
    //     .doc(`${router.query.pid}`)
    //     .collection("chatrooms")
    //     .doc(`${router.query.cid}`)
    //     .get()
    //     .then((snapshot) => {
    //       if (!snapshot.data()) return;
    //       setChatroom(setChatroomStates(snapshot.data()));
    //     });
    // }

    if (router.query.pid) {
      db.collection("reviewsOnHold")
        .where("postID", "==", router.query.pid)
        .get()
        .then((snapshot) => {
          if (!snapshot) return;
          setReviewsOnHold(
            snapshot.docs.map((element) => setReviewStates(element.data()))
          );
        });
    }
  }, [router.query.uid, router.query.pid, router.query.cid]);

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

  useEffect(() => {
    if (chatroom.postID !== "") {
      db.collection("users")
        .doc(`${chatroom.postUserID}`)
        .collection("posts")
        .doc(`${chatroom.postID}`)
        .collection("chatrooms")
        .doc(`${chatroom.sendUserID}`)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => setMessageStates(doc.data())))
        );
    }
  }, [chatroom]);

  useEffect(() => {
    if (currentUser && chatroom && post && chatroom.postID !== "") {
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
    } else {
      if (post.userID) {
        db.collection("users")
          .doc(`${post.userID}`)
          .get()
          .then((snapshot) =>
            setMessageReceiver(setUserState(snapshot.data()))
          );
      }
    }
  }, [currentUser, chatroom, post]);

  //レビューが2つ揃ったら送信
  useEffect(() => {
    if (post && chatroom && currentUser && user && reviewsOnHold.length === 2)
      sendReviews(
        reviewsOnHold,
        user,
        currentUser,
        post,
        messages,
        chatroom,
        messageReceiver,
        setMessages
      );
  }, [reviewsOnHold]);

  //スクロール
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div>
      <RatingModal
        isOpenRatingModal={isOpenRatingModal}
        setIsOpenRatingModal={setIsOpenRatingModal}
        setRateValue={setRateValue}
        setReviewText={setReviewText}
        setReviewsOnHold={setReviewsOnHold}
        post={post}
        currentUser={currentUser}
        user={user}
        rateValue={rateValue}
        reviewText={reviewText}
      />
      <div>
        {console.log(chatroom, messages, messageReceiver, post)}
        <Layout
          title={
            `メッセージ | ${messageReceiver?.username}さん | happy horse` || ""
          }
          index="noindex"
        >
          {currentUser && (
            <>
              {/* モバイルの取引進行ボタン、ヘッダー ================================*/}
              <div className="sm:hidden">
                <MobileMessageHeader
                  messageReceiver={messageReceiver}
                  router={router}
                />
                <MobileProgressButton
                  currentUser={currentUser}
                  user={user}
                  post={post}
                  chatroom={chatroom}
                  messages={messages}
                  setMessages={setMessages}
                  messageReceiver={messageReceiver}
                  decideClient={decideClient}
                  completedDeal={completedDeal}
                  interruptionDeal={interruptionDeal}
                />
              </div>
              <div className="mx-auto flex flex-row-reverse p-0 sm:px-2 sm:mt-10">
                {/* webのサイドメニュー =========================================*/}
                <MessageSidemenu
                  user={user}
                  currentUser={currentUser}
                  post={post}
                  chatroom={chatroom}
                  messages={messages}
                  setMessages={setMessages}
                  messageReceiver={messageReceiver}
                />
                {/* メッセージリスト =========================================*/}
                <div className="shadow-xl w-full">
                  <div className="w-full bg-white rounded-lg overflow-y-scroll z-10 chatScreenHeight pb-6 px-2 sm:px-0">
                    <div className="pt-20 sm:pt-0">
                      <MobilePostInfo
                        currentUser={currentUser}
                        post={post}
                        chatroom={chatroom}
                      />
                      {messages &&
                        messages.map((message, index) => (
                          <div key={index}>
                            {message.clientDecision ? (
                              <MessageAnnounce value={"取引者を決定しました"} />
                            ) : message.dealInterruption ? (
                              <MessageAnnounce value={"取引を中断しました"} />
                            ) : message.dealCompleted ? (
                              <MessageAnnounce value={"取引完了です！"} />
                            ) : message.pleaseRate ? (
                              //レビューしたか判定
                              reviewsOnHold &&
                              reviewsOnHold.filter(
                                (review) =>
                                  review.reviewerID === currentUser?.uid
                              ).length === 1 ? (
                                postReviews.length !== 2 && (
                                  <MessageAnnounce value={"評価完了です！"} />
                                )
                              ) : (
                                postReviews.length !== 2 && (
                                  <div
                                    className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3 mb-5 mx-3"
                                    onClick={() => {
                                      setIsOpenRatingModal(true);
                                    }}
                                  >
                                    <p className="mt-1 text-mainGreen font-bold sm:font-semibold">
                                      評価をお願いします
                                    </p>
                                  </div>
                                )
                              )
                            ) : message.rateCompleted ? (
                              <MessageAnnounce value={"評価完了です！"} />
                            ) : message.userID === currentUser?.uid ? (
                              // 自分のメッセージ
                              <>
                                {(message.messageText || message.image) && (
                                  <MyMessage
                                    message={message}
                                    setIsOpenModal={setIsOpenModal}
                                    isOpenModal={isOpenModal}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                  />
                                )}
                              </>
                            ) : (
                              //相手のメッセージ
                              <>
                                {(message.messageText || message.image) && (
                                  <YourMessage
                                    message={message}
                                    setIsOpenModal={setIsOpenModal}
                                    isOpenModal={isOpenModal}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      <div ref={ref} className="h-20" />
                    </div>
                  </div>
                  <MessageSend
                    currentUser={currentUser}
                    user={user}
                    post={post}
                    messages={messages}
                    setMessages={setMessages}
                    messageText={messageText}
                    setMessageText={setMessageText}
                    messageReceiver={messageReceiver}
                    chatroom={chatroom}
                    setChatroom={setChatroom}
                  />
                </div>
              </div>
            </>
          )}
        </Layout>
      </div>
    </div>
  );
};

export default messages;
