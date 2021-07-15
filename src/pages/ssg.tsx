import { Layout } from "../components/organisms/Layout";
import React from "react";
import admin from "../firebase/admin";
import { User } from "../types/types";

const Ssg = ({ users }) => {
  return (
    <Layout title="エスエスじー">
      {users && users.map((user) => <div>{user.username}</div>)}
    </Layout>
  );
};

export default Ssg;

export async function getStaticProps() {
  const db = admin.firestore();

  const users: FirebaseFirestore.DocumentData[] = (
    await db.collection("users").get()
  ).docs.map((doc) => doc.data());

  return {
    props: {
      users,
    },
  };
}
