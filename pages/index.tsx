import Head from "next/head";
import { Layout } from "../components/Layout";

export default function Home() {
  return (
    <div>
      <Layout title="index">
        <h1 className="font-black text-5xl text-green-600">hello!!</h1>


      </Layout>
    </div>
  );
}
