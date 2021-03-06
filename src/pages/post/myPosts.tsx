import React, { useState, useContext, useLayoutEffect } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { db } from "../../firebase/firebase";
import { Post } from "../../types/types";
import { postInitialValues } from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import { NextPage } from "next";
import PostListItem from "../../components/molecules/PostListItem";
import { useRouter } from "next/router";
import useRedirectLogin from "../../hooks/useRedirectLogin";

const myPostList: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([postInitialValues]);
  const router = useRouter();

  useRedirectLogin(currentUser);

  useLayoutEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setPosts(snapshot.docs.map((doc) => setPostStates(doc.data())));
        });
    }
  }, [currentUser]);

  return (
    <div>
      <Layout title="掲載した馬 | happy horse" index="noindex">
        {currentUser && (
          <>
            <h2 className="pageTitle">掲載した馬</h2>
            <div className="mb-10">
              {posts?.length !== 0 &&
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

export default myPostList;
