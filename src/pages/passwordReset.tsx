import { NextPage } from "next";
import React, { useState } from "react";
import { Layout } from "../components/organisms/Layout";
import { auth } from "../utils/firebase";

const passwordReset: NextPage = () => {
  const [email, setEmail] = useState("");
  const [handleDisplay, setHandleDisplay] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setHandleDisplay(true);
      })
      .catch(() => {
        alert("このメールアドレスで登録されているユーザーは存在しません。");
      });
  };
  return (
    <div>
      <Layout title="password-reset">
        <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <img
              className="mx-auto h-14 w-auto mt-10  sm:mt-24"
              src="/hh-face.png"
              alt="logo"
            />
            {handleDisplay === false ? (
              <>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Password Reset
                </h2>

                <form onSubmit={onSubmit}>
                  <div className="rounded-md shadow-sm -space-y-px mb-8">
                    <div>
                      <p className="text-xs text-gray-700 text-left mb-1">
                        パスワード再設定用のメールアドレス
                      </p>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="メールアドレス"
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      送信
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="text-gray-900 text-center">
                  ご入力されたメールアドレスにパスワード再設定用のメールをお送りしました。
                </p>
                <p className="text-gray-900 text-center">
                  そちらのメールからパスワードの再設定をお願いします。
                </p>
                <img src="/undraw_ice_cream_s2rh.svg" className="mt-10" />
              </>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default passwordReset;
