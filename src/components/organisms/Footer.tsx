import Link from "next/link";
import React from "react";
import { FaBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import MenuList from "./MenuList";
import NotificationList from "./NotificationList";

const Footer = (props) => {
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
      setIsOpenBottomMenu(!isOpenBottomMenu);
      document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
    } else {
    }
    setIsOpenBottomMenu(!isOpenBottomMenu);
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

          <div
            className="-mr-1.5 w-1/4 pt-2 pb-3 cursor-pointer hover:opacity-80"
            onClick={() => {
              clickBell();
              if (isOpenBottomMenu) {
                setIsOpenBottomMenu(false);
              }
            }}
          >
            <FaBell className="text-3xl text-gray-500 mx-auto" />
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
            <Link href="/login">
              <div className="w-1/4 pt-2 pb-3  cursor-pointer hover:opacity-80">
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
              ? "fixed top-12 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-12 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
          onClick={() => {
            clickBell();
          }}
        >
          <div
            className={
              isOpenBottomNotification
                ? `transform translate-x-0 bg-white fixed top-12 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-300`
                : `transform translate-x-full bg-white fixed top-12 bottom-14 w-64 px-2 right-0 overflow-auto ease-in-out transition-all duration-500`
            }
            onClick={(e) => e.stopPropagation()}
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
              ? "fixed top-12 bottom-14 left-0 right-0 bg-black bg-opacity-70 transition-all duration-300 z-20"
              : "fixed top-12 bottom-14 left-0 right-0 bg-black bg-opacity-0 transition-all duration-500 z-10-"
          }
          onClick={() => {
            clickAvatar();
          }}
        >
          <div
            className={
              isOpenBottomMenu
                ? `transform translate-x-0 bg-white fixed top-12 bottom-14 w-64 px-2 right-0 overflow-scroll ease-in-out transition-all duration-300 z-30`
                : `transform translate-x-full bg-white fixed top-12 bottom-14 w-64 px-2 right-0 overflow-scroll ease-in-out transition-all duration-500 z-30`
            }
            onClick={(e) => e.stopPropagation()}
          >
            <MenuList
              currentUser={currentUser}
              serCurrentUser={setCurrentUser}
              user={user}
              setIsOpenMenu={setIsOpenMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
