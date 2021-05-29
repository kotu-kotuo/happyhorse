import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { db } from "../../../utils/firebase";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import Slider from "react-slick";
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

  const toPostEdit = (post) => {
    const pid = post.postID;
    router.push({
      pathname: `/post/postEdit/${pid}`,
    });
  };

  return (
    <Layout title="post.title">
      {post && currentUser && postUser && (
        <>
          <div className="mx-auto md:px-10">
            <Slider {...setting1}>
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="mt-10 outline-none pb-image w-full h-0 relative"
                >
                  {currentUser.uid === post.userID && post.isAvairable && (
                    <div
                      className="absolute top-3 right-4 z-50 bg-white px-3.5 py-1.5 rounded opacity-50 cursor-pointer hover:bg-mainGreen hover:text-white hover:opacity-90 ease-in-out duration-300"
                      onClick={() => toPostEdit(post)}
                    >
                      編集
                    </div>
                  )}
                  <img
                    src={image}
                    className="object-cover outline-none border-0 w-full h-full absolute"
                  />
                </div>
              ))}
            </Slider>
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
                              {user.good + user.bad}
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

            <div className="hidden md:block md:w-1/3">
              <div className="pl-10">
                {!post.isAvairable &&
                !(
                  currentUser.uid === post.userID ||
                  currentUser.uid === post?.clientUserID
                ) ? (
                  <button className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-gray-400 pointer-events-none">
                    SOLD OUT!
                  </button>
                ) : post.isAvairable &&
                  post.clientUserID.length !== 0 &&
                  !(
                    currentUser.uid === post.userID ||
                    currentUser.uid === post?.clientUserID
                  ) ? (
                  <button className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-gray-400 pointer-events-none">
                    他の方と取引中
                  </button>
                ) : currentUser.uid === post.userID ? (
                  <Link href="/message/management">
                    <button
                      type="button"
                      className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-mainGreen hover:opacity-90 hover:shadow-lg"
                    >
                      メッセージ管理画面へ
                    </button>
                  </Link>
                ) : post.deletedAccount === true ? (
                  <div></div>
                ) : (
                  <Link
                    href={{
                      pathname: "/message/messages",
                      query: {
                        uid: post.userID,
                        pid: post.postID,
                        cid: currentUser.uid,
                      },
                    }}
                  >
                    <button
                      type="button"
                      className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-mainGreen hover:opacity-90 hover:shadow-lg"
                    >
                      {post.sendMessageUserIDs.includes(currentUser.uid)
                        ? "メッセージ画面へ"
                        : "メッセージを送る"}
                    </button>
                  </Link>
                )}

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
                  {post.likeUserIDs.includes(currentUser?.uid) ? (
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
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;
