import React from "react";

const isFirstOnDate = (messages) => {
  // const date = new Date().toLocaleDateString();
  // const messageDate = messages.map((message) =>
  //   new Date(message.createdAt?.seconds * 1000).toLocaleDateString()
  // );
  return !(
    messages &&
    messages
      .map(
        (message) =>
          new Date(message.createdAt?.seconds * 1000).toLocaleDateString()
      )
      .includes(new Date().toLocaleDateString())
  );
};

export default isFirstOnDate;
