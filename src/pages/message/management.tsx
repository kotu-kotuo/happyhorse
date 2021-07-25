import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { db } from "../../firebase/firebase";
import SwitchDisplay from "../../components/molecules/SwitchDisplay";
import {
  setChatroomStates,
  setPostStates,
  setReviewStates,
} from "../../utils/states";
import { Chatroom, Post, Review } from "../../types/types";
import {
  chatroomInitialValues,
  postInitialValues,
  reviewInitialValues,
} from "../../utils/initialValues";
import { NextPage } from "next";
import MyPostList from "../../components/pages/management/MyPostList";
import MyChatroomList from "../../components/pages/management/MyChatroomList";
import SendMessageChatroomList from "../../components/pages/management/SendMessageChatroomList";
import useRedirectLogin from "../../hooks/useRedirectLogin";

const management: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState<Post[]>([postInitialValues]);
  const [sendMessageChatrooms, setSendMessageChatrooms] = useState<Chatroom[]>([
    chatroomInitialValues,
  ]);
  const [myPostChatrooms, setMyPostChatrooms] = useState<Chatroom[]>([
    chatroomInitialValues,
  ]);
  const [isMyPostsHidden, setIsMyPostsHidden] = useState(false);
  const [isMyPostsBlockHidden, setIsMyPostsBlockHidden] = useState(false);
  const [isSendHidden, setIsSendHidden] = useState(true);
  const [isMyPostChatroomsHidden, setIsMyPostChatroomsHidden] = useState(true);
  const [clickPid, setClickPid] = useState("");
  const [reviewsOnHold, setReviewsOnHold] = useState<Review[]>([
    reviewInitialValues,
  ]);

  useRedirectLogin(currentUser);

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

  return (
    <Layout title="メッセージ管理画面">
      {currentUser && (
        <div>
          <SwitchDisplay
            setIsLeftHidden={setIsMyPostsBlockHidden}
            setIsRightHidden={setIsSendHidden}
            title={"メッセージ管理"}
            textLeft={"自分の投稿"}
            textRight={"メッセージを送った投稿"}
          />
          <div className="max-w-3xl w-full mx-auto mt-4 pb-4 sm:mt-8">
            {myPosts && sendMessageChatrooms && currentUser && (
              <>
                <div hidden={isMyPostsBlockHidden}>
                  <div hidden={isMyPostsHidden}>
                    <MyPostList
                      myPosts={myPosts}
                      setIsMyPostsHidden={setIsMyPostsHidden}
                      setIsMyPostChatroomsHidden={setIsMyPostChatroomsHidden}
                      setClickPid={setClickPid}
                      reviewsOnHold={reviewsOnHold}
                    />
                  </div>

                  <div hidden={isMyPostChatroomsHidden}>
                    <MyChatroomList
                      myPostChatrooms={myPostChatrooms}
                      clickPid={clickPid}
                      reviewsOnHold={reviewsOnHold}
                      setIsMyPostsHidden={setIsMyPostsHidden}
                      setIsMyPostChatroomsHidden={setIsMyPostChatroomsHidden}
                    />
                  </div>
                </div>
                <div hidden={isSendHidden}>
                  <SendMessageChatroomList
                    sendMessageChatrooms={sendMessageChatrooms}
                    reviewsOnHold={reviewsOnHold}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default management;
