import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import {Post} from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";

const myPostList = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([postInitialValues]);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => (setPostStates(doc.data())))
          );
        });
    }
  }, [currentUser]);

  const createdTime = (post) => {
    const time = new Date(post.createdAt.seconds * 1000);
    return time.toLocaleDateString();
  };

  return (
    <div>
      <Layout title="myPostList">
        <h2 className="text-center mt-16 mb-2 text-xl text-gray-900">
          掲載した馬
        </h2>
        <div className="flex flex-wrap">
          {posts && posts.map((post, index) => (
            <>
              <div key={index} className="w-1/3 p-6">
                <Link href={`postShow/${post.postID}`}>
                  <div className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80">
                    <div className="pb-image w-full h-0 relative">
                      <img
                        src={post.images[0]}
                        className="object-cover outline-none w-full h-full cursor-pointer absolute rounded-t-xl"
                      />
                    </div>
                    <div className="p-2 text-sm text-gray-900">
                      <div className="m-1 myPostTitle">{post.title}</div>
                      <div className="p-1"> {post.price}円</div>
                      <div className="p-1">{createdTime(post)}</div>
                    </div>
                  </div>
                </Link>
              </div>
            </>
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default myPostList;