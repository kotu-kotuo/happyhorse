import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";
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

const MyMessage: FC<Props> = (props) => {
  const { message, setIsOpenModal, isOpenModal, imageSrc, setImageSrc } = props;

  //時間をUNIXから変換
  const createdMessageTime = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {message.firstOnDate && (
        <div className="text-center mx-auto text-gray-600 text-xs border-b border-gray-600 w-28 my-8 sm:text-sm sm:py-0.5 sm:my-5 sm:w-36 sm:rounded-full sm:border">
          {createdTime(message.createdAt)}
        </div>
      )}
      <div className="flex w-full max-w-2xl ml-auto justify-end p-0 sm:p-4 my-4 sm:mt-2">
        <div className="flex">
          <p className="text-xs text-gray-500 leading-none whitespace-nowrap mt-auto mr-1 sm:mr-2">
            {createdMessageTime(message)}
          </p>
          <div>
            <p className="text-gray-500 text-xs ml-auto text-right hidden sm:inline-block">
              {message.username}
            </p>
            {message.image === "" ? (
              <div className="bg-mainGreen text-white px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-l-lg rounded-br-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {message.messageText}
                </p>
              </div>
            ) : (
              <>
                <img
                  src={message.image}
                  className="block max-h-80 rounded-lg cursor-pointer"
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
        </div>
        {message.deletedAccount === true ? (
          <img
            src={message.avatar}
            className="h-8 w-8 min-w-[32px] rounded-full bg-gray-300 ml-1.5 object-cover sm:h-10 sm:w-10 sm:min-w-[40px] sm:ml-3"
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
              className="h-8 w-8 min-w-[32px] rounded-full bg-gray-300 ml-1.5 object-cover cursor-pointer hover:opacity-80 sm:h-10 sm:w-10 sm:min-w-[40px] sm:ml-3"
            />
          </Link>
        )}
      </div>
    </>
  );
};

export default MyMessage;
