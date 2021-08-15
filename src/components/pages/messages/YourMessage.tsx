import Link from "next/link";
import { SetStateAction } from "react";
import { FC } from "react";
import { Dispatch } from "react";
import createdTime from "../../../functions/createdTime";
import { Message } from "../../../types/types";
import ImageModal from "./ImageModal";

type Props = {
  message: Message;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  isOpenModal: boolean;
  imageSrc: string;
  setImageSrc: Dispatch<SetStateAction<string>>;
};

const YourMessage: FC<Props> = (props) => {
  const { message, setIsOpenModal, isOpenModal, imageSrc, setImageSrc } = props;

  //時間をUNIXから変換
  const createdMessageTime = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {message?.firstOnDate && (
        <div className="text-center mx-auto text-gray-600 text-sm border border-gray-600 rounded-full py-0.5 w-36">
          {createdTime(message?.createdAt)}
        </div>
      )}
      <div className="flex w-full space-x-3 max-w-2xl p-0  targetMessage sm:p-4 my-4 sm:mt-2">
        {/* プロフィールへのリンクの切り替え */}
        {message.deletedAccount === true ? (
          <img
            src={message.avatar}
            className="h-8 w-8 min-w-[32px] rounded-full ml-0 object-cover sm:h-10 sm:w-10 sm:ml-3 sm:min-w-[40px]"
          />
        ) : (
          <Link
            href={{
              pathname: "/profile",
              query: {
                uid: message.userID,
              },
            }}
          >
            <img
              src={message.avatar}
              className="h-8 w-8 min-w-[32px] rounded-full ml-0 object-cover cursor-pointer hover:opacity-80 sm:h-10 sm:w-10 sm:ml-3 sm:min-w-[40px]"
            />
          </Link>
        )}
        <div className="flex">
          <div>
            <p className="text-gray-500 text-xs mr-auto text-left hidden sm:inline-block">
              {message.username}
            </p>
            {message.image === "" ? (
              <div className="bg-gray-300 px-2.5 py-2 rounded-r-lg rounded-bl-lg sm:px-3 sm:py-2.5">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {message.messageText}
                </p>
              </div>
            ) : (
              <>
                <img
                  src={message.image}
                  className="block max-h-80 rounded-lg"
                  onClick={(e) => {
                    setIsOpenModal(true);
                    setImageSrc(e.currentTarget.getAttribute("data-src"));
                  }}
                  data-src={`${message.image}`}
                />
                {isOpenModal && message.image === imageSrc && (
                  <ImageModal
                    image={imageSrc}
                    setIsOpenModal={setIsOpenModal}
                  />
                )}
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-none mt-auto ml-1 sm:ml-2">
            {createdMessageTime(message)}
          </p>
        </div>
      </div>
    </>
  );
};

export default YourMessage;
