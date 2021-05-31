import Link from "next/link";
import React from "react";
import { FaBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import NotificationList from "./NotificationList";

const Footer = (props) => {
  const {
    isOpenBottomNotification,
    setIsOpenBottomNotification,
    isOpenBottomMenu,
    setisOpenBottomMenu,
    user,
    currentUser,
    notifications,
  } = props;

  const clickBell = () => {
    if (isOpenBottomNotification) {
      setIsOpenBottomNotification(!isOpenBottomNotification);
      document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
    } else {
    }
    setIsOpenBottomNotification(!isOpenBottomNotification);
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-hidden");
  };

  const clickAvatar = () => {
    if (isOpenBottomMenu) {
      setisOpenBottomMenu(!isOpenBottomMenu);
      document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
    } else {
    }
    setIsOpenBottomNotification(!isOpenBottomMenu);
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-hidden");
  };

  return (
    <div>
      <footer className="h-12 w-full text-center bottom-0 border-t border-gray-200 absolute bg-white hidden sm:block">
        <div className="py-3">©︎ happy horse</div>
      </footer>
      <footer className="fixed z-50 w-full text-center bottom-0 border-t  border-gray-100 shadow bg-white sm:hidden">
        <div className="flex justify-around items-center">
          <Link href="/">
            <div
              className="w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
              onClick={() => {
                if (isOpenBottomNotification) {
                  setIsOpenBottomNotification(!isOpenBottomNotification);
                }
              }}
            >
              <IoHome className="text-3xl text-gray-500 mx-auto" />
            </div>
          </Link>

          <div
            className="-mr-0.5 w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
            onClick={() => {
              clickBell();
            }}
          >
            <FaBell className="text-3xl text-gray-500 mx-auto" />
          </div>

          {user ? (
            <div
              className="w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
              onClick={() => {
                clickAvatar();
              }}
            >
              <img
                src={user?.avatar}
                className="h-9 w-9 rounded-full object-cover mx-auto"
              />
            </div>
          ) : (
            <Link href="/login">
              <div
                className="w-1/4 pt-2 pb-3  cursor-pointer hover:opacity-80"
                onClick={() => {
                  if (isOpenBottomNotification) {
                    setIsOpenBottomNotification(!isOpenBottomNotification);
                  }
                }}
              >
                <img
                  src="/avatar(2).png"
                  className="h-9 w-9 rounded-full object-cover mx-auto"
                />
              </div>
            </Link>
          )}
        </div>
      </footer>

      <div className="sm:hidden">
        <div
          className={
            isOpenBottomNotification
              ? "fixed top-16 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-16 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
        >
          <div
            className={
              isOpenBottomNotification
                ? `transform translate-x-0 bg-white fixed top-16 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-300`
                : `transform translate-x-full bg-white fixed top-16 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-500`
            }
          >
            <NotificationList
              notifications={notifications}
              currentUser={currentUser}
            />
          </div>

        </div>
        <div
          className={
            isOpenBottomMenu
              ? "fixed top-16 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-16 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
        >
          <div
            className={
              isOpenBottomMenu
                ? `transform translate-x-0 bg-white fixed top-16 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-300`
                : `transform translate-x-full bg-white fixed top-16 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-500`
            }
          >
            <NotificationList
              notifications={notifications}
              currentUser={currentUser}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;
