import { useRef, useEffect, useState } from "react";
import Footer from "../components/organisms/Footer";
import Link from "next/link";

const about = () => {
  const footerHeight = useRef(null);
  const [heightFooter, setHeightFooter] = useState(null);

  useEffect(() => {
    if (footerHeight) {
      setHeightFooter(footerHeight.current.clientHeight);
    }
  }, [footerHeight]);

  return (
    <div className="relative">
      <div className="bg-hero-image h-screen w-screen bg-cover relative">
        <div className="absolute bottom-12 right-6 w-40 2xl:right-1/4 xl:right-40 lg:right-36 lg:top-1/3 sm:top-3/4 sm:right-32">
          <img src="/hero-uma-left.png" />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white font-bold text-7xl tracking-widest mb-2 sm:text-8xl">
            HAPPY
          </div>
          <div className="text-white font-bold text-7xl tracking-widest mb-2 sm:text-8xl">
            UMA
          </div>
          <div className="text-white font-bold text-7xl tracking-widest sm:text-8xl">
            LIFE!
          </div>
        </div>
      </div>

      <div className="my-10 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-center text-center">
          <Link href="/signup">
            <div className="mx-auto my-3 sm:my-0 sm:mx-0">
              <div className="font-semibold bg-mainGreen px-14 py-2.5 rounded-md text-white hover:shadow-lg hover:opacity-80 cursor-pointer mx-4 sm:mx-6">
                新規登録
              </div>
            </div>
          </Link>
          <Link href="/login">
            <div className="mx-auto my-3 sm:my-0 sm:mx-0">
              <div className="font-semibold bg-mainGreen px-14 py-2.5 rounded-md text-white hover:shadow-lg hover:opacity-80 cursor-pointer mx-4 sm:mx-6">
                ログイン
              </div>
            </div>
          </Link>
        </div>
      </div>

      <section className="max-w-xl mx-auto px-2 md:max-w-4xl">
        <div className="md:flex md:justify-between">
          <div>
            <div className="text-gray-900 mb-6 text-3xl leading-10 md:text-4xl">
              より便利に、
              <span className="whitespace-nowrap">より手軽に。</span>
            </div>
            <div className="whitespace-pre-wrap text-gray-900 fontSize-base md:mr-16">
              happy horse は
              <br />
              <span className="whitespace-nowrap">
                馬を売りたい人と馬を買いたい人を繋げる
              </span>
              <br />
              マッチングプラットフォームです。
              <br />
              売る人は馬を掲載して
              <br />
              買う人はメッセージを送ります。
              <br />
              <span className="whitespace-nowrap">
                オープンでスムーズな馬の売買体験を
              </span>
              <br />
              <span className="whitespace-nowrap">是非あなたも！</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <img src="/horseRiding1.svg" className="md:max-w-[400px]" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto pt-28 pb-20 px-2 md:px-10 md:pt-32 md:pb-32">
        <div className="mb-20 mx-auto text-center">
          <div className="text-gray-900 text-3xl sm:text-4xl">つかいかた</div>
          <div className="mt-4 border-b-4 border-mainGreen w-52 mx-auto"></div>
        </div>
        <div>
          <div className="flex flex-row">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-32 p-5 border border-gray-300 rounded-md mr-4 uppercase flex flex-col items-center justify-center">
                <div className="text-3xl font-black text-gray-500 whitespace-nowrap">
                  Step 1
                </div>
                <div className="text-gray-500 text-sm">post</div>
              </div>
              <div className="h-full border-l-4 border-transparent">
                <div className="border-l-4 mr-4 h-full border-gray-300 border-dashed"></div>
              </div>
            </div>
            <div className="flex-auto border rounded-md md:p-3  border-gray-300">
              <div className="flex md:flex-row flex-col items-center">
                <div className="flex-auto">
                  <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                    <div className="flex items-center">
                      <div>
                        <span className="font-black">Step 1</span> - post
                      </div>
                      <img src="/note.svg" alt="step 1" className="w-8 ml-6" />
                    </div>
                  </div>
                  <div className="p-3 text-gray-900 text-xl sm:text-2xl">
                    <p>売りたい馬を掲載する</p>
                  </div>

                  <div className="px-3 pb-6 text-gray-900 fontSize-base">
                    馬を売りたい人は、入力フォームに品種や生年月日、写真、YouTube動画などの情報を入力して馬を掲載します。リッチで見やすい記事が簡単に作成できます。
                  </div>
                </div>
                <div className="md:w-56 p-5 hidden md:block">
                  <img
                    src="/note.svg"
                    alt="step 1"
                    className="object-scale-down my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start flex-row">
            <div className="border-t-4 border-r-4 border-transparent">
              <div className="w-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-b-4 rounded-bl-full"></div>
            </div>
            <div className="border-t-4 border-transparent flex-auto">
              <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
            </div>
            <div className="w-16 mt-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-t-4 rounded-tr-full"></div>
          </div>
          <div className="flex flex-row-reverse">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-32 p-5 border border-gray-300 rounded-md ml-4 uppercase flex flex-col items-center justify-center">
                <div className="text-3xl font-black text-gray-500 whitespace-nowrap">
                  Step 2
                </div>
                <div className="text-gray-500 text-sm">find</div>
              </div>
              <div className="h-full border-r-4 border-transparent">
                <div className="border-l-4 ml-4 h-full border-gray-300 border-dashed"></div>
              </div>
            </div>
            <div className="flex-auto border rounded-md md:p-3  border-gray-300">
              <div className="flex md:flex-row flex-col items-center">
                <div className="flex-auto">
                  <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                    <div className="flex items-center">
                      <div>
                        <span className="font-black">Step 2</span> - find
                      </div>
                      <img src="/love.svg" alt="step 2" className="w-10 ml-6" />
                    </div>
                  </div>
                  <div className="p-3 text-gray-900 text-xl sm:text-2xl">
                    買いたい馬を探す
                  </div>
                  <div className="px-3 pb-6 text-gray-900 fontSize-base">
                    馬を買いたい人は、掲載一覧ページから希望の馬を探します。カテゴリーや品種、地域などさまざまな条件で絞り込み検索できます。気になる馬が見つかったら掲載ページからメッセージを送ります。
                  </div>
                </div>
                <div className="md:w-56 p-5 hidden md:block">
                  <img
                    src="/love.svg"
                    alt="step 2"
                    className="object-scale-down my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start flex-row-reverse">
            <div className="border-t-4 border-l-4 border-transparent">
              <div className="w-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-b-4 rounded-br-full"></div>
            </div>
            <div className="border-t-4 border-transparent flex-auto">
              <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
            </div>
            <div className="w-16 mt-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-t-4 rounded-tl-full"></div>
          </div>
          <div className="flex flex-row">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-32 p-5 border border-gray-300 rounded-md mr-4 uppercase flex flex-col items-center justify-center">
                <div className="text-3xl font-black text-gray-500 whitespace-nowrap">
                  Step 3
                </div>
                <div className="text-gray-500 text-sm">message</div>
              </div>
              <div className="h-full border-l-4 border-transparent">
                <div className="border-l-4 mr-4 h-full border-gray-300 border-dashed"></div>
              </div>
            </div>
            <div className="flex-auto border rounded-md md:p-3  border-gray-300">
              <div className="flex md:flex-row flex-col items-center">
                <div className="flex-auto">
                  <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                    <div className="flex items-center">
                      <div>
                        <span className="font-black">Step 3</span> - message
                      </div>
                      <img
                        src="/conversation.svg"
                        alt="step 3"
                        className="w-10 ml-6"
                      />
                    </div>
                  </div>
                  <div className="p-3 text-gray-900 text-xl sm:text-2xl">
                    メッセージをやり取りする
                  </div>
                  <div className="px-3 pb-6 text-gray-900 fontSize-base">
                    買う人と売る人でメッセージをやり取りします（専用のチャット画面あり）。試乗、馬運、疑問点、価格交渉などについて話し合います。
                  </div>
                </div>
                <div className="md:w-48 p-5 hidden md:block">
                  <img
                    src="/conversation.svg"
                    alt="step 3"
                    className="object-scale-down my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start flex-row">
            <div className="border-t-4 border-r-4 border-transparent">
              <div className="w-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-b-4 rounded-bl-full"></div>
            </div>
            <div className="border-t-4 border-transparent flex-auto">
              <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
            </div>
            <div className="w-16 mt-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-t-4 rounded-tr-full"></div>
          </div>
          <div className="flex flex-row-reverse">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-32 p-5 border border-gray-300 rounded-md ml-4 uppercase flex flex-col items-center justify-center">
                <div className="text-3xl font-black text-gray-500 whitespace-nowrap ">
                  Step 4
                </div>
                <div className="text-gray-500 text-sm">complete</div>
              </div>
            </div>
            <div className="flex-auto border rounded-md md:p-3 border-gray-300">
              <div className="flex md:flex-row flex-col items-center">
                <div className="flex-auto">
                  <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                    <div className="flex items-center">
                      <div>
                        <span className="font-black">Step 4</span> - complete
                      </div>
                      <img
                        src="/handshake.svg"
                        alt="step 4"
                        className="w-10 ml-6"
                      />
                    </div>
                  </div>
                  <div className="p-3 text-gray-900 text-xl sm:text-2xl">
                    取引完了！
                  </div>
                  <div className="px-3 pb-6 text-gray-900 fontSize-base">
                    入厩や送金が終わりましたら取引完了です。お互いに評価をします。
                  </div>
                </div>
                <div className="md:w-40 p-5 hidden md:block">
                  <img
                    src="/handshake.svg"
                    alt="step 4"
                    className="object-scale-down my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-12 mt-0 md:mb-16 md:mt-2">
        <img src="/phrase.png" className="md:max-w-[400px] md:mx-auto px-4" />
      </div>
      <Footer footerHeight={footerHeight} heightFooter={heightFooter} />
    </div>
  );
};

export default about;
