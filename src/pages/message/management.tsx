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
      <div className="mt-16">
        <SwitchDisplay
          setIsLeftHidden={setIsMyPostsBlockHidden}
          setIsRightHidden={setIsSendHidden}
          title={"メッセージ管理"}
          textLeft={"自分の投稿"}
          textRight={"メッセージを送った投稿"}
        />
        <div className="max-w-3xl w-full mx-auto mt-8">
          {myPosts && sendMessageChatrooms && currentUser && (
            <>
              <div hidden={isMyPostsBlockHidden}>
                <div hidden={isMyPostsHidden}>
                  {myPosts.map((myPost) => (
                    <div className="mx-2 my-6 rounded-md shadow border-gray-500 ">
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
                              className="h-16 w-28 rounded-l-md mr-3 block object-cover"
                            />
                          </div>
                          <div className="px-3 py-1 max-w-3xl w-full">
                            <div className="flex">
                              <div className="text-gray-900 mr-2 whitespace-nowrap">
                                {myPost.title}
                              </div>
                              <div className="flex w-full">
                                <div className="text-gray-600 text-xs mt-auto whitespace-nowrap">{`メッセージユーザー(${myPost.sendMessageUserIDs.length})`}</div>
                                <div className="text-right mt-auto ml-auto max-w-xl w-full">
                                  <div className="text-gray-500 text-xs mt-auto ml-auto">
                                    {createdTime(myPost.messageUpdatedAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
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
                          <div className="mx-2 my-6 rounded-r-md rounded-l-full shadow border-gray-500 cursor-pointer">
                            <div className="flex">
                              <div>
                                <img
                                  src={myPostChatroom.sendUserAvatar}
                                  className="h-16 w-16 rounded-full mr-3 block object-cover"
                                />
                              </div>
                              <div className="px-3 py-1 max-w-3xl w-full">
                                <div className="flex">
                                  <div className="text-gray-900 mr-2 whitespace-nowrap">
                                    {myPostChatroom.sendUserName}
                                  </div>
                                  <div className="flex w-full">
                                    <div className="text-right mt-auto ml-auto max-w-xl w-full">
                                      <div className="text-gray-500 text-xs mt-auto ml-auto">
                                        {createdTime(
                                          myPostChatroom.messageUpdatedAt
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">
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
                      <div className="mx-2 my-6 rounded-md shadow border-gray-500 cursor-pointer">
                        <div className="flex">
                          <div>
                            <img
                              src={sendMessageChatroom.postImage}
                              className="h-16 w-28 rounded-l-md mr-3 block object-cover"
                            />
                          </div>
                          <div className="px-3 py-1 max-w-3xl w-full">
                            <div className="flex">
                              <div className="text-gray-900 mr-2 whitespace-nowrap">
                                {sendMessageChatroom.postTitle}
                              </div>
                              <div className="flex w-full">
                                <div className="text-right mt-auto ml-auto max-w-xl w-full">
                                  <div className="text-gray-500 text-xs mt-auto ml-auto">
                                    {createdTime(
                                      sendMessageChatroom.messageUpdatedAt
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
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
