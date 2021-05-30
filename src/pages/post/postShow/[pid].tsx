import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
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
import StarRatings from "react-star-ratings";
import SlickSlider from "../../../components/molecules/SlickSlider";
import MessageButtonHandle from "../../../components/molecules/MessageButtonHandle";

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
          <div className="mx-auto md:px-10">
            <SlickSlider
              currentUser={currentUser}
              post={post}
              toPostEdit={toPostEdit}
            />
          </div>

          <div className="flex justify-between md:mt-10">
            <div className="w-full md:w-2/3 mb-20 px-4 pl-4 md:pr-0">
              <div className="max-w-2xl">
                <div className="fontSize-xl mt-6 mb-4 text-gray-900 font-semibold">
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
                    value={
                      <Link
                        href={{
                          pathname: "/profile",
                          query: { uid: postUser.id },
                        }}
                      >
                        <div className="flex items-center cursor-pointer">
                          <div className="mr-2">
                            <img
                              src={post.avatar}
                              className="min-w-10 min-h-10 w-10 h-10 object-cover rounded-full block"
                            ></img>
                          </div>
                          <div>
                            <div>{post.username}</div>
                            <div className="-mt-0.5">
                              <StarRatings
                                numberOfStars={5}
                                rating={
                                  (postUser.good * 5 + postUser.bad * 1) /
                                    (postUser.good + postUser.bad) || 0
                                }
                                starRatedColor="#FFD400"
                                name="rating"
                                starDimension="16px"
                                starSpacing="0px"
                              />
                              <a className="fontSize-sm text-gray-500 reviewNumbersSize border-b border-gray-500 ml-1 pt-1 font-normal">
                                {postUser.good + postUser.bad}
                              </a>
                            </div>
                          </div>
                        </div>
                      </Link>
                    }
                  />
                </div>
              </div>
            </div>

            {/* <div className="hidden md:block md:w-1/3"> */}
            <div className="pl-10">
              <MessageButtonHandle currentUser={currentUser} post={post} />

              <div
                className="flex items-center mb-4 ml-11  cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  clickHeart(
                    e,
                    currentUser,
                    user,
                    setUser,
                    router,
                    db,
                    notifications
                  );
                }}
                data-id={post.postID}
              >
                {currentUser && post.likeUserIDs.includes(currentUser?.uid) ? (
                  <FaHeart className="text-3xl text-red-400" />
                ) : (
                  <FaRegHeart className="text-3xl text-gray-900" />
                )}
                <p className="text-gray-900 ml-3 mr-1">
                  お気に入り
                  <span className="ml-3 text-gray-900 font-semibold">
                    {post.likeUserIDs.length}
                  </span>
                </p>
              </div>
              <div className="border-b shadow-xs"></div>
              <p className="mt-4 mb-3 ml-8 text-gray-900">掲載者</p>

              {post.deletedAccount === true ? (
                <div className="flex items-center ml-8">
                  <img
                    src={post.avatar}
                    className="object-cover rounded-full w-12 h-12"
                  />
                  <p className="text-gray-900 ml-3">{post.username}</p>
                </div>
              ) : (
                <Link
                  href={{
                    pathname: "/profile",
                    query: {
                      uid: post.userID,
                    },
                  }}
                >
                  <div className="flex items-center ml-8  cursor-pointer hover:opacity-80">
                    <img
                      src={post.avatar}
                      className="object-cover rounded-full w-12 h-12"
                    />
                    <p className="text-gray-900 ml-3">{post.username}</p>
                  </div>
                </Link>
              )}
            </div>
            {/* </div> */}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;
