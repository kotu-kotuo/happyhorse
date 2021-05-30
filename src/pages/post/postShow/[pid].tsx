import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db } from "../../../utils/firebase";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { postInitialValues } from "../../../utils/initialValues";
import { setPostStates, setUserState } from "../../../utils/states";
import { Post } from "../../../types/types";
import { clickHeart } from "../../../functions/utils";
import TableListItem from "../../../components/molecules/TableListItem";
import Category from "../../../components/atoms/Category";
import SlickSlider from "../../../components/molecules/SlickSlider";
import MessageButtonHandle from "../../../components/molecules/MessageButtonHandle";
import PublisherValue from "../../../components/molecules/PublisherValue";
import LikeButton from "../../../components/atoms/LikeButton";

const Show = () => {
  const router = useRouter();
  const { user, setUser, currentUser, notifications } = useContext(AuthContext);
  const [post, setPost] = useState<Post>(postInitialValues);
  const [postUser, setPostUser] = useState(null);

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

  const setting1 = {
    customPaging: function (i) {
      return (
        <a>
          <img
            className="max-w-1600 w-full max-h-900 h-full"
            src={post.images[i]}
          />
        </a>
      );
    },
    dotsClass: "slick-dots",
    dots: true,
    arrows: true,
    fade: true,
    speed: 250,
    prevArrow: <IoChevronBackCircleOutline />,
    nextArrow: <IoChevronForwardCircleOutline />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

  const setting2 = {
    dots: true,
    arrows: true,
    fade: true,
    speed: 250,
    prevArrow: <IoChevronBackCircleOutline />,
    nextArrow: <IoChevronForwardCircleOutline />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

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
              />
            </div>
            <MessageButtonHandle currentUser={currentUser} post={post} />
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
                <div className="mb-4">
                  <TableListItem label={"名前"} value={post.horseName} />
                </div>

                <div className="mb-4">
                  <TableListItem
                    label={"カテゴリー"}
                    value={<Category category={post.category} />}
                  />
                </div>

                <div className="mb-4">
                  <TableListItem label={"値段"} value={`${post.price}円`} />
                </div>

                <div className="mb-4">
                  <TableListItem label={"品種"} value={post.breed} />
                </div>

                <div className="mb-4">
                  <TableListItem label={"毛色"} value={post.color} />
                </div>

                <div className="mb-4">
                  <TableListItem label={"年齢"} value={`${post.age}歳`} />
                </div>

                <div className="mb-4">
                  <TableListItem
                    label={"生年月日"}
                    value={`${post.birth.year} / ${post.birth.month} / ${post.birth.day}`}
                  />
                </div>

                <div className="mb-4">
                  <TableListItem label={"身長"} value={`${post.height}cm`} />
                </div>
                <div className="mb-4">
                  <TableListItem
                    label={"特徴"}
                    value={
                      <div className="flex flex-wrap">
                        {post.features
                          .sort((a, b) => {
                            //逆順に並べ替え
                            if (a < b) {
                              return 1;
                            } else {
                              return -1;
                            }
                          })
                          .map(
                            (feature, index) =>
                              feature !== "empty" && (
                                <div key={index} className="mr-5">
                                  {feature}
                                </div>
                              )
                          )}
                      </div>
                    }
                  />
                </div>

                <div className="mb-4">
                  <TableListItem label={"地域"} value={post.area} />
                </div>
                <div className="mb-4">
                  <TableListItem
                    label={"掲載者"}
                    value={<PublisherValue post={post} postUser={postUser} />}
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block md:w-1/3">
              <div className="pl-10 pr-4">
                <MessageButtonHandle currentUser={currentUser} post={post} />
                <LikeButton
                  clickHeart={clickHeart}
                  currentUser={currentUser}
                  user={user}
                  setUser={setUser}
                  router={router}
                  db={db}
                  notifications={notifications}
                  post={post}
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
