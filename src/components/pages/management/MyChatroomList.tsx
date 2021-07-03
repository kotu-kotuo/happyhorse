import Link from "next/link";
import React, { FC, SetStateAction } from "react";
import { Dispatch } from "react";
import createdTime from "../../../functions/createdTime";
import { Chatroom, Review } from "../../../types/types";

type Props = {
  myPostChatrooms: Chatroom[];
  clickPid: string;
  reviewsOnHold: Review[];
  setIsMyPostsHidden: Dispatch<SetStateAction<boolean>>;
  setIsMyPostChatroomsHidden: Dispatch<SetStateAction<boolean>>;
};

const MyChatroomList: FC<Props> = (props) => {
  const {
    myPostChatrooms,
    clickPid,
    reviewsOnHold,
    setIsMyPostsHidden,
    setIsMyPostChatroomsHidden,
  } = props;

  return (
    <div>
      {myPostChatrooms
        .filter((element) => clickPid === element.postID)
        .map((myPostChatroom, index) => (
          <div key={index}>
            <Link
              href={{
                pathname: "/message/messages",
                query: {
                  uid: myPostChatroom.postUserID,
                  pid: myPostChatroom.postID,
                  cid: myPostChatroom.sendUserID,
                },
              }}
            >
              <div className="mx-2 my-3 rounded-r-md rounded-l-full shadow border-gray-500 cursor-pointer sm:my-6">
                <div className="flex">
                  <div>
                    {myPostChatroom.deletedAccount === true ? (
                      <img
                        src={myPostChatroom.sendUserAvatar}
                        className="h-12 w-12 rounded-full mr-3 block object-cover hover:opacity-80 sm:h-16 sm:w-16"
                      />
                    ) : (
                      <Link
                        href={{
                          pathname: "/profile",
                          query: {
                            uid: myPostChatroom.sendUserID,
                          },
                        }}
                      >
                        <img
                          src={myPostChatroom.sendUserAvatar}
                          className="h-12 w-12 rounded-full mr-3 block object-cover hover:opacity-80 sm:h-16 sm:w-16"
                        />
                      </Link>
                    )}
                  </div>
                  <div className="px-3 py-1 max-w-3xl w-full">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="fontSize-base text-gray-900 line-clamp-1 sm:mr-2">
                          {myPostChatroom.sendUserName}
                        </div>
                        <div className="text-gray-500 text-xs ml-1 mr-1">{`(${myPostChatroom.messageCount})`}</div>
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {createdTime(myPostChatroom.messageUpdatedAt)}
                      </div>
                    </div>
                    <p className="fontSize-sm text-gray-500 mt-1 line-clamp-1 sm:mt-2">
                      {myPostChatroom.latestMessage === "評価をお願いします" &&
                      reviewsOnHold.filter(
                        (review) =>
                          review.reviewerID === myPostChatroom.postUserID
                      ).length !== 0 &&
                      reviewsOnHold.filter(
                        (review) => review.postID === myPostChatroom.postID
                      ).length !== 0
                        ? "評価完了しました"
                        : myPostChatroom.latestMessage}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      <div
        onClick={() => {
          setIsMyPostsHidden(false), setIsMyPostChatroomsHidden(true);
        }}
        className="text-gray-900 border-b border-gray-900 ml-12 w-20 cursor-pointer"
      >
        戻る
      </div>
    </div>
  );
};

export default MyChatroomList;
