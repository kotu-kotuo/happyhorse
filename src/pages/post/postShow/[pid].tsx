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
import { setPostStates } from "../../../utils/states";
import { Post } from "../../../types/types";
import { clickHeart } from "../../../functions/functions";

const Show = () => {
  const router = useRouter();
  const { user, setUser, currentUser } = useContext(AuthContext);
  const [post, setPost] = useState<Post>(postInitialValues);

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
      {post && currentUser && (
        <>
          <div className="mx-auto px-10">
            <Slider {...setting1}>
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="mt-10 outline-none pb-image w-full h-0 relative"
                >
                  {currentUser.uid === post.userID && (
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

          <div className="flex justify-between mt-10">
            <div className="w-2/3 mb-20 pl-4">
              <div className="mt-6 mb-4 text-gray-900 font-semibold text-xl">
                {post.title}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">
                {post.postText}
              </div>
              <div className="mt-20 mb-10">
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">名前</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.horseName}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 text-gray-600">カテゴリー</div>
                  <div className="ml-20">
                    {post.category === "障害馬" && (
                      <div className="border rounded-full border-red-700 text-red-700 text-sm px-4 py-0.5  font-semibold">
                        {post.category}
                      </div>
                    )}
                    {post.category === "馬場馬" && (
                      <div className="border rounded-full border-blue-900 text-blue-900 text-sm px-4 py-0.5  font-semibold">
                        {post.category}
                      </div>
                    )}
                    {post.category === "総合馬" && (
                      <div className="border rounded-full border-green-800 text-green-800 text-sm px-4 py-0.5  font-semibold">
                        {post.category}
                      </div>
                    )}
                    {post.category === "レクレーション" && (
                      <div className="border rounded-full border-yellow-300 text-yellow-300 text-sm px-4 py-0.5  font-semibold">
                        {post.category}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">値段</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.price}円
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">品種</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.breed}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">毛色</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.color}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">年齢</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.age}歳
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">生年月日</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.birth.year} / {post.birth.month} / {post.birth.day}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">身長</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.height}cm
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">特徴</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
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
                        .map((feature, index) => (
                          <div key={index} className="mr-5">
                            {feature}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
                <div className="flex mb-3">
                  <div className="ml-10 w-1/4 text-gray-600">地域</div>
                  <div className="w-3/4 text-gray-700 font-semibold">
                    {post.area}
                  </div>
                </div>
                <div className="border-b shadow-xs mb-4"></div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="pl-10">
                {!post.isAvairable &&
                !(
                  currentUser.uid === post.userID ||
                  currentUser.uid === post?.clientUserID
                ) ? (
                  <button className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-gray-400 pointer-events-none">
                    SOLD OUT!
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
                  onClick={(e) => { clickHeart(e,currentUser,user,setUser,router,db) }}
                  data-id={post.postID}
                >
                  {post.likeUserIDs.includes(currentUser?.uid) ? (
                    <FaHeart className="text-3xl text-red-400" />
                  ) : (
                    <FaRegHeart className="text-3xl text-gray-900" />
                  )}
                  <p className="text-gray-900 ml-3 mr-1">お気に入り</p>
                </div>
                <div className="border-b shadow-xs"></div>
                <p className="mt-4 mb-3 ml-8 text-gray-900">所有者</p>
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
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;
