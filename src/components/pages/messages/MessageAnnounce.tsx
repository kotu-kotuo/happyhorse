import { FC } from "react";

type Props = {
  value: string;
};

const MessageAnnounce: FC<Props> = (props) => {
  const { value } = props;
  return (
    <div className="fontSize-base font-bold sm:font-semibold text-center text-gray-500 border-gray-200 border-b-2 border-t-2 my-6 py-2">
      {value}
    </div>
  );
};

export default MessageAnnounce;
