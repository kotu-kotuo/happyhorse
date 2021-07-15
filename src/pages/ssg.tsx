import { Layout } from "../components/organisms/Layout";
import fetch from "node-fetch";
import React from "react";
import { db } from "../firebase/firebase";
import admin from "../firebase/admin";

const Ssg = ({ users }) => {
  return (
    <Layout title="エスエスじー">
      {/* <div>{posts && posts.map((post) => <div>{post.id}</div>)}</div> */}
      {users.map((user) => (
        <div>{user.username}</div>
      ))}
    </Layout>
  );
};

export default Ssg;

export async function getStaticProps() {
  // const res = await fetch(
  //   new URL("https://jsonplaceholder.typicode.com/posts")
  // );
  // const posts = await res.json();
  const db = admin.firestore();

  const users = (await db.collection("users").get()).docs.map((doc) =>
    doc.data()
  );

  return {
    props: {
      // posts,
      users,
    },
  };
}
