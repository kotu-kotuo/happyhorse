import { Layout } from "../components/organisms/Layout";
import React from "react";
import admin from "../firebase/admin";
import { NextPage } from "next";

const Ssg: NextPage = ({ users }: any) => {
  return (
    <Layout title="エスエスじー">
      {/* <div>{posts && posts.map((post) => <div>{post.id}</div>)}</div> */}
      {users && users.map((user) => <div>{user.username}</div>)}
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
      users,
    },
  };
}
