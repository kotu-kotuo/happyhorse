import React from "react";

const SwitchMessages = (props) => {
  return (
    <>
      <h2 className="text-center mt-10 mb-10 text-xl text-gray-900">
        メッセージ管理
      </h2>
      <div className="message-switch flex justify-around max-w-2xl mx-auto text-center items-center">
        <input type="radio" name="switch" id="myPost" defaultChecked={true} />
        <label
          htmlFor="myPost"
          className="rounded-l-md cursor-pointer"
          onClick={() => {
            props.setIsMyPostsBlockHidden(false);
            props.setIsSendHidden(true);
          }}
        >
          自分の投稿
        </label>
        <input type="radio" name="switch" id="sendMessagePost" />
        <label
          htmlFor="sendMessagePost"
          className="rounded-r-md cursor-pointer"
          onClick={() => {
            props.setIsMyPostsBlockHidden(true);
            props.setIsSendHidden(false);
          }}
        >
          メッセージを送った投稿
        </label>
      </div>
    </>
  );
};

export default SwitchMessages;
