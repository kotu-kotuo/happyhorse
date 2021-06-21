import { useState, useEffect } from "react";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { setReviewStates } from "../utils/states";
import { db } from "../firebase/firebase";
import SwitchDisplay from "../components/molecules/SwitchDisplay";
import { NextPage } from "next";
import { reviewInitialValues } from "../utils/initialValues";
import { Review } from "../types/types";
// import ReviewListItem from "../components/pages/review/ReviewListItem";
import ReviewContent from "../components/pages/review/ReviewContent";
import Link from "next/link";

const reviews: NextPage = () => {
  const [goodReviews, setGoodReviews] = useState<Review[]>([
    reviewInitialValues,
  ]);
  const [badReviews, setBadReviews] = useState<Review[]>([reviewInitialValues]);
  const [isLeftHidden, setIsLeftHidden] = useState(false);
  const [isRightHidden, setIsRightHidden] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.query.uid) {
      db.collection("users")
        .doc(`${router.query.uid}`)
        .collection("reviews")
        .where("rating", "==", "good")
        .get()
        .then((snapshot) =>
          setGoodReviews(
            snapshot.docs
              .map((doc) => setReviewStates(doc.data()))
              .sort((a, b) => -(a.createdAt - b.createdAt))
          )
        );

      db.collection("users")
        .doc(`${router.query.uid}`)
        .collection("reviews")
        .where("rating", "==", "bad")
        .get()
        .then((snapshot) =>
          setBadReviews(
            snapshot.docs
              .map((doc) => setReviewStates(doc.data()))
              .sort((a, b) => -(a.createdAt - b.createdAt))
          )
        );
    }
  }, [router.query.uid]);

  return (
    <div>
      <Layout title="レビュー">
        {router.query.uid && (goodReviews || badReviews) && (
          <div className="max-w-2xl mx-auto px-2 pb-3">
            <SwitchDisplay
              setIsLeftHidden={setIsLeftHidden}
              setIsRightHidden={setIsRightHidden}
              title={"評価一覧"}
              textLeft={`良かった(${goodReviews.length})`}
              textRight={`残念だった(${badReviews.length})`}
            />
            {isLeftHidden === false &&
              goodReviews.map((review) => {
                review.deletedAccount === true ? (
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
                );
              })}
            {isRightHidden === false &&
              badReviews.map((review) => {
                review.deletedAccount === true ? (
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
                );
              })}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default reviews;
