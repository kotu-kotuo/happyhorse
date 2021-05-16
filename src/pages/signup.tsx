import { useState } from "react";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import { filterInitialValues } from "../utils/initialValues";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

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
              avatar: "/avatar.png",
              cover: "/cover1.jpg",
              profileText: "",
              good: 0,
              bad: 0,
              likePostIDs: [],
            });

            await db
              .collection("users")
              .doc(`${result.user.uid}`)
              .collection("filters")
              .doc(`${result.user.uid}`)
              .set({
                category: filterInitialValues.category,
                priceMin: filterInitialValues.priceMin,
                priceMax: filterInitialValues.priceMax,
                ageMin: filterInitialValues.ageMin,
                ageMax: filterInitialValues.ageMax,
                heightMin: filterInitialValues.heightMin,
                heightMax: filterInitialValues.heightMax,
                breed: filterInitialValues.breed,
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
    <Layout title="signup">
      {console.log(username.length)}
      <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 　">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-14 w-auto mt-10  sm:mt-32"
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
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="ユーザーネーム"
                  onChange={(e) => setUsername(e.target.value)}
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                  onChange={(e) => setPassword(e.target.value)}
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
                新規登録する
              </button>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm">
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
    </Layout>
  );
};

export default SignUp;