import Link from "next/link";
import React, { SetStateAction } from "react";
import { FC } from "react";
import { Dispatch } from "react";
import {
  FaYenSign,
  FaMapMarkerAlt,
  FaHorse,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { Post, User } from "../../types/types";
import Category from "../atoms/Category";

type Props = {
  posts: Post[];
  filteredPosts: Post[];
  setFilteredPosts: Dispatch<SetStateAction<Post[]>>;
  clickPost;
  clickHeartIndex;
  currentUser;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  width: number;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Posts: FC<Props> = (props) => {
  const {
    posts,
    filteredPosts,
    setFilteredPosts,
    clickPost,
    clickHeartIndex,
    currentUser,
    user,
    setUser,
    width,
    setIsLoginModalOpen,
  } = props;

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.postID}
          className="border-b border-gray-300 pb-6 mb-10 sm:mb-16"
        >
          <div
            className="flex mb-5 z-0"
            data-id={post.postID}
            onClick={clickPost}
          >
            <div className="w-full md:w-2/3">
              <div className="pb-image w-full h-0 relative">
                {!post.isAvairable && (
                  <div className="absolute top-0 left-0 bg-gray-400 font-semibold text-white px-3 py-0.5 z-1 rounded-br-md fontSize-base md:px-4 md:py-1">
                    SOLD OUT!
                  </div>
                )}
                <img
                  src={post.images[0] ? post.images[0] : "/no-image.png"}
                  className="object-cover outline-none w-full h-full cursor-pointer absolute"
                />
              </div>
            </div>
            {width > 768 && (
              <div className="w-1/3">
                <div className="pb-image w-full h-0 relative">
                  <img
                    src={post.images[1] ? post.images[1] : "/no-image.png"}
                    className="object-cover outline-none w-full h-full cursor-pointer absolute"
                  />
                </div>
                <div className="pb-image w-full h-0 relative">
                  <img
                    src={post.images[2] ? post.images[2] : "/no-image.png"}
                    className="object-cover outline-none w-full h-full cursor-pointer absolute"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center md:ml-2">
            <div className="mb-px">
              <Category category={post.category} />
            </div>

            <FaYenSign className="text-gray-400 text-xl ml-4 " />
            <div className="fontSize-base text-gray-900 ml-1">
              {post.price}円
            </div>

            <FaHorse className="text-gray-400 text-xl ml-6 hidden md:block" />
            <div className="text-gray-900 ml-2 hidden md:block">
              {post.breed}
            </div>

            <FaMapMarkerAlt className="text-gray-400 text-xl ml-5 " />
            <div className="fontSize-base text-gray-900 ml-1.5">
              {post.area}
            </div>
          </div>
          <Link href={`/post/postShow/${post.postID}`} scroll={false}>
            <div className="cursor-pointer hover:opacity-80">
              <h2 className="font-semibold text-gray-800 mt-3 mb-2 line-clamp-2 md:my-3 md:text-xl">
                {post.title}
              </h2>
            </div>
          </Link>
          <p className="fontSize-sm text-gray-500 line-clamp-2 ">
            {post.postText}
          </p>
          <div className="flex justify-between items-center mt-4 md:mt-6">
            {post.deletedAccount === true ? (
              <div className="flex items-center cursor-pointer hover:opacity-80 ml-0 sm:ml-1">
                <img
                  src={post.avatar}
                  className="object-cover rounded-full w-10 h-10 md:w-12 md:h-12"
                />
                <p className="fontSize-base text-gray-900 ml-3">
                  {post.username}
                </p>
              </div>
            ) : (
              <Link
                href={{
                  pathname: "/profile",
                  query: {
                    uid: post.userID,
                  },
                }}
                scroll={false}
              >
                <div className="flex items-center cursor-pointer hover:opacity-80 sm:ml-1">
                  <img
                    src={post.avatar}
                    className="object-cover rounded-full w-10 h-10 md:w-12 md:h-12"
                  />
                  <p className="fontSize-base text-gray-900 ml-3">
                    {post.username}
                  </p>
                </div>
              </Link>
            )}

            <div
              className="flex items-center cursor-pointer hover:shadow-xl transition duration-500 rounded-full py-2 px-4"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                currentUser
                  ? clickHeartIndex(
                      e,
                      currentUser,
                      user,
                      setUser,
                      setFilteredPosts
                    )
                  : setIsLoginModalOpen(true);
              }}
              data-id={post.postID}
            >
              {filteredPosts &&
              filteredPosts
                .find((filteredPost) => filteredPost.postID === post.postID)
                .likeUserIDs.includes(currentUser?.uid) ? (
                <FaHeart className="text-3xl text-red-400" />
              ) : (
                <FaRegHeart className="text-3xl text-gray-900" />
              )}
              <p className="text-gray-900 ml-2 hidden md:inline-block">
                お気に入り
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
