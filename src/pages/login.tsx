import React, { useState } from "react";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase";
import { NextPage } from "next";
import ButtonAuth from "../components/atoms/ButtonAuth";

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout title="ログイン | happy horse">
      <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-14 w-auto sm:mt-28"
              src="/hh-face.png"
              alt="logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={login}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="inputText rounded-t-md"
                  placeholder="メールアドレス"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="inputText rounded-b-md"
                  placeholder="パスワード"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full block">
                <ButtonAuth label={"ログインする"} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/passwordReset">
                <div className="font-medium text-indigo-600 hover:text-indigo-500 text-xs cursor-pointer">
                  パスワードを忘れた場合
                </div>
              </Link>

              <Link href="/signup">
                <a className="font-medium text-xs text-indigo-600 hover:text-indigo-500">
                  新規登録はこちら
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
