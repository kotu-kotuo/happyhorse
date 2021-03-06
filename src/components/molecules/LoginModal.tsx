import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { FC } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import Image from "next/image";

type Props = {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
};

const LoginModal: FC<Props> = (props) => {
  const { isLoginModalOpen, setIsLoginModalOpen } = props;
  return (
    <div>
      {isLoginModalOpen && (
        <div
          className="bg-gray-500 bg-opacity-70 z-30 fixed inset-0"
          onClick={() => {
            setIsLoginModalOpen(false);
          }}
        >
          <div className="w-screen h-screen px-2">
            <div
              className="bg-white px-2 py-8 mt-24 max-w-md mx-auto rounded-lg shadow-md relative md:mt-40 lg:mt-60 md:px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-2 -right-2">
                <RiCloseCircleFill
                  className="text-gray-300 text-4xl cursor-pointer"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                  }}
                />
              </div>
              <div className="h-20 w-20 mx-auto mb-6">
                <Image
                  src="/hh-face.png"
                  width={80}
                  height={80}
                  alt="logo-face"
                />
              </div>
              <p className="text-gray-900 text-sm text-center mb-6">
                ログインまたは新規登録をお願いします。
              </p>
              <div>
                <div className="flex items-center justify-between">
                  <Link href="/login">
                    <button className="postFormMainButton mr-1 md:mr-2">
                      ログイン
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="postFormMainButton ml-1 md:ml-2">
                      新規登録
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
