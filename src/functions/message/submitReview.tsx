import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import { setReviewStates } from "../../utils/states";

const submitReview = (
  e,
  post,
  currentUser,
  user,
  rateValue,
  reviewText,
  setReviewsOnHold,
  setIsOpenRatingModal
) => {
  e.preventDefault();

  db.collection("reviewsOnHold").add({
    postID: post.postID,
    postUserID: post.userID,
    postTitle: post.title,
    postImage: post.images[0],
    reviewerID: currentUser.uid,
    reviewerName: user.username,
    reviewerAvatar: user.avatar,
    rating: rateValue,
    reviewText: reviewText,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  db.collection("reviewsOnHold")
    .where("postID", "==", post.postID)
    .get()
    .then((snapshot) => {
      setReviewsOnHold(
        snapshot.docs.map((doc) =>
          setReviewStates(doc.data({ serverTimestamps: "estimate" }))
        )
      );
    });

  setIsOpenRatingModal(false);
};

export default submitReview;
