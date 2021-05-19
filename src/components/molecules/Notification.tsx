import React from "react";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";

//時間をUNIXから変換
const createdTime = (notification) => {
  if (notification) {
    const time = new Date(notification?.createdAt?.seconds * 1000);
    return time.toLocaleString([], {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const Notification = (props) => {
  const { notification, href } = props;
  return (
    <Link href={href}>
      <div className="flex mt-3 cursor-pointer hover:opacity-80">
        {!notification.toMessage && notification.toProfile ? (
          <img
            className="h-9 w-9 rounded object-cover mr-2"
            src={notification.image[0]}
          />
        ) : (
          <img
            className="h-9 w-9 rounded-full object-cover mr-2"
            src={notification.avatar}
          />
        )}

        <div>
          <div className="text-sm text-gray-900">{notification.text}</div>
          <div className="flex items-center text-xs text-gray-500 ">
            <FaRegClock className="ml-auto mr-0.5" />
            <div>{createdTime(notification)}</div>
          </div>
          <div className="border-b border-gray-100 mt-2"></div>
        </div>
      </div>
    </Link>
  );
};

export default Notification;
