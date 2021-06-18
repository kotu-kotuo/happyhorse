import React from "react";
import { FaRegClock, FaRegHeart, FaRegUser } from "react-icons/fa";
import createdTime from "../../../functions/createdTime";

const MyPostList = (props) => {
  const {
    myPosts,
    setIsMyPostsHidden,
    setIsMyPostChatroomsHidden,
    setClickPid,
    reviewsOnHold,
  } = props;

  return (
    <div>
      {myPosts.map((myPost, index) => (
        <div
          className="mx-2 my-4 rounded-md shadow border-gray-500 sm:my-6"
          key={index}
        >
          <div
            onClick={(e) => {
              setIsMyPostsHidden(true);
              setIsMyPostChatroomsHidden(false);
              setClickPid(e.currentTarget.getAttribute("data-id"));
            }}
            data-id={myPost.postID}
            className="cursor-pointer"
          >
            <div className="flex">
              <div>
                <img
                  src={myPost.images[0]}
                  className="h-18 w-18 rounded-l-md mr-3 block object-cover sm:h-18 sm:w-28"
                />
              </div>
              <div className="px-3 py-1 max-w-3xl w-full">
                <div className="fontSize-base text-gray-900 mr-0.5 mt-0 line-clamp-1 sm:mr-2 sm:mt-1">
                  {myPost.title}
                </div>
                <p className="fontSize-sm text-gray-500 mt-1 mb-1 line-clamp-1 sm:mt-0 sm:mb-0">
                  {/* レビューが完了したユーザの最新メッセージを変更 */}
                  {myPost.latestMessage === "評価をお願いします" &&
                  reviewsOnHold.filter(
                    (review) => review.reviewerID === myPost.userID
                  ).length !== 0 &&
                  reviewsOnHold.filter(
                    (review) => review.postID === myPost.postID
                  ).length !== 0
                    ? "評価完了しました"
                    : myPost.latestMessage}
                </p>
                <div className="flex justify-end items-center w-full">
                  <div className="mr-2 flex items-center">
                    <FaRegUser className="text-gray-500 text-xs mr-0.5" />
                    <div className="text-gray-500 text-xs">
                      {myPost.sendMessageUserIDs.length}
                    </div>
                  </div>
                  <div className="mr-2 flex items-center">
                    <FaRegHeart className="text-gray-500 text-xs mr-1" />
                    <div className="text-gray-500 text-xs">
                      {myPost.likeUserIDs.length}
                    </div>
                  </div>
                  <div className="mr-2 flex items-center">
                    <FaRegClock className="text-gray-500 text-xs mr-0.5" />
                    <div className="text-gray-500 text-xs">
                      {createdTime(myPost.messageUpdatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPostList;
