import { db } from "../../firebase/firebase";
import firebase from "firebase/app";
import { setReviewStates } from "../../utils/states";
import { Post, Review, User } from "../../types/types";
import { Dispatch, SetStateAction } from "react";

const submitReview = (
  e: React.FormEvent<HTMLFormElement>,
  post: Post,
  currentUser,
  user: User,
  rateValue: string,
  reviewText: string,
  setReviewsOnHold: Dispatch<SetStateAction<Review[]>>,
  setIsOpenRatingModal: Dispatch<SetStateAction<boolean>>
) => {
  e.preventDefault();
  const receiverID =
    currentUser.uid === post.userID ? post.clientUserID : post.userID;

  db.collection("reviewsOnHold").add({
    postID: post.postID,
    postUserID: post.userID,
    postTitle: post.title,
    postImage: post.images[0],
    reviewerID: currentUser.uid,
    reviewerName: user.username,
    reviewerAvatar: user.avatar,
    receiverID: receiverID,
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
