import Link from "next/link";
import { FC } from "react";
import { Chatroom, Post } from "../../../types/types";

type Props = {
  currentUser;
  post: Post;
  chatroom: Chatroom;
};

const MobilePostInfo: FC<Props> = (props) => {
  const { currentUser, post, chatroom } = props;
  return (
    <div className="sm:hidden">
      <Link href={`/post/postShow/${post.postID}`}>
        <div
          className={
            currentUser?.uid === chatroom?.postUserID
              ? "flex items-center w-full border-b border-t border-gray-500 mt-8 mb-6 cursor-pointer"
              : "flex items-center w-full border-b border-t border-gray-500 -mt-3 mb-6 cursor-pointer"
          }
        >
          <div>
            <img
              src={post.images[0]}
              className="min-h-10 h-10 min-w-18 w-18 mr-2 object-cover"
            />
          </div>
          <div className="text-gray-900 line-clamp-1 text-sm text-left ">
            {post.title}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobilePostInfo;
