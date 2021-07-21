import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { NextRouter, useRouter } from "next/router";
import { db } from "../../../firebase/firebase";
import { setUserState } from "../../../utils/states";
import { Post } from "../../../types/types";
import clickHeart from "../../../functions/clickHeart";
import SlickSlider from "../../../components/pages/postShow/SlickSlider";
import MessageButtonHandle from "../../../components/pages/postShow/MessageButtonHandle";
import PublisherValue from "../../../components/molecules/PublisherValue";
import LikeButton from "../../../components/pages/postShow/LikeButton";
import { NextPage } from "next";
import "slick-carousel/slick/slick.css";
import PostShowTable from "../../../components/pages/postShow/PostShowTable";
import admin from "../../../firebase/admin";

const Show: NextPage = ({ post }: any) => {
  const router: NextRouter = useRouter();
  const { user, setUser, currentUser, notifications } = useContext(AuthContext);
  const [postUser, setPostUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
    <Layout title={`${post.title}` || ""}>
      {console.log(post)}
      {console.log(post.images)}
      {post && (
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

export async function getStaticPaths() {
  const db = admin.firestore();

  const paths = await db
    .collectionGroup("posts")
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => ({ params: { pid: doc.data().postID } }))
    );

  console.log(paths);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const db = admin.firestore();

  const data: FirebaseFirestore.DocumentData = (
    await db.collectionGroup("posts").where("postID", "==", params.pid).get()
  ).docs[0].data();

  const post = JSON.parse(JSON.stringify(data));

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}
