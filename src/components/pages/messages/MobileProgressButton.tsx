import React from "react";

const MobileProgressButton = (props) => {
  const {
    currentUser,
    user,
    post,
    chatroom,
    messages,
    setMessages,
    messageReceiver,
    decideClient,
    completedDeal,
    interruptionDeal,
  } = props;
  return (
    <div className="absolute top-10 right-0 left-0 h-10 align-middle">
      {currentUser &&
        chatroom &&
        !post.clientUserID &&
        currentUser.uid === chatroom?.postUserID && (
          <div
            className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white"
            onClick={() => {
              decideClient(
                user,
                currentUser,
                post,
                chatroom,
                messages,
                setMessages,
                messageReceiver
              );
            }}
          >
            <p className="text-mainGreen font-semibold">取引者に決定</p>
          </div>
        )}
      {currentUser &&
        chatroom &&
        post.clientUserID &&
        post.isAvairable &&
        currentUser.uid === chatroom?.postUserID && (
          <div className="flex items-center bg-white">
            <div
              className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white w-3/5"
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
              className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center bg-white w-2/5"
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
          </div>
        )}
      {currentUser &&
        chatroom &&
        post.clientUserID &&
        !post.isAvairable &&
        currentUser.uid === chatroom?.postUserID && (
          <div className="rounded-xl p-2 text-center bg-white">
            <p className="text-mainGreen font-semibold">取引完了しました</p>
          </div>
        )}
    </div>
  );
};

export default MobileProgressButton;
