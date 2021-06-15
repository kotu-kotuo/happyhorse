import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { db } from "../../firebase/firebase";
import {
  chatroomInitialValues,
  messageInitialValues,
  postInitialValues,
  reviewInitialValues,
} from "../../utils/initialValues";
import { Chatroom, Message, Post, Review } from "../../types/types";
import { IoSend, IoChevronBack } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import ImageModal from "../../components/molecules/ImageModal";
import {
  setChatroomStates,
  setMessageStates,
  setPostStates,
  setReviewStates,
  setUserState,
} from "../../utils/states";
import "react-confirm-alert/src/react-confirm-alert.css";
import DealProgressButton from "../../components/atoms/DealProgressButton";
import isFirstOnDate from "../../functions/message/isFirstOnDate";
import { NextPage } from "next";
import sendMessage from "../../functions/message/sendMessage";
import sendImage from "../../functions/message/sendImage";
import decideClient from "../../functions/message/decideClient";
import interruptionDeal from "../../functions/message/interruptionDeal";
import completedDeal from "../../functions/message/completedDeal";
import rating from "../../functions/message/rating";

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
  const [isOpenMyModal, setIsOpenMyModal] = useState(false);
  const [isOpenYourModal, setIsOpenYourModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [rateValue, setRateValue] = useState("good");
  const [reviewText, setReviewText] = useState("");
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
      setMessageReceiver(setUserState(user));
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

  //スクロール
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  //時間をUNIXから変換
  const createdMessageTime = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const createdMessageDate = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleDateString();
  };

  return (
    <div>
      {console.log(isFirstOnDate(messages))}

      <div>
        <Layout title="messages">
          {/* モバイルの取引進行ボタン、メッセージヘッダー =========================================*/}
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
                    onClick={() => {
                      decideClient(
                        user,
                        currentUser,
                        post,
                        chatroom,
                        messages,
                        setMessages,
                        messageReceiver
                      );
                    }}
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
                      onClick={() => {
                        completedDeal(
                          post,
                          chatroom,
                          user,
                          currentUser,
                          messageReceiver,
                          messages,
                          setMessages
                        );
                      }}
                    >
                      <p className="mt-1 text-mainGreen font-semibold">
                        取引を完了する
                      </p>
                    </div>
                    <div
                      className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white w-2/5"
                      onClick={() => {
                        interruptionDeal(
                          post,
                          chatroom,
                          user,
                          currentUser,
                          messageReceiver,
                          messages,
                          setMessages
                        );
                      }}
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
                    <div className="m-1 text-sm line-clamp-3">{post.title}</div>
                    <div className="p-1"> {post.price}円</div>
                  </div>
                </div>
              </Link>
              <DealProgressButton
                user={user}
                currentUser={currentUser}
                chatroom={chatroom}
                post={post}
                messages={messages}
                setMessages={setMessages}
                messageReceiver={messageReceiver}
              />
            </div>
            {/* メッセージリスト =========================================*/}
            <div className="shadow-xl w-full">
              <div className="w-full bg-white rounded-lg overflow-y-scroll z-10 chatScreenHeight pb-6 px-2 sm:px-0">
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
                            (review) => review.reviewerID === currentUser?.uid
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
                                onClick={() => {
                                  rating(
                                    post,
                                    chatroom,
                                    messages,
                                    setMessages,
                                    currentUser,
                                    user,
                                    rateValue,
                                    reviewText,
                                    reviewsOnHold,
                                    setReviewsOnHold,
                                    messageReceiver,
                                    setRateValue,
                                    setReviewText
                                  );
                                }}
                              >
                                <p className="mt-1 text-mainGreen font-semibold">
                                  評価をお願いします
                                </p>
                              </div>
                            )
                          )
                        ) : message.rateCompleted ? (
                          <div className="messageAnnounce">評価完了です！</div>
                        ) : message.userID === currentUser?.uid ? (
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
                  <div ref={ref} className="h-20" />
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  sendMessage(
                    e,
                    currentUser,
                    user,
                    post,
                    messages,
                    setMessages,
                    messageText,
                    setMessageText,
                    messageReceiver,
                    chatroom,
                    setChatroom
                  );
                }}
              >
                <div className="relative z-20">
                  <div className="absolute bottom-0 w-full">
                    <div className="bg-gray-300 p-1 flex items-center sm:rounded-b-lg sm:p-2">
                      <div className="relative w-full z-20">
                        <TextareaAutosize
                          maxRows={5}
                          className="flex items-center h-10 w-full rounded pl-3 pr-8 text-sm resize-none focus:outline-none focus:border-subBlue z-20"
                          placeholder="Type your message…"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
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
                          onChange={(e) => {
                            sendImage(
                              e,
                              currentUser,
                              user,
                              post,
                              messages,
                              setMessages,
                              messageReceiver,
                              chatroom,
                              setChatroom
                            );
                          }}
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
