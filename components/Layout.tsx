import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../src/utils/firebase";
import { GoBell } from "react-icons/go";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

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

  const consoleShow: any = () => {
    console.log(currentUser);
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
            <Link href="/show">
              <a>show</a>
            </Link>
            <Link href="/signup">
              <a>signup</a>
            </Link>
            <Link href="/login">
              <a>login</a>
            </Link>

            <GoBell className="mx-4 text-3xl text-gray-400" />

            <div
              className="mt-1.5 focus:outline-none relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                onClick={() => setIsOpenMenu(!isOpenMenu)}
                src="/flowers.jpg"
                className="object-cover rounded-full cursor-pointer"
                width={40}
                height={40}
              />
              <div hidden={!isOpenMenu}>
                <div className="bg-white rounded overflow-hidden shadow-lg z-50 absolute right-0">
                  <div className="text-center p-6  border-b">
                    <img
                      className="h-24 w-24 rounded-full mx-auto"
                      src="https://randomuser.me/api/portraits/men/24.jpg"
                      alt="Randy Robertson"
                    />
                    <p className="pt-2 text-lg font-semibold">
                      Randy Robertson
                    </p>
                    <p className="text-sm text-gray-600">
                      randy.robertson@example.com
                    </p>
                    <div className="mt-5">
                      <a
                        href="#"
                        className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-700"
                      >
                        プロフィールを編集する
                      </a>
                    </div>
                  </div>
                  <div className="border-b">
                    <a href="#" className="px-4 py-2 hover:bg-gray-100 flex">
                      <div className="text-gray-800">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                        >
                          <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="pl-3">
                        <p className="text-sm font-medium text-gray-800 leading-none">
                          Personal settings
                        </p>
                        <p className="text-xs text-gray-500">
                          Email, profile, notifications
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="">
                    <a
                      onClick={logout}
                      href="#"
                      className="px-4 py-4 pb-4 hover:bg-gray-100 flex"
                    >
                      <p className="text-sm font-medium text-gray-800 leading-none">
                        ログアウト
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-block ml-6 ">
              <button
                onClick={consoleShow}
                type="button"
                className="mr-3 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
              >
                馬を売る
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-3">{children}</main>
      <footer className="h-12 w-full text-center bottom-0 border-t border-gray-200 absolute bg-white">
        <div className="py-3">©︎happy horse</div>
      </footer>
    </div>
  );
};
