import Link from "next/link";
import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";

const LoginModal = (props) => {
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
              className="bg-white px-2 py-8 mt-24 max-w-md mx-auto rounded-lg shadow-md relative md:mt-40 lg:mt-60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-2 -right-2">
                <RiCloseCircleFill
                  className="text-gray-300 text-4xl"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                  }}
                />
              </div>
              <img src="/hh-face.png" className="h-20 w-20 mx-auto mb-6" />
              <p className="text-gray-900 text-sm text-center mb-6">
                ログインまたは新規登録をお願いします。
              </p>
              <div>
                <div className="flex items-center justify-between">
                  <Link href="/login">
                    <button className="postFormMainButton mr-1">
                      ログイン
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="postFormMainButton ml-1">
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
