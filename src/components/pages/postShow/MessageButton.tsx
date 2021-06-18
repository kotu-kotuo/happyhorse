import { BsChatDots } from "react-icons/bs";

const MessageButton = (props) => {
  const { bgStyle, label } = props;
  return (
    <>
      <button type="button" className={`button-round ${bgStyle}`}>
        {label}
      </button>
      <div className="md:hidden inline-block text-center cursor-pointer">
        <div className={`inline-block rounded-full p-2 shadow-md ${bgStyle}`}>
          <BsChatDots className="text-2xl text-white" />
        </div>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </>
  );
};

export default MessageButton;
