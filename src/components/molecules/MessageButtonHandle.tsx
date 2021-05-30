import Link from "next/link";
import MessageButton from "../atoms/MessageButton";

const MessageButtonHandle = (props) => {
  const { currentUser, post } = props;
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
          <MessageButton
            bgStyle={" bg-mainGreen hover:opacity-90 hover:shadow-lg"}
            label={"メッセージ管理"}
          />
        </Link>
      ) : post.deletedAccount === true ? (
        <div></div>
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
          <MessageButton
            bgStyle={" bg-mainGreen hover:opacity-90 hover:shadow-lg"}
            label={
              post.sendMessageUserIDs.includes(currentUser?.uid)
                ? "メッセージ画面へ"
                : "メッセージを送る"
            }
          />
        </Link>
      )}
    </div>
  );
};

export default MessageButtonHandle;
