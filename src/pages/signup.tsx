import { useState } from "react";
import { Layout } from "../components/organisms/Layout";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/firebase";
import { filterInitialValues } from "../utils/initialValues";
import ButtonAuth from "../components/atoms/ButtonAuth";

const SignUp: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const createUser = async (e) => {
    e.preventDefault();
    if (username.length > 20) {
      alert("ユーザーネームは20字以内でお願いします");
      return;
    } else {
      try {
        await auth
          .createUserWithEmailAndPassword(email, password)
          .then(async (result) => {
            await db.collection("users").doc(`${result.user.uid}`).set({
              id: result.user.uid,
              username: username,
              avatar: "/avatar(2).png",
              cover: "/cover1.png",
              profileText: "",
              good: 0,
              bad: 0,
              likePostIDs: [],
              deletedAccount: false,
            });

            await db
              .collection("users")
              .doc(`${result.user.uid}`)
              .collection("filters")
              .doc(`${result.user.uid}`)
              .set({
                showOnlyAvailable: false,
                category: filterInitialValues.category,
                priceMin: filterInitialValues.priceMin,
                priceMax: filterInitialValues.priceMax,
                ageMin: filterInitialValues.ageMin,
                ageMax: filterInitialValues.ageMax,
                heightMin: filterInitialValues.heightMin,
                heightMax: filterInitialValues.heightMax,
                breed: filterInitialValues.breed,
                gender: filterInitialValues.gender,
                color: filterInitialValues.color,
                area: filterInitialValues.area,
                feature: filterInitialValues.features,
              });

            router.push("/");
          })
          .catch((error) => {
            alert(error.message);
          });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <Layout title="新規登録">
      <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 　">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-14 w-auto sm:mt-28"
              src="/hh-face.png"
              alt="logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign Up
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={createUser}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  ユーザーネーム(20字以内)
                </div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="off"
                  required
                  className="inputText rounded-md"
                  placeholder="ユーザーネーム"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  メールアドレス / パスワード
                </div>
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
              <button type="submit" className="block w-full">
                <ButtonAuth label={"新規登録する"} />
              </button>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-xs">
                <Link href="/login">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    ログインはこちら
                  </a>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {console.log(process.env.FIREBASE_PROJECT_ID)}
    </Layout>
  );
};

export default SignUp;
