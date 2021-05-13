import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { setReviewStates } from "../utils/states";
import { db } from "../utils/firebase";
import SwitchDisplay from "../components/molecules/SwitchDisplay";
import ReviewListItem from "../components/molecules/reviewListItem";

// import { Post } from "../../types/types";
// import { postInitialValues } from "../../utils/initialValues";
// import { setPostStates } from "../../utils/states";

const reviews = () => {
  const { currentUser } = useContext(AuthContext);
  const [goodReviews, setGoodReviews] = useState([]);
  const [badReviews, setBadReviews] = useState([]);
  const [isLeftHidden, setIsLeftHidden] = useState(false);
  const [isRightHidden, setIsRightHidden] = useState(true);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
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
        .doc(`${currentUser.uid}`)
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
  }, [currentUser]);

  return (
    <div>
      <Layout title="reviews">
        {currentUser && reviews && (
          <div className="max-w-2xl mx-auto">
            <SwitchDisplay
              setIsLeftHidden={setIsLeftHidden}
              setIsRightHidden={setIsRightHidden}
              title={"評価一覧"}
              textLeft={`良かった(${goodReviews.length})`}
              textRight={`残念だった(${badReviews.length})`}
            />
            {isLeftHidden === false &&
              goodReviews.map((review) => <ReviewListItem review={review} />)}
            {isRightHidden === false &&
              badReviews.map((review) => <ReviewListItem review={review} />)}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default reviews;
