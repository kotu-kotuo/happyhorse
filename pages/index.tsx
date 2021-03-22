import { Layout } from "../components/Layout";
import { AiTwotoneCi } from "react-icons/ai";
import Image from "next/image";
import { FaYenSign } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHorse } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { auth } from "../src/utils/firebase";

export default function Home() {

 
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
            <div className="border-b border-gray-300 pb-6">
              <div className="flex mb-5 z-0">
                <Image
                  src="/uma1.jpg"
                  className="object-cover cursor-pointer"
                  width={800}
                  height={450}
                />
                <div className="">
                  <div className="-mb-1.5">
                    <Image
                      src="/uma1.jpg"
                      className="object-cover cursor-pointer"
                      width={400}
                      height={225}
                    />
                  </div>
                  <div className="-mb-1.5">
                    <Image
                      src="/uma1.jpg"
                      className="object-cover cursor-pointer"
                      width={400}
                      height={225}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center ml-2">
                <div className="border rounded-full border-red-600 text-red-600 text-sm px-4 py-0.5  font-semibold">
                  障害馬
                </div>

                <FaYenSign className="text-gray-400 text-xl ml-4 " />
                <div className="text-gray-900 ml-1">3000000円</div>

                <FaMapMarkerAlt className="text-gray-400 text-xl ml-5 " />
                <div className="text-gray-900 ml-1.5">東京都</div>

                <FaHorse className="text-gray-400 text-xl ml-5" />
                <div className="text-gray-900 ml-2">サラブレッド</div>
              </div>
              <h2 className="font-semibold text-gray-800 text-xl my-3">
                130cmも余裕で飛んじゃうスーパージャンピングホース！
                性格は人懐っこくてみんなの人気者です！
              </h2>
              <p className="text-sm text-gray-500">
                ご覧いただきありがとうございます。今回ご紹介する馬はマジでいい馬ですよ。何処がいいのかというとまず顔がいいですよね。白の模様がかわいいですよね。あと鼻のあたりもなんかかわいいで…
              </p>
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center ml-1">
                  <Image
                    src="/uma1.jpg"
                    className="object-cover cursor-pointer rounded-full"
                    width={50}
                    height={50}
                  />
                  <p className="text-gray-900 ml-3">ホースクラブ</p>
                </div>
                <div className="flex items-center">
                  <FaRegHeart className="text-3xl text-gray-900" />
                  <p className="text-gray-900 ml-3 mr-1">お気に入り</p>
                </div>
              </div>
            </div>
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
