import Link from "next/link";
import React, { SetStateAction } from "react";
import { FC } from "react";
import { Dispatch } from "react";
import { FaBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import notificationChecked from "../../functions/notificationChecked";
import { Notification, User } from "../../types/types";
import MenuList from "./MenuList";
import NotificationList from "./NotificationList";

type Props = {
  isOpenBottomNotification: boolean;
  setIsOpenBottomNotification: Dispatch<SetStateAction<boolean>>;
  isOpenBottomMenu: boolean;
  setIsOpenBottomMenu: Dispatch<SetStateAction<boolean>>;
  setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
  user: User;
  currentUser;
  setCurrentUser;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileMenuBar: FC<Props> = (props) => {
  const {
    isOpenBottomNotification,
    setIsOpenBottomNotification,
    isOpenBottomMenu,
    setIsOpenBottomMenu,
    setIsOpenMenu,
    user,
    currentUser,
    setCurrentUser,
    notifications,
    setNotifications,
    setIsLoginModalOpen,
  } = props;

  const clickBell = () => {
    if (isOpenBottomNotification) {
      setIsOpenBottomNotification(false);
    } else {
      setIsOpenBottomNotification(true);
    }
  };

  const clickAvatar = () => {
    if (isOpenBottomMenu) {
      setIsOpenBottomMenu(false);
    } else {
      setIsOpenBottomMenu(true);
    }
  };

  return (
    <div>
      <div className="fixed z-50 w-full text-center bottom-0 border-t  border-gray-100 shadow bg-white sm:hidden">
        <div className="flex justify-around items-center">
          {/* ホームボタン */}
          <Link href="/">
            <div
              className="w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
              onClick={() => {
                if (isOpenBottomNotification) {
                  setIsOpenBottomNotification(false);
                }
                if (isOpenBottomMenu) {
                  setIsOpenBottomMenu(false);
                }
              }}
            >
              <IoHome className="text-3xl text-gray-500 mx-auto" />
            </div>
          </Link>

          {/* お知らせボタン */}
          <div
            className="-mr-0.5 w-1/4 pt-2.5 pb-3 cursor-pointer hover:opacity-80"
            onClick={() => {
              clickBell();
              notificationChecked(currentUser, setNotifications);
              if (isOpenBottomMenu) {
                setIsOpenBottomMenu(false);
              }
            }}
          >
            <div className="w-0 h-0 bg-transparent mx-auto z-0 relative">
              <div
                hidden={
                  !(
                    notifications &&
                    notifications.filter(
                      (notification) => notification.checked === false
                    ).length !== 0
                  )
                }
                className="absolute top-1 left-1.5 rounded-full h-2.5 w-2.5 bg-red-500"
              ></div>
            </div>
            <FaBell className="text-3xl text-gray-500 mx-auto z-10" />
          </div>

          {user ? (
            <div
              className="w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
              onClick={() => {
                clickAvatar();
                if (isOpenBottomNotification) {
                  setIsOpenBottomNotification(false);
                }
              }}
            >
              <img
                src={user?.avatar}
                className="h-9 w-9 rounded-full object-cover mx-auto"
              />
            </div>
          ) : (
            <div
              className="w-1/4 pt-2 pb-3  cursor-pointer hover:opacity-80"
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
            >
              <img
                src="/avatar(2).png"
                className="h-9 w-9 rounded-full object-cover mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      <div className="sm:hidden">
        <div
          className={
            isOpenBottomNotification
              ? "fixed top-0 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-0 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
          onClick={() => {
            clickBell();
          }}
        >
          <div
            className={
              isOpenBottomNotification
                ? `transform translate-x-0 bg-white fixed top-0 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-300`
                : `transform translate-x-full bg-white fixed top-0 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-500`
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-gray-900 my-3">お知らせ</div>
            <div className="border border-b border-gray-50 mt-1 w-full"></div>
            <NotificationList
              notifications={notifications}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div
          className={
            isOpenBottomMenu
              ? "fixed top-0 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-0 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
          onClick={() => {
            clickAvatar();
          }}
        >
          <div
            className={
              isOpenBottomMenu
                ? `transform translate-x-0 bg-white fixed top-0 bottom-14 w-64 px-2 right-0 overflow-scroll ease-in-out transition-all duration-300 z-30`
                : `transform translate-x-full bg-white fixed top-0 bottom-14 w-64 px-2 right-0 overflow-scroll ease-in-out transition-all duration-500 z-30`
            }
            onClick={(e) => e.stopPropagation()}
          >
            <MenuList
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              user={user}
              setIsOpenMenu={setIsOpenMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuBar;
