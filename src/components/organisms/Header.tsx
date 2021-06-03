import Link from "next/link";
import React from "react";
import { FaBell, FaHorse } from "react-icons/fa";
import NotificationList from "./NotificationList";
import { db } from "../../utils/firebase";
import { setNotificationStates } from "../../utils/states";
import MenuList from "./MenuList";
import notificationChecked from "../../functions/notificationChecked";

const Header = (props) => {
  const {
    user,
    currentUser,
    setCurrentUser,
    isOpenMenu,
    setIsOpenMenu,
    notifications,
    setNotifications,
    isOpenNotification,
    setIsOpenNotification,
  } = props;

  // const notificationChecked = async () => {
  //   await db
  //     .collection("users")
  //     .doc(`${currentUser.uid}`)
  //     .collection("notifications")
  //     .where("checked", "==", false)
  //     .get()
  //     .then(
  //       async (snapshot) =>
  //         await Promise.all(
  //           snapshot.docs.map((doc) =>
  //             db
  //               .collection("users")
  //               .doc(`${currentUser.uid}`)
  //               .collection("notifications")
  //               .doc(doc.id)
  //               .update({
  //                 checked: true,
  //               })
  //           )
  //         )
  //     );
  //   await db
  //     .collection("users")
  //     .doc(`${currentUser.uid}`)
  //     .collection("notifications")
  //     .orderBy("createdAt", "desc")
  //     .limit(30)
  //     .get()
  //     .then(async (snapshot) =>
  //       setNotifications(
  //         await Promise.all(
  //           snapshot.docs.map((doc) => setNotificationStates(doc.data()))
  //         )
  //       )
  //     );
  // };

  return (
    <header className="header-height w-full border-b border-gray-100 shadow-sm">
      <nav className="header-height flex items-center max-w-5xl mx-auto">
        <div className="mr-auto pt-1 sm:pt-2">
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

        <div className="ml-auto flex items-center text-xs sm:text-base">
          {!currentUser && (
            <div className="flex items-center mt-1 mr-3 sm:mt-0.5 sm:mr-0">
              <Link href="/signup">
                <a className="text-gray-600">新規登録</a>
              </Link>
              <div className="mb-0.5 mx-1 sm:mx-2"> | </div>
              <Link href="/login">
                <a className="text-gray-600">ログイン</a>
              </Link>
            </div>
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
                      notificationChecked(currentUser, setNotifications);
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
                    <NotificationList
                      notifications={notifications}
                      currentUser={currentUser}
                    />
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
                    <MenuList
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      user={user}
                      setIsOpenMenu={setIsOpenMenu}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div
            className={
              currentUser ? "inline-block ml-5" : "hidden ml-5 sm:inline-block"
            }
          >
            {currentUser ? (
              <Link href="/post/post">
                <button
                  type="button"
                  className="mr-3 focus:outline-none text-white text-base font-medium py-1.5 px-2.5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg sm:px-4"
                >
                  <div className="flex items-center text-sm sm:text-base">
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
                  <div className="flex items-center text-sm sm:text-base">
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
  );
};

export default Header;
