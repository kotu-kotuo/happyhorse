import React from "react";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { FC } from "react";
import Image from "next/image";

type Props = {
  notification;
  href: {
    pathname: string;
    query: { uid?: string; pid?: string; cid?: string };
  };
};

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

const Notification: FC<Props> = (props) => {
  const { notification, href } = props;
  return (
    <>
      {notification.noLink ? (
        <div className="flex mt-3 cursor-pointer hover:opacity-80">
          <div className="h-9 min-w-[36px] w-9 mr-2">
            <Image
              className="rounded"
              width={36}
              height={36}
              alt="avatar"
              objectFit="cover"
              src={notification.image || "/avatar(2).png"}
              loading="eager"
            />
          </div>
          <div>
            <div className="text-sm text-gray-900">{notification.text}</div>
            <div className="flex items-center text-xs text-gray-500 ">
              <FaRegClock className="ml-auto mr-0.5" />
              <div>{createdTime(notification)}</div>
            </div>
            <div className="border-b border-gray-100 mt-2"></div>
          </div>
        </div>
      ) : (
        <Link href={href}>
          <div className="flex mt-3 cursor-pointer hover:opacity-80">
            {!(notification.toMessage || notification.toProfile) ? (
              <div className="h-9 min-w-[36px] w-9 mr-2">
                <Image
                  className="rounded"
                  src={notification.image}
                  width={36}
                  height={36}
                  alt="post-image"
                  objectFit="cover"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="h-9 min-w-[36px] w-9 mr-2">
                <Image
                  className="rounded-full"
                  src={notification.avatar}
                  width={36}
                  height={36}
                  alt="post-image"
                  objectFit="cover"
                  loading="eager"
                />
              </div>
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
      )}
    </>
  );
};

export default Notification;
