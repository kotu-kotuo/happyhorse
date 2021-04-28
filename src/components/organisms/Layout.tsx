import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../../utils/firebase";
import { GoBell } from "react-icons/go";
import { IoChevronForwardOutline } from "react-icons/io5";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { currentUser, setCurrentUser, user } = useContext(AuthContext);

  const logout = async (e) => {
    e.preventDefault();
    try {
      await auth.signOut();
      await auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });
      setIsOpenMenu(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen box-border pb-10 relative"
      onClick={() => setIsOpenMenu(false)}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!currentUser && (
        <div className="h-12 pt-3.5 bg-mainGreen text-gray-50 text-center text-sm">
          happy horseは、馬の売買が無料で簡単にできるプラットフォームです
        </div>
      )}

      <header className="h-16 w-full border-b border-gray-100 shadow-sm">
        <nav className="flex items-center h-16 max-w-5xl mx-auto">
          <div className="mr-auto pt-4">
            <Link href="/">
              <a>
                <Image
                  src="/hh-logo2.png"
                  className="object-cover cursor-pointer"
                  width={250}
                  height={50}
                />
              </a>
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            {!currentUser && (
              <>
                <Link href="/signup">
                  <a className="text-gray-600">新規登録</a>
                </Link>
                <span className="mx-1.5"> | </span>
                <Link href="/login">
                  <a className="text-gray-600">ログイン</a>
                </Link>
              </>
            )}

            {currentUser && (
              <>
                <GoBell className="mx-4 text-3xl text-gray-400" />

                <div
                  className="mt-1.5 focus:outline-none relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                    src={user?.avatar}
                    className="object-cover rounded-full cursor-pointer h-10 w-10 mb-1"
                  />
                  <div hidden={!isOpenMenu}>
                    <div className="bg-white rounded overflow-hidden shadow-lg z-50 absolute right-0 w-60">
                      <div className="text-center p-6  border-b ">
                        <img
                          className="h-24 w-24 rounded-full mx-auto object-cover"
                          src={user.avatar}
                          alt="avatar"
                        />
                        <p className="pt-2 text-lg font-semibold">
                          {`${user.username}`}
                        </p>
                        <div className="mt-5">
                          <Link href="profile">
                            <a
                              href="#"
                              className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-700"
                            >
                              マイプロフィール
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="border-b">
                        <Link href="/post/myLikePosts">
                          <a className="px-4 py-4 hover:bg-gray-100 flex items-center">
                            <p className="text-sm font-medium text-gray-800 leading-none">
                              お気に入りの馬
                            </p>
                            <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
                          </a>
                        </Link>
                      </div>
                      <div className="border-b">
                        <Link href="/post/myPosts">
                          <a className="px-4 py-4 hover:bg-gray-100 flex items-center">
                            <p className="text-sm font-medium text-gray-800 leading-none">
                              掲載した馬
                            </p>
                            <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
                          </a>
                        </Link>
                      </div>
                      <div className="">
                        <a
                          onClick={logout}
                          href="#"
                          className="px-4 py-4 hover:bg-gray-100 flex items-center"
                        >
                          <p className="text-sm font-medium text-gray-800 leading-none">
                            ログアウト
                          </p>
                          <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="inline-block ml-6 ">
              {currentUser ? (
                <Link href="/post/post">
                  <button
                    type="button"
                    className="mr-3 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                  >
                    馬を売る
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    className="mr-3 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                  >
                    馬を売る
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto">{children}</main>
      <footer className="h-12 w-full text-center bottom-0 border-t border-gray-200 absolute bg-white">
        <div className="py-3">©︎ happy horse</div>
      </footer>
    </div>
  );
};
