import Link from "next/link";
import { FC } from "react";
import { Dispatch, SetStateAction } from "react";
import { Post } from "../../../types/types";
import MessageButton from "./MessageButton";

type Props = {
  currentUser;
  post: Post;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MessageButtonHandle: FC<Props> = (props) => {
  const { currentUser, post, setIsLoginModalOpen } = props;
  return (
    <div>
      {!post.isAvairable &&
      !(
        currentUser?.uid === post.userID ||
        currentUser?.uid === post?.clientUserID
      ) ? (
        <>
          <MessageButton
            bgStyle={" bg-gray-400 pointer-events-none "}
            label={"SOLD OUT!"}
          />
        </>
      ) : post.isAvairable &&
        post.clientUserID.length !== 0 &&
        !(
          currentUser?.uid === post.userID ||
          currentUser?.uid === post?.clientUserID
        ) ? (
        <>
          <MessageButton
            bgStyle={" bg-gray-400 pointer-events-none "}
            label={"他の方と取引中"}
          />
        </>
      ) : currentUser?.uid === post.userID ? (
        <Link href="/message/management">
          <a>
            <MessageButton
              bgStyle={" bg-mainGreen hover:opacity-90 hover:shadow-lg"}
              label={"メッセージ管理"}
            />
          </a>
        </Link>
      ) : post.deletedAccount === true ? (
        <div></div>
      ) : !currentUser ? (
        <div
          onClick={() => {
            setIsLoginModalOpen(true);
          }}
        >
          <MessageButton
            bgStyle={" bg-mainGreen hover:opacity-90 hover:shadow-lg"}
            label={"メッセージを送る"}
          />
        </div>
      ) : (
        <Link
          href={
            currentUser
              ? {
                  pathname: "/message/messages",
                  query: {
                    uid: post.userID,
                    pid: post.postID,
                    cid: currentUser.uid,
                  },
                }
              : { pathname: "/login" }
          }
        >
          <a>
            <MessageButton
              bgStyle={" bg-mainGreen hover:opacity-90 hover:shadow-lg"}
              label={
                post.sendMessageUserIDs.includes(currentUser?.uid)
                  ? "メッセージ画面へ"
                  : "メッセージを送る"
              }
            />
          </a>
        </Link>
      )}
    </div>
  );
};

export default MessageButtonHandle;
