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

    // One commit, so the count and the pending entries never drift apart.
    const batch = db.batch();
    batch.update(db.collection("users").doc(`${data.receiverID}`), {
      [field]: FieldValue.increment(1),
    });
    for (const doc of onHold.docs) batch.delete(doc.ref);
    await batch.commit();
  });
