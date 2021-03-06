import Link from "next/link";
import React, { SetStateAction } from "react";
import { FaBell, FaHorse } from "react-icons/fa";
import NotificationList from "./NotificationList";
import MenuList from "./MenuList";
import notificationChecked from "../../functions/notificationChecked";
import { Notification, User } from "../../types/types";
import { Dispatch } from "react";
import { FC } from "react";
import Image from "next/image";

type Props = {
  user: User;
  currentUser;
  setCurrentUser;
  isOpenMenu: boolean;
  setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  isOpenNotification: boolean;
  setIsOpenNotification: Dispatch<SetStateAction<boolean>>;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Header: FC<Props> = (props) => {
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
    setIsLoginModalOpen,
  } = props;

  return (
    <header className="header-height w-full border-b border-gray-100 shadow-sm">
      <nav className="header-height flex items-center max-w-5xl mx-auto">
        <div className="mr-auto pt-2.5 sm:pt-3">
          <Link href="/">
            <div className="w-52 sm:w-64">
              <Image
                src="/hh-logo2.png"
                className="object-cover cursor-pointer"
                width={280}
                height={70}
                alt="logo"
                priority={true}
              />
            </div>
          </Link>
        </div>

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
                  <FaBell className="mx-4 text-3xl text-gray-400 mt-0.5 cursor-pointer hover:opacity-80" />
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
                className="mt-1.5 focus:outline-none relative hidden sm:block"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  onClick={() => setIsOpenMenu(!isOpenMenu)}
                  src={user?.avatar}
                  className="object-cover rounded-full cursor-pointer hover:opacity-80"
                  width={39}
                  height={39}
                  alt="avatar"
                  priority={true}
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
              <button
                type="button"
                className="mr-3 focus:outline-none text-white text-base font-medium py-2 px-4 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                onClick={() => {
                  setIsLoginModalOpen(true);
                }}
              >
                <div className="flex items-center text-sm sm:text-base">
                  <FaHorse className="mr-1.5" />
                  掲載
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
