import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { db } from "../src/utils/firebase";
import { FaRegHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoChevronForwardCircleOutline } from "react-icons/io5";

const Show = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);

  useEffect(() => {
    db.collectionGroup("posts")
      .where("postID", "==", router.query.pid)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          console.log(doc.data());
          setPost({
            postID: doc.data().postID,
            userID: doc.data().userID,
            username: doc.data().username,
            avatar: doc.data().avatar,
            image: doc.data().image,
            images: doc.data().images,
            title: doc.data().title,
            postText: doc.data().postText,
            horseName: doc.data().horseName,
            category: doc.data().category,
            breed: doc.data().breed,
            color: doc.data().color,
            birth: {
              year: doc.data().birth.year,
              month: doc.data().birth.month,
              day: doc.data().birth.day,
            },
            age: doc.data().age,
            height: doc.data().height,
            area: doc.data().area,
            features: doc.data().features,
            price: doc.data().price,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            likeUserIDs: doc.data().likeUserIDs,
            isAvairable: doc.data().isAvairable,
            pv: doc.data().pv,
          });
        });
      });
  }, []);

  const setting1 = {
    customPaging: function (i) {
      return (
        <a>
          <img src={post.images[i]} />
        </a>
      );
    },
    dotsClass: "slick-dots",
    dots: true,
    arrows: true,
    prevArrow: <IoChevronBackCircleOutline />,
    nextArrow: <IoChevronForwardCircleOutline />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

  return (
    <Layout title="post.title">
      {post && (
        <>
          <Slider {...setting1}>
            {post.images.map((image, index) => (
              <div key={index} className="mt-10 outline-none">
                <img
                  src={image}
                  className="h-96 w-full object-cover outline-none border-0"
                />
              </div>
            ))}
          </Slider>

          <div className="flex justify-between mt-10">
            <div className="w-2/3 mb-20">
              <div className="mt-6 mb-4 text-gray-900 font-semibold text-xl">
                {post.title}
              </div>
              <div className="text-gray-700">{post.postText}</div>
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
                <Link href="/">
                  <button
                    type="button"
                    className="block mt-6 mb-6 ml-8 focus:outline-none text-white text-base font-semibold py-3 px-8 rounded-full bg-mainGreen hover:opacity-90 hover:shadow-lg"
                  >
                    メッセージを送る
                  </button>
                </Link>
                <div className="flex items-center mb-4 ml-8">
                  <FaRegHeart className="text-3xl text-gray-900" />
                  <p className="text-gray-900 ml-3 mr-1">お気に入り</p>
                </div>
                <div className="border-b shadow-xs"></div>
                <p className="mt-4 mb-3 ml-8 text-gray-900">所有者</p>
                <div className="flex items-center ml-8">
                  <img
                    src={post.avatar}
                    className="object-cover cursor-pointer rounded-full w-12 h-12"
                  />
                  <p className="text-gray-900 ml-3">{post.username}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Show;