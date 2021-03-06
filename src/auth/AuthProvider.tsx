import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebase/firebase";
import { Notification, User } from "../types/types";
import { setNotificationStates, setUserState } from "../utils/states";
import firebase from "firebase/app";

type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  setCurrentUser: any;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
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
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >(undefined);
  const [user, setUser] = useState<User>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if (user) {
        db.collection("users")
          .doc(`${user.uid}`)
          .get()
          .then((snapshot) => {
            setUser(setUserState(snapshot.data()));
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
      }
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
