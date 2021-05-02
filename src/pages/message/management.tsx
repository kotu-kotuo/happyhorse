import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import Link from "next/link";
import { db } from "../../utils/firebase";
import SwitchMessages from "../../components/molecules/SwitchMessages";



const management = () => {
  
  return (
    <Layout title="management">
      <div className="mt-16">

      <SwitchMessages />
      </div>
    </Layout>
  );
};

export default management;
