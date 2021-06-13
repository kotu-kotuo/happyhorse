import React from "react";
import completedDeal from "../../functions/message/completedDeal";
import decideClient from "../../functions/message/decideClient";
import interruptionDeal from "../../functions/message/interruptionDeal";

const DealProgressButton = (props) => {
  const {
    user,
    currentUser,
    chatroom,
    post,
    messages,
    setMessages,
    messageReceiver,
  } = props;
  return (
    <div>
      {currentUser &&
        chatroom &&
        !post.clientUserID &&
        currentUser.uid === chatroom?.postUserID && (
          <div
            className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
            onClick={() =>
              decideClient(
                user,
                currentUser,
                post,
                chatroom,
                messages,
                setMessages,
                messageReceiver
              )
            }
          >
            <p className="mt-1 text-mainGreen font-semibold">取引者に決定</p>
          </div>
        )}
      {currentUser &&
        chatroom &&
        post.clientUserID &&
        post.isAvairable &&
        currentUser.uid === chatroom?.postUserID && (
          <>
            <div
              className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
              onClick={() => {
                completedDeal(
                  post,
                  chatroom,
                  user,
                  currentUser,
                  messageReceiver,
                  messages,
                  setMessages
                );
              }}
            >
              <p className="mt-1 text-mainGreen font-semibold">
                取引を完了する
              </p>
            </div>
            <div
              className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
              onClick={() => {
                interruptionDeal(
                  post,
                  chatroom,
                  user,
                  currentUser,
                  messageReceiver,
                  messages,
                  setMessages
                );
              }}
            >
              <p className="mt-1 text-gray-300 font-semibold">取引を中断する</p>
            </div>
          </>
        )}
      {currentUser &&
        chatroom &&
        post.clientUserID &&
        !post.isAvairable &&
        currentUser.uid === chatroom?.postUserID && (
          <div className="rounded-xl p-2 text-center mt-3">
            <p className="mt-1 text-mainGreen font-semibold">
              取引完了しました
            </p>
          </div>
        )}
    </div>
  );
};

export default DealProgressButton;
