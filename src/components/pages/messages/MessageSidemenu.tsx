import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { FC } from "react";
import { Chatroom, Message, Post, User } from "../../../types/types";
import DealProgressButton from "./DealProgressButton";

type Props = {
  user: User;
  currentUser;
  post: Post;
  chatroom: Chatroom;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  messageReceiver: User;
};

const MessageSidemenu: FC<Props> = (props) => {
  const {
    user,
    currentUser,
    post,
    chatroom,
    messages,
    setMessages,
    messageReceiver,
  } = props;
  return (
    <div className="ml-4 hidden sm:block sm:w-1/4">
      <Link href={`/post/postShow/${post.postID}`}>
        <div className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80">
          <div className="pb-image w-full h-0 relative">
            <img
              src={post.images[0]}
              className="object-cover outline-none w-full h-full cursor-pointer absolute rounded-t-xl"
            />
          </div>
          <div className="p-2 text-sm text-gray-900">
            <div className="m-1 text-sm line-clamp-3">{post.title}</div>
            <div className="p-1"> {post.price}円</div>
          </div>
        </div>
      </Link>
      <DealProgressButton
        user={user}
        currentUser={currentUser}
        chatroom={chatroom}
        post={post}
        messages={messages}
        setMessages={setMessages}
        messageReceiver={messageReceiver}
      />
    </div>
  );
};

export default MessageSidemenu;
