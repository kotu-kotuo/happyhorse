import React from "react";

const SwitchMessages = () => {
  return (
    <>
      <h2 className="text-center mt-10 mb-10 text-xl text-gray-900">
        メッセージ管理
      </h2>
      <div className="message-switch flex justify-around w-680 mx-auto text-center items-center">
        <input type="radio" name="switch" id="myPost" defaultChecked={true} />
        <label htmlFor="myPost" className="rounded-l-md cursor-pointer">
          自分の投稿
        </label>
        <input type="radio" name="switch" id="sendMessagePost" />
        <label
          htmlFor="sendMessagePost"
          className="rounded-r-md cursor-pointer"
        >
          メッセージを送った投稿
        </label>
      </div>
    </>
  );
};

export default SwitchMessages;
