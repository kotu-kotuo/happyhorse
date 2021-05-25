import firebase from "firebase/app";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { setNotificationStates } from "../utils/states";

type AuthContextProps = {
  currentUser: any | null | undefined;
  setCurrentUser: any;
  user: any;
  setUser: any;
  notifications: any;
  setNotifications: any;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  setCurrentUser: undefined,
  user: undefined,
  setUser: undefined,
  notifications: undefined,
  setNotifications: undefined,
});

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null | undefined>(
    undefined
  );
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) return;

      setCurrentUser(user);

      db.collection("users")
        .doc(`${user.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      db.collection("users")
        .doc(`${user.uid}`)
        .collection("notifications")
        .orderBy("createdAt", "desc")
        .limit(30)
        .get()
        .then(async (snapshot) => {
          if (!snapshot.docs) return;
          setNotifications(
            snapshot.docs.map((doc) => setNotificationStates(doc.data()))
          );
        });
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        currentUser,
        setCurrentUser,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
