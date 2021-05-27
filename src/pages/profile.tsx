import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { db } from "../utils/firebase";
import ProfileContent from "../components/organisms/ProfileContent";

const Profile = () => {
  const { currentUser, user } = useContext(AuthContext);

  const router = useRouter();
  const [queryUser, setQueryUser] = useState(null);
  useEffect(() => {
    if (router.query.uid) {
      db.collection("users")
        .doc(`${router.query.uid}`)
        .get()
        .then((snapshot) => setQueryUser(snapshot.data()));
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
      </div>
    </Layout>
  );
};

export default Profile;
