import { db } from "../../firebase/firebase";
import { MouseEvent } from "react";
import { NextRouter } from "next/router";
import { Post } from "../../types/types";

const deletePost = async (
  e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  post: Post,
  currentUser,
  router: NextRouter
) => {
  e.preventDefault();

  if (post.clientUserID) {
    alert("取引の途中で記事は削除できません。");
    return;
  }
  const result = window.confirm("本当に削除しますか？");
  if (result) {
    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(post.postID)
      .delete();

    //functions/deletePostに記載

    await router.push("/");
  }
};

export default deletePost;
