import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { db } from "../src/utils/firebase";
import { useRouter } from "next/router";

interface POST {
  postID: string;
  userID: string;
  username: string;
  avatar: string;
  images: Array<string>;
  title: string;
  price: string;
  createdAt: any;
  updatedAt: string;
  likeUserIDs: Array<string>;
  isAvairable: boolean;
  pv: number;
}

const myPostList = () => {
  const router = useRouter();
  const { currentUser, user } = useContext(AuthContext);

  const [posts, setPosts] = useState<POST[]>([
    {
      postID: "",
      userID: "",
      username: "",
      avatar: "",
      images: [],
      title: "",
      price: "",
      createdAt: "",
      updatedAt: "",
      likeUserIDs: [],
      isAvairable: null,
      pv: null,
    },
  ]);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => ({
              postID: doc.data().postID,
              userID: doc.data().userID,
              username: doc.data().username,
              avatar: doc.data().avatar,
              images: doc.data().images,
              title: doc.data().title,
              price: doc.data().price,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              likeUserIDs: doc.data().likeUserIDs,
              isAvairable: doc.data().isAvairable,
              pv: doc.data().pv,
            }))
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
          {posts.map((post, index) => (
            <>
              <div key={index} className="w-1/3 p-6">
                <Link href={`${post.postID}`}>
                  <div className="shadow-md border border-gray-50 rounded-xl cursor-pointer hover:opacity-80">
                    <div className="pb-image w-full h-0 relative">
                      <img
                        src={post.images[0]}
                        className="object-cover outline-none w-full h-full cursor-pointer absolute rounded-t-xl"
                      />
                    </div>
                    <div className="p-2 text-sm text-gray-900">
                      <div className="p-1">{post.title}</div>
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
