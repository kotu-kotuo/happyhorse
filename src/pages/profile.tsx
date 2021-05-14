import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { db } from "../utils/firebase";
import ProfileContent from "../components/organisms/ProfileContent";

const Profile = () => {
  const { currentUser, user } = useContext(AuthContext);

  const router = useRouter();
  const [queryUser, setQueryUser]: any = useState({
    id: "",
    username: "",
    avatar: "",
    cover: "",
    profileText: "",
    likePostIDs: [],
    good: null,
    bad: null,
  });
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
      {console.log(router.query.uid)}
      <div>
        {currentUser && router.query.uid && queryUser && (
          <div>
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
