import Link from "next/link";
import React from "react";
import ReviewContent from "./ReviewContent";


const ReviewListItem = (props) => {
  const { review } = props;

  return (
    <>
      {review.deletedAccount === true ? (
        <ReviewContent review={review} />
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
            <ReviewContent review={review} />
          </a>
        </Link>
      )}
    </>
  );
};

export default ReviewListItem;
