import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase";
import ProfileContent from "../components/pages/profile/ProfileContent";
import { NextPage } from "next";
import { userInitialValues } from "../utils/initialValues";
import { User } from "../types/types";
import { setUserState } from "../utils/states";

const Profile: NextPage = () => {
  const { currentUser, user } = useContext(AuthContext);
  const router = useRouter();
  const [queryUser, setQueryUser] = useState<User>(userInitialValues);
  useEffect(() => {
    if (router.query.uid) {
      db.collection("users")
        .doc(`${router.query.uid}`)
        .get()
        .then((snapshot) => setQueryUser(setUserState(snapshot.data())));
    }
  }, [router.query.uid]);
  return (
    <Layout title="profile">
      <div>
        {currentUser && router.query.uid && queryUser && (
          <div>
            {console.log(queryUser)}
            {console.log(user)}
            {currentUser.uid === router.query.uid ? (
              <ProfileContent user={user} currentUser={currentUser} />
            ) : (
              <ProfileContent user={queryUser} currentUser={currentUser} />
            )}
          </div>
        )}
        {!currentUser && <ProfileContent user={queryUser} currentUser={null} />}
      </div>
    </Layout>
  );
};

export default Profile;
