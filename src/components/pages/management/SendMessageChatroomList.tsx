import Link from "next/link";
import React from "react";
import createdTime from "../../../functions/createdTime";

const SendMessageChatroomList = (props) => {
  const { sendMessageChatrooms, reviewsOnHold } = props;
  return (
    <div>
      {sendMessageChatrooms.map((sendMessageChatroom, index) => (
        <Link
          href={{
            pathname: "/message/messages",
            query: {
              uid: sendMessageChatroom.postUserID,
              pid: sendMessageChatroom.postID,
              cid: sendMessageChatroom.sendUserID,
            },
          }}
          key={index}
        >
          <div>
            <div className="mx-2 my-3 rounded-md shadow border-gray-500 cursor-pointer sm:my-6">
              <div className="flex">
                <div>
                  <img
                    src={sendMessageChatroom.postImage}
                    className="h-12 w-12 rounded-l-md mr-3 block object-cover sm:h-16 sm:w-28"
                  />
                </div>
                <div className="px-3 py-1 max-w-3xl w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="fontSize-base text-gray-900 line-clamp-1 sm:mr-2">
                        {sendMessageChatroom.postTitle}
                      </div>
                      <div className="text-gray-500 text-xs ml-1 mr-1">{`(${sendMessageChatroom.messageCount})`}</div>
                    </div>
                    <div className=" text-xs text-gray-500 mt-0.5">
                      {createdTime(sendMessageChatroom.messageUpdatedAt)}
                    </div>
                  </div>
                  <p className="fontSize-sm text-gray-500 line-clamp-1 mt-1 sm:mt-2">
                    {sendMessageChatroom.latestMessage ===
                      "評価をお願いします" &&
                    reviewsOnHold.filter(
                      (review) =>
                        review.reviewerID === sendMessageChatroom.sendUserID
                    ).length !== 0 &&
                    reviewsOnHold.filter(
                      (review) => review.postID === sendMessageChatroom.postID
                    ).length !== 0
                      ? "評価完了しました"
                      : sendMessageChatroom.latestMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SendMessageChatroomList;
