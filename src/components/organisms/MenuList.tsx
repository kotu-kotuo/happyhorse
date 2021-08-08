import React, { Dispatch, SetStateAction } from "react";
import MenuListItem from "../molecules/MenuListItem";
import { auth } from "../../firebase/firebase";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import StarRatings from "react-star-ratings";
import { User } from "../../types/types";
import { FC } from "react";

type Props = {
  currentUser;
  setCurrentUser;
  user: User;
  setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
};

const MenuList: FC<Props> = (props) => {
  const { currentUser, setCurrentUser, user, setIsOpenMenu } = props;

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
    <div>
      {currentUser && user && (
        <>
          <div className="text-center p-6 border-b">
            <img
              className="h-24 w-24 rounded-full mx-auto object-cover mb-3"
              src={user?.avatar}
              alt="avatar"
            />
            <p className="pt-2 font-semibold sm:text-lg">{`${user.username}`}</p>
            <Link
              href={{
                pathname: "/reviews",
                query: {
                  uid: user.id,
                },
              }}
            >
              <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                <div>
                  <StarRatings
                    numberOfStars={5}
                    rating={
                      (user.good * 5 + user.bad * 1) / (user.good + user.bad) ||
                      0
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
          <MenuListItem label={"メッセージ管理"} link={"/message/management"} />
          <MenuListItem label={"お気に入りの馬"} link={"/post/myLikePosts"} />
          <MenuListItem label={"掲載した馬"} link={"/post/myPosts"} />
          <MenuListItem label={"下書き保存リスト"} link={"/post/draftList"} />
          <MenuListItem label={"設定"} link={"/setting"} />

          <a
            onClick={logout}
            className="px-4 py-4 hover:bg-gray-100 flex items-center cursor-pointer"
          >
            <p className="text-sm font-medium text-gray-800 leading-none">
              ログアウト
            </p>
            <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
          </a>
        </>
      )}
    </div>
  );
};

export default MenuList;
