import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import { Post } from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import image from "next/image";
import { PageTitle } from "../../components/atoms/Atoms";

const draftList = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([postInitialValues]);
  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setPosts(snapshot.docs.map((doc) => setPostStates(doc.data())));
        });
    }
  }, [currentUser]);
  //時間をUNIXから変換
  const createdTime = (postTime) => {
    const time = new Date(postTime?.seconds * 1000);
    return time.toLocaleDateString();
  };
  return (
    <div>
      <Layout title="draftList">
        <div className="pageTitle">下書き保存リスト</div>
        {currentUser &&
          posts &&
          posts.map((post,index) => (
            <Link
              href={{
                pathname: "/post/draft",
                query: {
                  pid: post.postID,
                },
              }}
              key={index}
            >
              <div className="max-w-xl mx-auto">
                <div className="mx-2 my-6 rounded-md shadow border-gray-500 cursor-pointer">
                  <div className="flex">
                    <div>
                      {post.images.length !== 0 ? (
                        <img
                          src={post.images[0]}
                          className="h-14 w-14 rounded-l-md mr-3 block object-cover md:h-16 md:w-28"
                        />
                      ) : (
                        <img
                          src="/no-image.png"
                          className="h-14 w-14 rounded-l-md mr-3 block object-cover md:h-16 md:w-28"
                        />
                      )}
                    </div>
                    <div className="px-3 py-1 max-w-3xl w-full">
                      <div className="text-gray-900 mr-2 line-clamp-1 mt-0.5 md:mt-1">
                        {post.title}
                      </div>
                      <div className="text-gray-500 text-xs mt-1 md:mt-2">
                        {createdTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </Layout>
    </div>
  );
};

export default draftList;
