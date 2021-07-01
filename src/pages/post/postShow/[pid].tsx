import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db } from "../../../firebase/firebase";
import { postInitialValues } from "../../../utils/initialValues";
import { setPostStates, setUserState } from "../../../utils/states";
import { Post } from "../../../types/types";
import clickHeart from "../../../functions/clickHeart";
import SlickSlider from "../../../components/pages/postShow/SlickSlider";
import MessageButtonHandle from "../../../components/pages/postShow/MessageButtonHandle";
import PublisherValue from "../../../components/molecules/PublisherValue";
import LikeButton from "../../../components/pages/postShow/LikeButton";
import { NextPage } from "next";
import "slick-carousel/slick/slick.css";
import PostShowTable from "../../../components/pages/postShow/PostShowTable";

const Show: NextPage = () => {
  const router = useRouter();
  const { user, setUser, currentUser, notifications } = useContext(AuthContext);
  const [post, setPost] = useState<Post>(postInitialValues);
  const [postUser, setPostUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
  }, [router]);

  useEffect(() => {
    if (post.userID) {
      console.log(post.userID);
      db.collection("users")
        .doc(`${post.userID}`)
        .get()
        .then((snapshot) => setPostUser(setUserState(snapshot.data())));
    }
  }, [post]);

  const toPostEdit = (post) => {
    const pid = post.postID;
    router.push({
      pathname: `/post/postEdit/${pid}`,
    });
  };

  return (
    <Layout title="post.title">
      {post && postUser && (
        <>
          <div className="mx-auto xl:px-10 lg:px-14 md:px-10">
            <SlickSlider
              currentUser={currentUser}
              post={post}
              toPostEdit={toPostEdit}
            />
          </div>

          {/* モバイル */}
          <div className="flex justify-end items-center mr-4 mt-1 md:hidden">
            <div className="mr-4">
              <LikeButton
                clickHeart={clickHeart}
                currentUser={currentUser}
                user={user}
                setUser={setUser}
                router={router}
                db={db}
                notifications={notifications}
                post={post}
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
            </div>
            <MessageButtonHandle
              currentUser={currentUser}
              post={post}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
          </div>

          <div className="flex justify-between md:mt-10">
            <div className="w-full md:w-2/3 mb-20 px-4 pl-4 md:pr-0">
              <div className="max-w-2xl xl:ml-6 lg:ml-10 md:ml-6">
                <div className="fontSize-xl mt-2 mb-4 text-gray-900 font-semibold md:mt-6">
                  {post.title}
                </div>
                <div className="fontSize-base text-gray-700 whitespace-pre-wrap">
                  {post.postText}
                </div>
              </div>
              <div className="mt-20 mb-10">
                <PostShowTable post={post} postUser={postUser} />
              </div>
            </div>

            {/* PC */}
            <div className="hidden md:block md:w-1/3">
              <div className="pl-10 pr-4">
                <MessageButtonHandle
                  currentUser={currentUser}
                  post={post}
                  setIsLoginModalOpen={setIsLoginModalOpen}
                />
                <LikeButton
                  clickHeart={clickHeart}
                  currentUser={currentUser}
                  user={user}
                  setUser={setUser}
                  router={router}
                  db={db}
                  notifications={notifications}
                  post={post}
                  isLoginModalOpen={isLoginModalOpen}
                  setIsLoginModalOpen={setIsLoginModalOpen}
                />
                <div className="border-b shadow-xs"></div>
                <p className="mt-4 mb-3 text-gray-900">掲載者</p>
                <PublisherValue post={post} postUser={postUser} />
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;
