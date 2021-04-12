import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { AiTwotoneCi } from "react-icons/ai";
import Link from "next/link";
import { FaYenSign } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHorse } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { db } from "../src/utils/firebase";
import { useRouter } from "next/router";

interface POST {
  postID: string;
  userID: string;
  username: string;
  avatar: string;
  images: Array<string>;
  title: string;
  postText: string;
  category: string;
  breed: string;
  color: string;
  birth: { year: number; month: number; day: number };
  age: number;
  height: number;
  area: string;
  features: Array<string>;
  price: string;
  createdAt: string;
  updatedAt: string;
  likeUserIDs: Array<string>;
  isAvairable: boolean;
  pv: number;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<POST[]>([
    {
      postID: "",
      userID: "",
      username: "",
      avatar: "",
      images: [],
      title: "",
      postText: "",
      category: "",
      breed: "",
      color: "",
      birth: { year: null, month: null, day: null },
      age: null,
      height: null,
      area: "",
      features: [],
      price: "",
      createdAt: "",
      updatedAt: "",
      likeUserIDs: [],
      isAvairable: null,
      pv: null,
    },
  ]);

  useEffect(() => {
    db.collectionGroup("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            postID: doc.data().postID,
            userID: doc.data().userID,
            username: doc.data().username,
            avatar: doc.data().avatar,
            images: doc.data().images,
            title: doc.data().title,
            postText: doc.data().postText,
            category: doc.data().category,
            breed: doc.data().breed,
            color: doc.data().color,
            birth: {
              year: doc.data().year,
              month: doc.data().month,
              day: doc.data().day,
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
          }))
        );
      });
  }, []);

  const clickPost = (e) => {
    console.log(e.currentTarget.getAttribute("data-id"));
    const pid = e.currentTarget.getAttribute("data-id");
    router.push({
      pathname: `/${pid}`,
      query: { pid: pid },
    });
  };

  return (
    <div>
      <Layout title="index">
        <div className="flex mt-24 mb-20">
          <div className="w-1/3 pr-8">
            <div className="px-4 py-6 shadow-md border border-gray-50 rounded-lg">
              <div className=" text-center text-sm font-semibold text-gray-400 opacity-95">
                絞り込み検索
              </div>
              <div className="mb-4 mt-7 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                カテゴリー
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                障害馬
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                馬場馬
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                総合馬
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                その他
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                価格
              </div>
              <div className="flex">
                <div className="text-gray-700">￥500000</div>
                <div className="text-gray-700">〜</div>
                <div className="text-gray-700">￥1000000</div>
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                年齢
              </div>
              <div className="flex">
                <div className="text-gray-700">5歳</div>
                <div className="text-gray-700">〜</div>
                <div className="text-gray-700">10歳</div>
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                身長
              </div>
              <div className="flex">
                <div className="text-gray-700">150cm</div>
                <div className="text-gray-700">〜</div>
                <div className="text-gray-700">170cm</div>
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                品種
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                サラブレッド
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                ハノーバー
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                KWPN
              </div>
              <div className="mb-3 text-xs font-medium text-mainGreen">
                さらに表示
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                毛色
              </div>
              <div className="mb-3 flex items-center">
                <AiTwotoneCi className="mr-1 text-yellow-900" />
                <div className="text-base font-semibold text-gray-700">
                  鹿毛
                </div>
              </div>
              <div className="mb-3 flex items-center">
                <AiTwotoneCi className="mr-1 text-gray-900" />
                <div className="text-base font-semibold text-gray-700">
                  黒鹿毛
                </div>
              </div>
              <div className="mb-3 flex items-center">
                <AiTwotoneCi className="mr-1 text-yellow-700" />
                <div className="text-base font-semibold text-gray-700">
                  栗毛
                </div>
              </div>
              <div className="mb-3 flex items-center">
                <AiTwotoneCi className="mr-1 text-gray-100" />
                <div className="text-base font-semibold text-gray-700">
                  芦毛
                </div>
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                地域
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                関東
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                北海道
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                東北
              </div>
              <div className="mb-3 text-xs font-medium text-mainGreen">
                さらに表示
              </div>
              <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
                特徴
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                おとなしい
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                120cm以上飛べます
              </div>
              <div className="mb-3 text-base font-semibold text-gray-700">
                初心者OK
              </div>
              <div className="mb-3 text-xs font-medium text-mainGreen">
                さらに表示
              </div>
            </div>
          </div>
          <div className="w-2/3 ">
            {posts.map((post) => (
              <div
                key={post.postID}
                className="border-b border-gray-300 pb-6 mb-16"
              >
                {/* <Link href={`${post.postID}`}> */}
                <div
                  className="flex mb-5 z-0"
                  data-id={post.postID}
                  onClick={clickPost}
                >
                  <img
                    src={post.images[0]}
                    className="object-cover cursor-pointer w-2/3"
                  />
                  <div className="w-1/3">
                    <img
                      src={post.images[1]}
                      className="object-cover cursor-pointer"
                    />
                    <img
                      src={post.images[2]}
                      className="object-cover cursor-pointer"
                    />
                  </div>
                </div>
                {/* </Link> */}
                <div className="flex items-center ml-2">
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

                  <FaYenSign className="text-gray-400 text-xl ml-4 " />
                  <div className="text-gray-900 ml-1">{post.price}円</div>

                  <FaHorse className="text-gray-400 text-xl ml-6" />
                  <div className="text-gray-900 ml-2">{post.breed}</div>

                  <FaMapMarkerAlt className="text-gray-400 text-xl ml-5 " />
                  <div className="text-gray-900 ml-1.5">{post.area}</div>
                </div>
                <Link href={`${post.postID}`}>
                  <div className="cursor-pointer">
                    <h2 className="font-semibold text-gray-800 text-xl my-3">
                      {post.title}
                    </h2>
                  </div>
                </Link>
                <p className="text-sm text-gray-500">{post.postText}</p>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center ml-1">
                    <img
                      src={post.avatar}
                      className="object-cover cursor-pointer rounded-full w-12 h-12"
                    />
                    <p className="text-gray-900 ml-3">{post.username}</p>
                  </div>
                  <div className="flex items-center">
                    <FaRegHeart className="text-3xl text-gray-900" />
                    <p className="text-gray-900 ml-3 mr-1">お気に入り</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center my-14">
              <div className="flex text-gray-700">
                <div className="h-12 w-12 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-left w-6 h-6"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </div>
                <div className="flex h-12 font-medium rounded-full bg-gray-200">
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    1
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full bg-mainGreen text-white ">
                    2
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    3
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    ...
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    13
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    14
                  </div>
                  <div className="w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
                    15
                  </div>
                  <div className="w-12 h-12 md:hidden flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full bg-teal-600 text-white">
                    2
                  </div>
                </div>
                <div className="h-12 w-12 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-right w-6 h-6"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
