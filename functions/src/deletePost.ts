import { FieldValue, getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";

// When a post is deleted, remove its chatrooms, messages and likes, and drop
// the post from every user's likePostIDs.
export const deletePost = functions
  .region("asia-northeast1")
  .firestore.document("users/{userID}/posts/{postID}")
  .onDelete(async (snap) => {
    const db = getFirestore();
    const data = snap.data();
    const postID = data.postID;

    const groups = await Promise.all(
      ["chatrooms", "messages", "likePosts"].map((group) =>
        db.collectionGroup(group).where("postID", "==", postID).get(),
      ),
    );
    const likeUserIDs: string[] = data.likeUserIDs ?? [];

    await Promise.all([
      ...groups.flatMap((snapshot) => snapshot.docs.map((doc) => doc.ref.delete())),
      ...likeUserIDs.map((likeUserID) =>
        db
          .collection("users")
          .doc(`${likeUserID}`)
          .update({ likePostIDs: FieldValue.arrayRemove(`${postID}`) }),
      ),
    ]);
  });
