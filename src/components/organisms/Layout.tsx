import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { FaBell } from "react-icons/fa";
import { IoChevronForwardOutline } from "react-icons/io5";
import { FaHorse } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import { setNotificationStates } from "../../utils/states";
import Notification from "../molecules/Notification";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const {
    currentUser,
    setCurrentUser,
    user,
    notifications,
    setNotifications,
  } = useContext(AuthContext);

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

  const notificationChecked = async () => {
    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("notifications")
      .where("checked", "==", false)
      .get()
      .then(
        async (snapshot) =>
          await Promise.all(
            snapshot.docs.map((doc) =>
              db
                .collection("users")
                .doc(`${currentUser.uid}`)
                .collection("notifications")
                .doc(doc.id)
                .update({
                  checked: true,
                })
            )
          )
      );
    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get()
      .then(async (snapshot) =>
        setNotifications(
          await Promise.all(
            snapshot.docs.map((doc) => setNotificationStates(doc.data()))
          )
        )
      );
  };

  return (
    <div
      className="min-h-screen box-border pb-10 relative"
      onClick={() => {
        setIsOpenMenu(false), setIsOpenNotification(false);
      }}
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
          <div className="mr-auto pt-2">
            <Link href="/">
              <a>
                <img
                  src="/hh-logo2.png"
                  className="object-cover cursor-pointer h-12 sm:h-12 sm:w-64"
                />
              </a>
            </Link>
          </div>
          {console.log(notifications)}

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

            {currentUser && user && (
              <>
                <div
                  className="relative hidden sm:block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    onClick={() => {
                      setIsOpenNotification(!isOpenNotification),
                        notificationChecked();
                    }}
                    className="relative"
                  >
                    <FaBell className="mx-4 text-3xl text-gray-400 mt-0.5 cursor-pointer" />
                    <div
                      hidden={
                        !(
                          notifications &&
                          notifications.filter(
                            (notification) => notification.checked === false
                          ).length !== 0
                        )
                      }
                      className="absolute top-1 right-4  rounded-full h-3 w-3 bg-red-500"
                    ></div>
                  </div>
                  <div hidden={!isOpenNotification}>
                    <div className="bg-white rounded overflow-hidden shadow-lg z-50 absolute right-0 w-60 px-1.5 pt-3 pb-2 max-h-screen overflow-y-scroll">
                      {notifications.map((notification) => (
                        <>
                          {notification.toMessage ? (
                            <Notification
                              notification={notification}
                              href={{
                                pathname: "/message/messages",
                                query: {
                                  uid: notification.postUserID,
                                  pid: notification.postID,
                                  cid: notification.sendMessageUserID,
                                },
                              }}
                            />
                          ) : notification.toProfile ? (
                            <Notification
                              notification={notification}
                              href={{
                                pathname: "/profile",
                                query: {
                                  uid: currentUser.uid,
                                },
                              }}
                            />
                          ) : (
                            <Notification
                              notification={notification}
                              href={{
                                pathname: `/post/postShow/${notification.postID}`,
                                query: {
                                  pid: notification.postID,
                                },
                              }}
                            />
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="mt-1 focus:outline-none relative hidden sm:block"
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
                          src={user?.avatar}
                          alt="avatar"
                        />
                        <p className="pt-2 text-lg font-semibold">
                          {`${user?.username}`}
                        </p>
                        <Link href="/reviews">
                          <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                            <div>
                              <StarRatings
                                numberOfStars={5}
                                rating={
                                  (user.good * 5 + user.bad * 1) /
                                    (user.good + user.bad) || 0
                                }
                                starRatedColor="#FFD400"
                                name="rating"
                                starDimension="16px"
                                starSpacing="0px"
                              />
                            </div>
                            <a className="text-gray-500 reviewNumbersSize border-b border-gray-500  ml-1 pt-1">
                              {user.good + user.bad}
                            </a>
                          </div>
                        </Link>
                        <div className="mt-5">
                          <Link
                            href={{
                              pathname: "/profile",
                              query: {
                                uid: currentUser.uid,
                              },
                            }}
                          >
                            <a className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-700 hover:opacity-80">
                              マイプロフィール
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="border-b">
                        <Link href="/message/management">
                          <a className="px-4 py-4 hover:bg-gray-100 flex items-center">
                            <p className="text-sm font-medium text-gray-800 leading-none">
                              メッセージ管理
                            </p>
                            <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
                          </a>
                        </Link>
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
                      <div className="border-b">
                        <Link href="/post/draftList">
                          <a className="px-4 py-4 hover:bg-gray-100 flex items-center">
                            <p className="text-sm font-medium text-gray-800 leading-none">
                              下書き保存リスト
                            </p>
                            <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
                          </a>
                        </Link>
                      </div>
                      <div className="border-b">
                        <Link href="/setting">
                          <a className="px-4 py-4 hover:bg-gray-100 flex items-center">
                            <p className="text-sm font-medium text-gray-800 leading-none">
                              設定
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

            <div className="inline-block ml-5 ">
              {currentUser ? (
                <Link href="/post/post">
                  <button
                    type="button"
                    className="mr-3 focus:outline-none text-white text-base font-medium py-2 px-4 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <FaHorse className="mr-1.5" />
                      掲載
                    </div>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    className="mr-3 focus:outline-none text-white text-base font-medium py-2 px-4 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <FaHorse className="mr-1.5" />
                      掲載
                    </div>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto">{children}</main>
      {router.pathname !== "/message/messages" && (
        <footer className="h-12 w-full text-center bottom-0 border-t border-gray-200 absolute bg-white">
          <div className="py-3">©︎ happy horse</div>
        </footer>
      )}
    </div>
  );
};
