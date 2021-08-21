export const firebaseConfig = ((
  nodeEnv: string,
  projectId: string | undefined
) => {
  if (nodeEnv === "production" && projectId === "happyhorse-prod") {
    return {
      databeseURL: "https://happyhorse-prod.firebaseio.com",
      apiKey: "AIzaSyD0qa_ViUcEA1qCGBayDMBlhDqFkRLbaIM",
      authDomain: "happyhorse-prod.firebaseapp.com",
      projectId: "happyhorse-prod",
      storageBucket: "happyhorse-prod.appspot.com",
      messagingSenderId: "923894700791",
      appId: "1:923894700791:web:6717e42bf599513df611f2",
      measurementId: "G-WEQ4KX4Y8C",
    };
  } else {
    return {
      databeseURL: "https://happyhorse-bc5f6.firebaseio.com",
      apiKey: "AIzaSyALVUSMrSXBQClXbPvzk87yEkAH9GdhNNg",
      authDomain: "happyhorse-bc5f6.firebaseapp.com",
      projectId: "happyhorse-bc5f6",
      storageBucket: "happyhorse-bc5f6.appspot.com",
      messagingSenderId: "362079704601",
      appId: "1:362079704601:web:dfa9135a9d83bb38db3c88",
    };
  }
})(process.env.NODE_ENV, process.env.FIREBASE_PROJECT_ID);
