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
    const likeUserIDs: string[] = data.likeUserIDs ?? [];

    const groups = await Promise.all(
      ["chatrooms", "messages", "likePosts"].map((group) =>
        db.collectionGroup(group).where("postID", "==", postID).get(),
      ),
    );

    const writes: { path: string; done: Promise<unknown> }[] = [
      ...groups.flatMap((snapshot) =>
        snapshot.docs.map((doc) => ({ path: doc.ref.path, done: doc.ref.delete() })),
      ),
      ...likeUserIDs.map((likeUserID) => {
        const ref = db.collection("users").doc(`${likeUserID}`);
        return {
          path: ref.path,
          done: ref.update({ likePostIDs: FieldValue.arrayRemove(`${postID}`) }),
        };
      }),
    ];

    // Settle every write so one failure neither hides the others nor stops them.
    const results = await Promise.allSettled(writes.map((write) => write.done));
    const failures = results.flatMap((result, i) =>
      result.status === "rejected" ? [{ path: writes[i].path, reason: String(result.reason) }] : [],
    );
    if (failures.length > 0) {
      functions.logger.error("deletePost cleanup failed", { postID, failures });
      throw new Error(`deletePost: ${failures.length} of ${writes.length} cleanup writes failed`);
    }
  });
