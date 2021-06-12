import React from "react";
import { CgSmile, CgSmileNone } from "react-icons/cg";
import Link from "next/link";

const ReviewListItem = (props) => {
  const { review } = props;

  //時間をUNIXから変換
  const createdTime = (reviewTime) => {
    const time = new Date(reviewTime?.seconds * 1000);
    return time.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <>
      {review.deletedAccount === true ? (
        <>
          <div className="flex mt-6 pb-4 cursor-pointer hover:opacity-80">
            <img
              src={review.reviewerAvatar}
              className="w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div>
              {review.postUserID === review.reviewerID &&
              review.rating === "good" ? (
                <div className="flex items-center">
                  <CgSmile className="text-red-400 text-xl" />
                  <div className="text-gray-500 text-sm ml-1">掲載者</div>
                </div>
              ) : review.postUserID === review.reviewerID &&
                review.rating === "bad" ? (
                <div className="flex items-center">
                  <CgSmileNone className="text-blue-400 text-xl" />
                  <div className="text-gray-500 text-sm ml-1">掲載者</div>
                </div>
              ) : review.postUserID !== review.reviewerID &&
                review.rating === "good" ? (
                <div className="flex items-center">
                  <CgSmile className="text-red-400 text-xl" />
                  <div className="text-gray-500 text-sm ml-1">購入者</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <CgSmileNone className="text-blue-400 text-xl" />
                  <div className="text-gray-500 text-sm ml-1">購入者</div>
                </div>
              )}

              <div className="text-gray-900 text-base">
                {review.reviewerName}
              </div>
              <div className="text-gray-800 text-sm mb-1.5 whitespace-pre-wrap">
                {review.reviewText}
              </div>
              <div className="text-gray-500 reviewPostTitleText -mb-0.5">
                {createdTime(review.createdAt)}
              </div>
              <Link href={`/post/postShow/${review.postID}`}>
                <div className="text-blue-700 reviewPostTitleText border-b border-blue-700 mr-auto inline-block -mt-10 cursor-pointer z-10">
                  {review.postTitle}
                </div>
              </Link>
            </div>
          </div>
          <div className=" border-b border-gray-300 w-full"></div>
        </>
      ) : (
        <Link
          href={{
            pathname: "/profile",
            query: {
              uid: review.reviewerID,
            },
          }}
        >
          <a>
            <div className="flex mt-6 pb-4 cursor-pointer hover:opacity-80">
              <img
                src={review.reviewerAvatar}
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div>
                {review.postUserID === review.reviewerID &&
                review.rating === "good" ? (
                  <div className="flex items-center">
                    <CgSmile className="text-red-400 text-xl" />
                    <div className="text-gray-500 text-sm ml-1">掲載者</div>
                  </div>
                ) : review.postUserID === review.reviewerID &&
                  review.rating === "bad" ? (
                  <div className="flex items-center">
                    <CgSmileNone className="text-blue-400 text-xl" />
                    <div className="text-gray-500 text-sm ml-1">掲載者</div>
                  </div>
                ) : review.postUserID !== review.reviewerID &&
                  review.rating === "good" ? (
                  <div className="flex items-center">
                    <CgSmile className="text-red-400 text-xl" />
                    <div className="text-gray-500 text-sm ml-1">購入者</div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CgSmileNone className="text-blue-400 text-xl" />
                    <div className="text-gray-500 text-sm ml-1">購入者</div>
                  </div>
                )}

                <div className="text-gray-900 text-base">
                  {review.reviewerName}
                </div>
                <div className="text-gray-800 text-sm mb-1.5 whitespace-pre-wrap">
                  {review.reviewText}
                </div>
                <div className="text-gray-500 reviewPostTitleText -mb-0.5">
                  {createdTime(review.createdAt)}
                </div>
                <Link href={`/post/postShow/${review.postID}`}>
                  <div className="text-blue-700 reviewPostTitleText border-b border-blue-700 mr-auto inline-block -mt-10 cursor-pointer z-10">
                    {review.postTitle}
                  </div>
                </Link>
              </div>
            </div>
            <div className=" border-b border-gray-300 w-full"></div>
          </a>
        </Link>
      )}
    </>
  );
};

export default ReviewListItem;
