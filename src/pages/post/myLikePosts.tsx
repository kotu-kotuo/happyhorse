import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import { Post } from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import { PageTitle } from "../../components/atoms/Atoms";
import { FaRegHeart } from "react-icons/fa";

const myLikePosts = () => {
  const { currentUser, user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([postInitialValues]);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("likePosts")
        .orderBy("likedAt", "desc")
        .get()
        .then((snapshot) => {
          setPosts(
            snapshot.docs
              .map((doc) => setPostStates(doc.data()))
          );
        });
    }
  }, [currentUser]);

  return (
    <div>
      <Layout title="myPostList">
        <h2 className="pageTitle">お気に入りの馬</h2>
        {posts[0]?.postID !== "" &&
          posts.map((post, index) => (
            <div key={index} className="max-w-2xl mx-auto">
              <Link href={`postShow/${post.postID}`}>
                <div className="mx-2 my-4 rounded-md shadow border-gray-500">
                  <div className="flex">
                    <div>
                      <img
                        src={post.images[0]}
                        className="h-14 w-14 rounded-l-md mr-3 block object-cover sm:h-18 sm:w-28"
                      />
                    </div>
                    <div className="px-3 py-1 max-w-3xl w-full">
                      <div className="fontSize-base text-gray-900 mr-0.5 mt-1 mb-0 line-clamp-1 sm:mt-2 sm:mb-2">
                        {post.title}
                      </div>

                      <div className="flex justify-start items-center w-full">
                        <p className="fontSize-sm text-gray-500 mt-1 mb-1 line-clamp-1 sm:mt-0 sm:mb-0">
                          {`￥${post.price}`}
                        </p>
                        <div className="ml-5 mr-2 flex items-center">
                          <FaRegHeart className="text-gray-500 text-xs mr-1" />
                          <div className="text-gray-500 text-xs">
                            {post.likeUserIDs.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </Layout>
    </div>
  );
};

export default myLikePosts;
