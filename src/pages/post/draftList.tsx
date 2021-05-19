import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import { Post } from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import image from "next/image";

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
        {currentUser &&
          posts &&
          posts.map((post) => (
            <Link
              href={{
                pathname: "/post/draft",
                query: {
                  pid: post.postID,
                },
              }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="mx-2 my-6 rounded-md shadow border-gray-500 cursor-pointer">
                  <div className="flex">
                    <div>
                      {post.images.length !== 0 ? (
                        <img
                          src={post.images[0]}
                          className="h-16 w-28 rounded-l-md mr-3 block object-cover"
                        />
                      ) : (
                        <img
                          src="/no-image.png"
                          className="h-16 w-28 rounded-l-md mr-3 block object-cover"
                        />
                      )}
                    </div>
                    <div className="px-3 py-1 max-w-3xl w-full">
                      <div className="flex">
                        <div className="text-gray-900 mr-2 whitespace-nowrap">
                          {post.title}
                        </div>
                        <div className="flex w-full">
                          <div className="text-right mt-auto ml-auto max-w-xl w-full">
                            <div className="text-gray-500 text-xs mt-auto ml-auto">
                              {createdTime(post.createdAt)}
                            </div>
                          </div>
                        </div>
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
