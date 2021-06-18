import { IoChevronBack } from "react-icons/io5";

const MobileMessageHeader = (props) => {
  const { messageReceiver, router } = props;
  return (
    <div className="absolute top-0 right-0 left-0">
      <div className="flex items-center bg-white h-10 align-middle border-b border-gray-500">
        <IoChevronBack
          className="text-2xl text-gray-500 ml-2 mr-3 cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <div className="text-sm text-gray-900 line-clamp-1">
          {messageReceiver?.username}
        </div>
      </div>
    </div>
  );
};

export default MobileMessageHeader;
