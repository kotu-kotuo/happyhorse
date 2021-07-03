import Link from "next/link";
import React, { FC } from "react";
import { Review } from "../../../types/types";
import ReviewContent from "./ReviewContent";

type Props = {
  review: Review;
};

const ReviewListItem: FC<Props> = (props) => {
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
