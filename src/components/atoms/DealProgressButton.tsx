import React from 'react'

const DealProgressButton = (props) => {
  const {currentUser,chatroom,post, decideClient, completedDeal,interruptionDeal} = props;
  return (
    <div>
      {currentUser &&
        chatroom &&
        !post.clientUserID &&
        currentUser.uid === chatroom?.postUserID && (
          <div
            className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
            onClick={decideClient}
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
              onClick={completedDeal}
            >
              <p className="mt-1 text-mainGreen font-semibold">
                取引を完了する
              </p>
            </div>
            <div
              className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80 p-2 text-center mt-3"
              onClick={interruptionDeal}
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
}

export default DealProgressButton
