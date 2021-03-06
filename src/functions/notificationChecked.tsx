import { Dispatch, SetStateAction } from "react";
import { db } from "../firebase/firebase";
import { Notification } from "../types/types";
import { setNotificationStates } from "../utils/states";

const notificationChecked = async (
  currentUser: any,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  if (!currentUser) return;

  await db
    .collection("users")
    .doc(`${currentUser.uid}`)
    .collection("notifications")
    .where("checked", "==", false)
    .get()
    .then(
      async (snapshot) =>
        await Promise.all(
          snapshot.docs.map((doc) =>
            db
              .collection("users")
              .doc(`${currentUser.uid}`)
              .collection("notifications")
              .doc(doc.id)
              .update({
                checked: true,
              })
          )
        )
    );
  await db
    .collection("users")
    .doc(`${currentUser.uid}`)
    .collection("notifications")
    .orderBy("createdAt", "desc")
    .limit(30)
    .get()
    .then(async (snapshot) =>
      setNotifications(
        await Promise.all(
          snapshot.docs.map((doc) => setNotificationStates(doc.data()))
        )
      )
    );
};

export default notificationChecked;
