import firebase from "firebase/app";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";

type AuthContextProps = {
  currentUser: any | null | undefined;
  setCurrentUser: any;
  user: any;
  setUser: any;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  setCurrentUser: undefined,
  user: undefined,
  setUser: undefined,
});

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null | undefined>(
    undefined
  );
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      db.collection("users").doc(`${user.uid}`).get().then(snapshot => {
        console.log(snapshot.data())
        setUser(snapshot.data())
      })
    });

  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, currentUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
