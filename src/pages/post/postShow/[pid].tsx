import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { NextRouter, useRouter } from "next/router";
import { db } from "../../../firebase/firebase";
import { setPostStates, setUserState } from "../../../utils/states";
import clickHeartShow from "../../../functions/clickHeartShow";
import SlickSlider from "../../../components/pages/postShow/SlickSlider";
import MessageButtonHandle from "../../../components/pages/postShow/MessageButtonHandle";
import PublisherValue from "../../../components/molecules/PublisherValue";
import LikeButton from "../../../components/pages/postShow/LikeButton";
import { NextPage } from "next";
import "slick-carousel/slick/slick.css";
import PostShowTable from "../../../components/pages/postShow/PostShowTable";
import admin from "../../../firebase/admin";
import VideoList from "../../../components/pages/postShow/VideoList";
import { postInitialValues } from "../../../utils/initialValues";

const Show: NextPage = ({ posts }: any) => {
  const router: NextRouter = useRouter();
  const { user, setUser, currentUser } = useContext(AuthContext);
  const [postState, setPostState] = useState(postInitialValues);
  const [postUser, setPostUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const post = posts.find((post) => post.postID === router.query.pid);

  useEffect(() => {
    if (post.userID) {
      console.log(post.userID);
      db.collection("users")
        .doc(`${post.userID}`)
        .get()
        .then((snapshot) => setPostUser(setUserState(snapshot.data())));
    }
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(post.userID)
      .collection("posts")
      .doc(post.postID)
      .get()
      .then((snapshot) => setPostState(setPostStates(snapshot.data())));
  }, []);

  const toPostEdit = (post) => {
    const pid = post.postID;
    router.push({
      pathname: `/post/postEdit/${pid}`,
    });
  };

  return (
    <Layout
      title={`${post.title + " | happy horse"}` || ""}
      ogpURL={"https://www.happyhorse.xyz" + router?.asPath}
      description={post.postText}
      ogpImage={post.images[0]}
    >
      {console.log(post)}
      {currentUser !== undefined && (
        <>
          <div className="mx-auto xl:px-10 lg:px-14 md:px-10">
            <SlickSlider
              currentUser={currentUser}
              post={currentUser ? postState : post}
              toPostEdit={toPostEdit}
            />
          </div>

          {/* モバイル */}
          <div className="flex justify-end items-center mr-4 mt-4 mb-1 md:hidden">
            <div className="mr-4">
              <LikeButton
                clickHeartShow={clickHeartShow}
                currentUser={currentUser}
                user={user}
                setUser={setUser}
                post={postState}
                setPostState={setPostState}
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
            </div>
            <MessageButtonHandle
              currentUser={currentUser}
              post={currentUser ? postState : post}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
          </div>

          <div className="flex justify-between md:mt-10">
            <div className="w-full md:w-2/3 mb-8 px-4 pl-4 md:pr-0">
              <div className="max-w-2xl xl:ml-6 lg:ml-10 md:ml-6">
                <div className="fontSize-xl my-4 text-gray-900 font-bold sm:font-semibold md:my-6">
                  {currentUser ? postState.title : post.title}
                </div>
                <div className="fontSize-base text-gray-700 whitespace-pre-wrap">
                  {currentUser ? postState.postText : post.postText}
                </div>
              </div>
              <div className="md:pl-6">
                <VideoList
                  video1URL={currentUser ? postState.video1URL : post.video1URL}
                  video1Title={
                    currentUser ? postState.video1Title : post.video1Title
                  }
                  video2URL={currentUser ? postState.video2URL : post.video2URL}
                  video2Title={
                    currentUser ? postState.video2Title : post.video2Title
                  }
                  video3URL={currentUser ? postState.video3URL : post.video3URL}
                  video3Title={
                    currentUser ? postState.video3Title : post.video3Title
                  }
                />
              </div>
              <div className="mt-20 mb-10 md:mt-24">
                <PostShowTable
                  post={currentUser ? postState : post}
                  postUser={postUser}
                />
              </div>
            </div>

            {/* PC */}
            <div className="hidden md:block md:w-1/3">
              <div className="pl-10 pr-4">
                <MessageButtonHandle
                  currentUser={currentUser}
                  post={currentUser ? postState : post}
                  setIsLoginModalOpen={setIsLoginModalOpen}
                />
                <LikeButton
                  clickHeartShow={clickHeartShow}
                  currentUser={currentUser}
                  user={user}
                  setUser={setUser}
                  post={postState}
                  setPostState={setPostState}
                  isLoginModalOpen={isLoginModalOpen}
                  setIsLoginModalOpen={setIsLoginModalOpen}
                />
                <div className="border-b shadow-xs"></div>
                <p className="mt-4 mb-3 text-gray-900">掲載者</p>
                <PublisherValue
                  post={currentUser ? postState : post}
                  postUser={postUser}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;

export async function getServerSideProps() {
  const db = admin.firestore();

  const data: FirebaseFirestore.DocumentData[] = (
    await db.collectionGroup("posts").get()
  ).docs.map((doc) => doc.data());

  const posts = JSON.parse(JSON.stringify(data));

  return {
    props: {
      posts,
    },
  };

  // export async function getStaticPaths() {
  //   const db = admin.firestore();

  //   const paths = await db
  //     .collectionGroup("posts")
  //     .get()
  //     .then((snapshot) =>
  //       snapshot.docs.map((doc) => ({ params: { pid: doc.data().postID } }))
  //     );

  //   console.log(paths);

  //   return {
  //     paths,
  //     fallback: false,
  //   };
  // }

  // export async function getStaticProps({ params }) {
  //   const db = admin.firestore();

  //   const data: FirebaseFirestore.DocumentData = (
  //     await db.collectionGroup("posts").where("postID", "==", params.pid).get()
  //   ).docs[0].data();

  //   const post = JSON.parse(JSON.stringify(data));

  //   return {
  //     props: {
  //       post,
  //     },
  //     revalidate: 10,
  //   };
}
