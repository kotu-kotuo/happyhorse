import Link from "next/link";
import createdTime from "../../../functions/createdTime";
import ImageModal from "./ImageModal";

const MyMessage = (props) => {
  const { message, setIsOpenModal, isOpenModal, imageSrc, setImageSrc } = props;

  //時間をUNIXから変換
  const createdMessageTime = (message) => {
    const time = new Date(message?.createdAt?.seconds * 1000);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {message.firstOnDate && (
        <div className="text-center mx-auto text-gray-600 text-xs border border-gray-600 rounded-full w-36 my-5 sm:text-sm sm:py-0.5">
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
        </div>
        {message.deletedAccount === true ? (
          <img
            src={message.avatar}
            className="h-8 w-8 rounded-full bg-gray-300 ml-3 object-cover sm:h-10 sm:w-10"
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
              className="h-8 w-8 rounded-full bg-gray-300 ml-3 object-cover cursor-pointer hover:opacity-80 sm:h-10 sm:w-10"
            />
          </Link>
        )}
      </div>
    </>
  );
};

export default MyMessage;
