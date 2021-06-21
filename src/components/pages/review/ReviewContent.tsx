import { CgSmile, CgSmileNone } from "react-icons/cg";
import { FaRegClock } from "react-icons/fa";
import Link from "next/link";

const ReviewContent = (props) => {
  const { review } = props;

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
    <div>
      <div className="flex mt-6 pb-4 cursor-pointer hover:opacity-80">
        <img
          src={review.reviewerAvatar}
          className="w-10 h-10 rounded-full mr-4 object-cover"
        />
        <div className="w-full">
          {review.postUserID === review.reviewerID &&
          review.rating === "good" ? (
            <div className="flex items-center">
              <CgSmile className="text-red-400 text-lg sm:text-xl" />
              <div className="fontSize-sm text-gray-500 ml-1">掲載者</div>
            </div>
          ) : review.postUserID === review.reviewerID &&
            review.rating === "bad" ? (
            <div className="flex items-center">
              <CgSmileNone className="text-blue-400 text-lg sm:text-xl" />
              <div className="fontSize-sm text-gray-500 ml-1">掲載者</div>
            </div>
          ) : review.postUserID !== review.reviewerID &&
            review.rating === "good" ? (
            <div className="flex items-center">
              <CgSmile className="text-red-400 text-lg sm:text-xl" />
              <div className="fontSize-sm text-gray-500 ml-1">購入者</div>
            </div>
          ) : (
            <div className="flex items-center">
              <CgSmileNone className="text-blue-400 text-lg sm:text-xl" />
              <div className="fontSize-sm text-gray-500 ml-1">購入者</div>
            </div>
          )}

          <div className="text-gray-900 fontSize-sm">
            {review.reviewerName}
          </div>
          <div className="fontSize-sm text-gray-800 mb-1.5 mt-1 whitespace-pre-wrap">
            {review.reviewText}
          </div>
          <div className="flex justify-between items-center w-full">
            <Link href={`/post/postShow/${review.postID}`}>
              <div className="text-blue-700 reviewPostTitleText border-b border-blue-700 mr-auto inline-block cursor-pointer line-clamp-1 z-10">
                {review.postTitle}
              </div>
            </Link>
            <div className="flex items-center text-gray-500 mb-0.5 whitespace-nowrap ml-2">
              <FaRegClock className="mr-0.5 text-xs" />
              <div className="reviewPostTitleText inline-block">
                {createdTime(review.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" border-b border-gray-300 w-full"></div>
    </div>
  );
};

export default ReviewContent;
