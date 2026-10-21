import { FieldValue, getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";

// Count a new review into the receiver's good/bad totals and clear the
// pending-review entries for the post.
export const reviewRating = functions
  .region("asia-northeast1")
  .firestore.document("users/{userID}/reviews/{reviewID}")
  .onCreate(async (snap) => {
    const db = getFirestore();
    const data = snap.data();
    const field = data.rating === "good" ? "good" : "bad";

    const onHold = await db
      .collection("reviewsOnHold")
      .where("postID", "==", data.postID)
      .get();

    await Promise.all([
      db
        .collection("users")
        .doc(`${data.receiverID}`)
        .update({ [field]: FieldValue.increment(1) }),
      ...onHold.docs.map((doc) => doc.ref.delete()),
    ]);
  });
