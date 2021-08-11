import React, { FC, SetStateAction } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import LoginModal from "../../molecules/LoginModal";
import { Post, User } from "../../../types/types";
import { Dispatch } from "react";

type Props = {
  clickHeartShow;
  currentUser;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  post: Post;
  setPostState: Dispatch<SetStateAction<Post>>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const LikeButton: FC<Props> = (props) => {
  const {
    clickHeartShow,
    currentUser,
    user,
    setUser,
    post,
    setPostState,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = props;
  return (
    <>
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />

      {/* ----- PC ----- */}
      <div className="hidden md:block">
        <div
          className="flex items-center mb-4 cursor-pointer hover:opacity-80"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            currentUser
              ? clickHeartShow(e, currentUser, user, setUser, setPostState)
              : setIsLoginModalOpen(true);
          }}
          data-id={post.postID}
        >
          {currentUser && post.likeUserIDs?.includes(currentUser?.uid) ? (
            <FaHeart className="text-[22px] text-red-400" />
          ) : (
            <FaRegHeart className="text-[22px] text-gray-900" />
          )}
          <p className="text-gray-900 ml-3 mr-1">
            お気に入り
            <span className="ml-3 text-gray-900 font-bold sm:font-semibold">
              {post.likeUserIDs?.length}
            </span>
          </p>
        </div>
      </div>

      {/* ----- モバイル ----- */}
      <div className="md:hidden text-center">
        <div
          className="cursor-pointer mb-0.5 hover:opacity-80"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            currentUser
              ? clickHeartShow(e, currentUser, user, setUser, setPostState)
              : setIsLoginModalOpen(true);
          }}
          data-id={post.postID}
        >
          {currentUser && post.likeUserIDs?.includes(currentUser?.uid) ? (
            <div className="bg-red-400 px-2 pt-2.5 pb-1.5 rounded-full inline-block shadow-md">
              <BsHeart className="text-2xl text-white" />
            </div>
          ) : (
            <div className="bg-gray-300 px-2 pt-2.5 pb-1.5 rounded-full inline-block shadow-md">
              <BsHeart className="text-2xl text-white" />
            </div>
          )}
          <div className="flex items-center text-gray-500 text-[11px]">
            <div className="text-gray-500">お気に入り</div>
            <div className="ml-0.5 font-bold sm:font-semibold">
              {post.likeUserIDs?.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LikeButton;
