import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { db } from "../../firebase/firebase";
import { Post } from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import { NextPage } from "next";
import PostListItem from "../../components/molecules/PostListItem";
import useRedirectLogin from "../../hooks/useRedirectLogin";

const myLikePosts: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([postInitialValues]);

  useRedirectLogin(currentUser);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("likePosts")
        .orderBy("likedAt", "desc")
        .get()
        .then((snapshot) => {
          setPosts(snapshot.docs.map((doc) => setPostStates(doc.data())));
        });
    }
  }, [currentUser]);

  return (
    <div>
      <Layout title="お気に入りの馬 | happy horse" index="noindex">
        {currentUser && (
          <>
            <h2 className="pageTitle">お気に入りの馬</h2>
            <div className="mb-10">
              {posts[0]?.postID !== "" &&
                posts.map((post, index) => (
                  <div key={index}>
                    <PostListItem post={post} />
                  </div>
                ))}
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default myLikePosts;
