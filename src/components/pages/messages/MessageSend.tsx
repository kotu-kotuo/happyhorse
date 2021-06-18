import React from "react";
import sendMessage from "../../../functions/message/sendMessage";
import TextareaAutosize from "react-textarea-autosize";
import { BsFillImageFill } from "react-icons/bs";
import sendImage from "../../../functions/message/sendImage";
import { IoSend } from "react-icons/io5";

const MessageSend = (props) => {
  const {
    currentUser,
    user,
    post,
    messages,
    setMessages,
    messageText,
    setMessageText,
    messageReceiver,
    chatroom,
    setChatroom,
  } = props;
  return (
    <form
      onSubmit={(e) => {
        sendMessage(
          e,
          currentUser,
          user,
          post,
          messages,
          setMessages,
          messageText,
          setMessageText,
          messageReceiver,
          chatroom,
          setChatroom
        );
      }}
    >
      <div className="relative z-20">
        <div className="absolute bottom-0 w-full">
          <div className="bg-gray-300 p-1 flex items-center sm:rounded-b-lg sm:p-2">
            <div className="relative w-full z-20">
              <TextareaAutosize
                maxRows={5}
                className="flex items-center h-10 w-full rounded pl-3 pr-8 text-sm resize-none focus:outline-none focus:border-subBlue z-20"
                placeholder="Type your message…"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setMessageText(e.target.value);
                }}
                value={messageText}
              />
              <label htmlFor="image">
                <BsFillImageFill className="text-lg text-gray-500 opacity-70 absolute bottom-2.5 right-3 z-20 cursor-pointer hover:opacity-100" />
              </label>
              <input
                id="image"
                type="file"
                className="hidden"
                onChange={(e) => {
                  sendImage(
                    e,
                    currentUser,
                    user,
                    post,
                    messages,
                    setMessages,
                    messageReceiver,
                    chatroom,
                    setChatroom
                  );
                }}
              />
            </div>
            <button
              type="submit"
              className="w-9 h-9 bg-subBlue rounded-lg ml-1 mt-auto cursor-pointer z-20 hover:opacity-90 align-middle mb-sendButton sm:h-10 sm:w-10 sm:mb-0"
              disabled={messageText === ""}
            >
              <IoSend className="text-white text-xl mx-auto sm:my-2.5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageSend;
