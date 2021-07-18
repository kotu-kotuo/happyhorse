import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { db } from "../firebase/firebase";
import { IoChevronForwardOutline } from "react-icons/io5";
import { setPostStates } from "../utils/states";
import { useRouter } from "next/router";
import PasswordModal from "../components/pages/setting/PasswordModal";
import { NextPage } from "next";
import { postInitialValues } from "../utils/initialValues";
import { Post } from "../types/types";

const setting: NextPage = () => {
  const [myPosts, setMyPosts] = useState<Post[]>([postInitialValues]);
  const [duringDealingPosts, setDuringDealingPosts] = useState<Post[]>([
    postInitialValues,
  ]);
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .get()
        .then((snapshot) =>
          setMyPosts(snapshot.docs.map((doc) => setPostStates(doc.data())))
        );

      db.collectionGroup("posts")
        .where("clientUserID", "==", currentUser.uid)
        .where("ratingCompleted", "==", true)
        .get()
        .then((snapshot) =>
          setDuringDealingPosts(
            snapshot.docs.map((doc) => setPostStates(doc.data()))
          )
        );
    }
    // else {
    //   router.push("/login");
    // }
  }, [currentUser]);

  const deleteAccount = async () => {
    const filterResult = myPosts.filter(
      (post) => post.clientUserID && post.ratingCompleted === false
    );
    console.log(filterResult.length !== 0);
    console.log(duringDealingPosts.length !== 0);
    if (filterResult.length !== 0 || duringDealingPosts.length !== 0) {
      alert("取引の途中で退会はできません。");
      return;
    }
    const result = window.confirm(
      "本当に退会しますか？\n削除したユーザーデータは二度と復元することはできません。\n"
    );
    if (result) {
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Layout title="設定">
        {isModalOpen && (
          <div className="bg-gray-500 bg-opacity-70 z-30 fixed top-0 bottom-0 left-0 right-0">
            <div className="w-screen h-screen px-2">
              <div className="flex justify-center items-center bg-white px-2 py-8 mt-24 max-w-md mx-auto rounded-lg shadow-md ">
                {/* モーダルが開いてパスワードを入力するとデータ削除 */}
                <PasswordModal
                  setPassword={setPassword}
                  password={password}
                  currentUser={currentUser}
                  router={router}
                />
              </div>
            </div>
          </div>
        )}
        {currentUser && (
          <div className="max-w-2xl mx-auto mb-16 sm:mb-0">
            <h2 className="pageTitle">設定</h2>
            <ul className="mt-2 px-4">
              <li className="border-b cursor-pointer" onClick={deleteAccount}>
                <div className="px-4 py-4 hover:bg-gray-100 flex items-center">
                  <p className="font-medium text-red-600 leading-none">
                    退会する
                  </p>
                  <IoChevronForwardOutline className="text-red-600 text-lg ml-auto" />
                </div>
              </li>
            </ul>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default setting;
