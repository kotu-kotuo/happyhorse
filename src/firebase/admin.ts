import * as admin from "firebase-admin";

if (
  process.env.NODE_ENV === "production" &&
  process.env.FIREBASE_PROJECT_ID === "happyhorse-prod"
) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_PROD,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_PROD,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_PROD?.replace(/\\n/g, "\n"),
      }),
    });
  }
} else {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_DEV,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_DEV,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_DEV?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export default admin;
