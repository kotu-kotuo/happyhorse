import { NextPage } from "next";
import React, { useState } from "react";
import ButtonAuth from "../components/atoms/ButtonAuth";
import { Layout } from "../components/organisms/Layout";
import { auth } from "../firebase/firebase";

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
      <Layout title="パスワード再設定">
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
                        className="inputText rounded-md"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="block w-full">
                      <ButtonAuth label={"送信する"} />
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
