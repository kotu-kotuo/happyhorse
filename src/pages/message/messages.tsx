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
import TextareaAutosize from "react-textarea-autosize";
import Div100vh from "react-div-100vh";
import ImageModal from "../../components/molecules/ImageModal";
import { setPostStates } from "../../utils/states";

const messages = () => {
  const { user, currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [post, setPost] = useState<Post>(postInitialValues);
  const [messages, setMessages] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [isOpenMyModal, setIsOpenMyModal] = useState(false);
  const [isOpenYourModal, setIsOpenYourModal] = useState(false);
  const [messageText, setMessageText] = useState("");
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
    if (router.query.pid && currentUser) {
      db.collectionGroup("messages")
        .where("postID", "==", router.query.pid)
        .orderBy("createdAt")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              userID: doc.data().userID,
              postID: doc.data().postID,
              username: doc.data().username,
              avatar: doc.data().avatar,
              messageText: doc.data().messageText,
              image: doc.data().image,
              createdAt: doc.data().createdAt,
              firstOnDate: doc.data().firstOnDate,
            }))
          )
        );
    }
  }, [router.query.pid, currentUser]);

  useEffect(() => {
    if (post && currentUser) {
      if (currentUser.uid === post.userID) {
      } else {
        db.collection("users")
          .doc(`${post.userID}`)
          .collection("posts")
          .doc(`${post.postID}`)
          .collection("chatrooms")
          .doc(`${currentUser.uid}`)
          .get()
          .then((snapshot) => {
            if (!snapshot.data()) return;
            setChatroom({
              sendUserID: snapshot.data().sendUserID,
              postUserID: snapshot.data().postUserID,
              postID: snapshot.data().postID,
              createdAt: snapshot.data().createdAt,
            });
          });
      }
    }
  }, [post]);

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
      //日付を表示するか判定
      if (
        messages
          .map(
            (message) =>
              new Date(message.createdAt.seconds * 1000).toLocaleDateString
          )
          .includes(new Date().toLocaleDateString)
      ) {
        var handleShowDate = false;
      } else {
        var handleShowDate = true;
      }

      //最初にメッセージ送る時チャットルーム作成
      if (currentUser.uid !== post.userID && messages.length === 0) {
        await db
          .collection("users")
          .doc(`${post.userID}`)
          .collection("posts")
          .doc(`${post.postID}`)
          .collection("chatrooms")
          .doc(`${currentUser.uid}`)
          .set({
            sendUserID: currentUser.uid,
            postUserID: post.userID,
            postID: post.postID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

        await db
          .collection("users")
          .doc(`${post.userID}`)
          .collection("posts")
          .doc(`${post.postID}`)
          .collection("chatrooms")
          .doc(`${currentUser.uid}`)
          .get()
          .then((snapshot) =>
            setChatroom({
              sendUserID: snapshot.data().sendUserID,
              postUserID: snapshot.data().postUserID,
              postID: snapshot.data().postID,
              createdAt: snapshot.data().createdAt,
            })
          );

        const date = new Date();
        const dateTime = date.getTime();

        console.log(post.sendMessageUser);
        console.log(post.sendMessageUser.length);
        //postにメッセージ送った人を記録
        if (post.sendMessageUser[0].ID) {
          await db
            .collection("users")
            .doc(`${post.userID}`)
            .collection("posts")
            .doc(`${post.postID}`)
            .update({
              sendMessageUser: [
                {
                  ID: currentUser.uid,
                  createdAt: dateTime,
                },
                ...post.sendMessageUser,
              ],
            });
        } else {
          await db
            .collection("users")
            .doc(`${post.userID}`)
            .collection("posts")
            .doc(`${post.postID}`)
            .update({
              sendMessageUser: [
                {
                  ID: currentUser.uid,
                  createdAt: dateTime,
                },
              ],
            });
        }

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
              snapshot.docs.map((doc) => ({
                userID: doc.data().userID,
                postID: doc.data().postID,
                username: doc.data().username,
                avatar: doc.data().avatar,
                messageText: doc.data().messageText,
                image: doc.data().image,
                createdAt: doc.data().createdAt,
                firstOnDate: doc.data().firstOnDate,
              }))
            )
          );
        await setMessageText("");
      } else {
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
              snapshot.docs.map((doc) => ({
                userID: doc.data().userID,
                postID: doc.data().postID,
                username: doc.data().username,
                avatar: doc.data().avatar,
                messageText: doc.data().messageText,
                image: doc.data().image,
                createdAt: doc.data().createdAt,
                firstOnDate: doc.data().firstOnDate,
              }))
            )
          );
        await setMessageText("");
      }
    }
  };

  //画像送信
  const sendImage = async (e) => {
    if (currentUser && post.postID && e.target.files[0]) {
      //日付を表示するか判定
      if (
        messages
          .map(
            (message) =>
              new Date(message.createdAt.seconds * 1000).toLocaleDateString
          )
          .includes(new Date().toLocaleDateString)
      ) {
        var handleShowDate = false;
      } else {
        var handleShowDate = true;
      }

      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + e.target.files[0].size;
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
                  });

                await db
                  .collection("users")
                  .doc(`${post.userID}`)
                  .collection("posts")
                  .doc(`${post.postID}`)
                  .collection("messages")
                  .orderBy("createdAt")
                  .get()
                  .then((snapshot) =>
                    setMessages(
                      snapshot.docs.map((doc) => ({
                        userID: doc.data().userID,
                        postID: doc.data().postID,
                        username: doc.data().username,
                        avatar: doc.data().avatar,
                        messageText: doc.data().messageText,
                        image: doc.data().image,
                        createdAt: doc.data().createdAt,
                        firstOnDate: doc.data().firstOnDate,
                      }))
                    )
                  );
              });
          }
        );
    }
  };

  return (
    <div>
      {console.log(messages)}
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
              </div>
              <div className="shadow-xl w-full">
                <div className="w-full bg-white rounded-lg overflow-y-scroll z-10 chatScreenHeight">
                  <div>
                    {messages &&
                      messages.map((message, index) =>
                        message.userID === currentUser.uid ? (
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
                            <div className="flex w-full mt-2 space-x-3 max-w-2xl p-4">
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
