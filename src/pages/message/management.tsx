import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import SwitchDisplay from "../../components/molecules/SwitchDisplay";
import {
  setChatroomStates,
  setPostStates,
  setReviewStates,
} from "../../utils/states";
import { Post } from "../../types/types";
import {
  chatroomInitialValues,
  postInitialValues,
} from "../../utils/initialValues";
import { FaRegUser, FaRegClock, FaRegHeart } from "react-icons/fa";

const management = () => {
  const { currentUser } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState<Post[]>([postInitialValues]);
  const [sendMessageChatrooms, setSendMessageChatrooms] = useState([
    chatroomInitialValues,
  ]);
  const [myPostChatrooms, setMyPostChatrooms] = useState([
    chatroomInitialValues,
  ]);
  const [isMyPostsHidden, setIsMyPostsHidden] = useState(false);
  const [isMyPostsBlockHidden, setIsMyPostsBlockHidden] = useState(false);
  const [isSendHidden, setIsSendHidden] = useState(true);
  const [isMyPostChatroomsHidden, setIsMyPostChatroomsHidden] = useState(true);
  const [clickPid, setClickPid] = useState("");
  const [reviewsOnHold, setReviewsOnHold]: any = useState([]);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .where("sendMessageUserIDs", "!=", [])
        .onSnapshot((snapshot) => {
          setMyPosts(
            snapshot.docs
              .map((doc) => setPostStates(doc.data()))
              .sort((a, b) => -(a.messageUpdatedAt - b.messageUpdatedAt))
          );
        });

      db.collectionGroup("chatrooms")
        .where("sendUserID", "==", currentUser.uid)
        .orderBy("messageUpdatedAt", "desc")
        .onSnapshot((snapshot) => {
          setSendMessageChatrooms(
            snapshot.docs.map((doc) => setChatroomStates(doc.data()))
          );
        });

      db.collectionGroup("chatrooms")
        .where("postUserID", "==", currentUser.uid)
        .orderBy("messageUpdatedAt", "desc")
        .onSnapshot((snapshot) =>
          setMyPostChatrooms(
            snapshot.docs.map((doc) => setChatroomStates(doc.data()))
          )
        );
    }

    db.collection("reviewsOnHold")
      .get()
      .then((snapshot) => {
        if (!snapshot) return;
        setReviewsOnHold(
          snapshot.docs.map((doc) => setReviewStates(doc.data()))
        );
      });
  }, [currentUser]);

  //時間をUNIXから変換
  const createdTime = (postTime) => {
    const time = new Date(postTime?.seconds * 1000);
    return time.toLocaleDateString();
  };

  return (
    <Layout title="management">
      <div className="mt-10 sm:mt-16">
        <SwitchDisplay
          setIsLeftHidden={setIsMyPostsBlockHidden}
          setIsRightHidden={setIsSendHidden}
          title={"メッセージ管理"}
          textLeft={"自分の投稿"}
          textRight={"メッセージを送った投稿"}
        />
        <div className="max-w-3xl w-full mx-auto mt-4 sm:mt-8">
          {myPosts && sendMessageChatrooms && currentUser && (
            <>
              <div hidden={isMyPostsBlockHidden}>
                <div hidden={isMyPostsHidden}>
                  {myPosts.map((myPost) => (
                    <div className="mx-2 my-4 rounded-md shadow border-gray-500 sm:my-6">
                      <div
                        onClick={(e) => {
                          setIsMyPostsHidden(true);
                          setIsMyPostChatroomsHidden(false);
                          setClickPid(e.currentTarget.getAttribute("data-id"));
                        }}
                        data-id={myPost.postID}
                        className="cursor-pointer"
                      >
                        <div className="flex">
                          <div>
                            <img
                              src={myPost.images[0]}
                              className="h-18 w-18 rounded-l-md mr-3 block object-cover sm:h-18 sm:w-28"
                            />
                          </div>
                          <div className="px-3 py-1 max-w-3xl w-full">
                            <div className="fontSize-base text-gray-900 mr-0.5 mt-0 line-clamp-1 sm:mr-2 sm:mt-1">
                              {myPost.title}
                            </div>
                            <p className="fontSize-sm text-gray-500 mt-1 mb-1 line-clamp-1 sm:mt-0 sm:mb-0">
                              {/* レビューが完了したユーザの最新メッセージを変更 */}
                              {myPost.latestMessage === "評価をお願いします" &&
                              reviewsOnHold.filter(
                                (review) => review.reviewerID === myPost.userID
                              ).length !== 0 &&
                              reviewsOnHold.filter(
                                (review) => review.postID === myPost.postID
                              ).length !== 0
                                ? "評価完了しました"
                                : myPost.latestMessage}
                            </p>
                            <div className="flex justify-end items-center w-full">
                              <div className="mr-2 flex items-center">
                                <FaRegUser className="text-gray-500 text-xs mr-0.5" />
                                <div className="text-gray-500 text-xs">
                                  {myPost.sendMessageUserIDs.length}
                                </div>
                              </div>
                              <div className="mr-2 flex items-center">
                                <FaRegHeart className="text-gray-500 text-xs mr-1" />
                                <div className="text-gray-500 text-xs">
                                  {myPost.likeUserIDs.length}
                                </div>
                              </div>
                              <div className="mr-2 flex items-center">
                                <FaRegClock className="text-gray-500 text-xs mr-0.5" />
                                <div className="text-gray-500 text-xs">
                                  {createdTime(myPost.messageUpdatedAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div hidden={isMyPostChatroomsHidden}>
                  {myPostChatrooms
                    .filter((element) => clickPid === element.postID)
                    .map((myPostChatroom) => (
                      <>
                        <Link
                          href={{
                            pathname: "/message/messages",
                            query: {
                              uid: myPostChatroom.postUserID,
                              pid: myPostChatroom.postID,
                              cid: myPostChatroom.sendUserID,
                            },
                          }}
                        >
                          <div className="mx-2 my-3 rounded-r-md rounded-l-full shadow border-gray-500 cursor-pointer sm:my-6">
                            <div className="flex">
                              <div>
                                {myPostChatroom.deletedAccount === true ? (
                                  <img
                                    src={myPostChatroom.sendUserAvatar}
                                    className="h-12 w-12 rounded-full mr-3 block object-cover hover:opacity-80 sm:h-16 sm:w-16"
                                  />
                                ) : (
                                  <Link
                                    href={{
                                      pathname: "/profile",
                                      query: {
                                        uid: myPostChatroom.sendUserID,
                                      },
                                    }}
                                  >
                                    <img
                                      src={myPostChatroom.sendUserAvatar}
                                      className="h-12 w-12 rounded-full mr-3 block object-cover hover:opacity-80 sm:h-16 sm:w-16"
                                    />
                                  </Link>
                                )}
                              </div>
                              <div className="px-3 py-1 max-w-3xl w-full">
                                <div className="flex justify-between">
                                  <div className="flex items-center">
                                    <div className="fontSize-base text-gray-900 line-clamp-1 sm:mr-2">
                                      {myPostChatroom.sendUserName}
                                    </div>
                                    <div className="text-gray-500 text-xs ml-1 mr-1">{`(${myPostChatroom.messageCount})`}</div>
                                  </div>
                                  <div className="text-gray-500 text-xs mt-0.5">
                                    {createdTime(
                                      myPostChatroom.messageUpdatedAt
                                    )}
                                  </div>
                                </div>
                                <p className="fontSize-sm text-gray-500 mt-1 line-clamp-1 sm:mt-2">
                                  {myPostChatroom.latestMessage ===
                                    "評価をお願いします" &&
                                  reviewsOnHold.filter(
                                    (review) =>
                                      review.reviewerID ===
                                      myPostChatroom.postUserID
                                  ).length !== 0 &&
                                  reviewsOnHold.filter(
                                    (review) =>
                                      review.postID === myPostChatroom.postID
                                  ).length !== 0
                                    ? "評価完了しました"
                                    : myPostChatroom.latestMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </>
                    ))}
                  <div
                    onClick={() => {
                      setIsMyPostsHidden(false),
                        setIsMyPostChatroomsHidden(true);
                    }}
                    className="text-gray-900 border-b border-gray-900 ml-12 w-20 cursor-pointer"
                  >
                    戻る
                  </div>
                </div>
              </div>
              <div hidden={isSendHidden}>
                {sendMessageChatrooms.map((sendMessageChatroom) => (
                  <Link
                    href={{
                      pathname: "/message/messages",
                      query: {
                        uid: sendMessageChatroom.postUserID,
                        pid: sendMessageChatroom.postID,
                        cid: sendMessageChatroom.sendUserID,
                      },
                    }}
                  >
                    <div>
                      <div className="mx-2 my-3 rounded-md shadow border-gray-500 cursor-pointer sm:my-6">
                        <div className="flex">
                          <div>
                            <img
                              src={sendMessageChatroom.postImage}
                              className="h-12 w-12 rounded-l-md mr-3 block object-cover sm:h-16 sm:w-28"
                            />
                          </div>
                          <div className="px-3 py-1 max-w-3xl w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="fontSize-base text-gray-900 line-clamp-1 sm:mr-2">
                                  {sendMessageChatroom.postTitle}
                                </div>
                                <div className="text-gray-500 text-xs ml-1 mr-1">{`(${sendMessageChatroom.messageCount})`}</div>
                              </div>
                              <div className=" text-xs text-gray-500 mt-0.5">
                                {createdTime(
                                  sendMessageChatroom.messageUpdatedAt
                                )}
                              </div>
                            </div>
                            <p className="fontSize-sm text-gray-500 line-clamp-1 mt-1 sm:mt-2">
                              {sendMessageChatroom.latestMessage ===
                                "評価をお願いします" &&
                              reviewsOnHold.filter(
                                (review) =>
                                  review.reviewerID ===
                                  sendMessageChatroom.sendUserID
                              ).length !== 0 &&
                              reviewsOnHold.filter(
                                (review) =>
                                  review.postID === sendMessageChatroom.postID
                              ).length !== 0
                                ? "評価完了しました"
                                : sendMessageChatroom.latestMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {console.log(myPosts)}
        {console.log(sendMessageChatrooms)}
      </div>
    </Layout>
  );
};

export default management;
