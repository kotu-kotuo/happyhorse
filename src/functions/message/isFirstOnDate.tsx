import { Message } from "../../types/types";

const isFirstOnDate = (messages:Message[]) => {
  return !(
    messages &&
    messages
      .map((message) =>
        new Date(message.createdAt?.seconds * 1000).toLocaleDateString()
      )
      .includes(new Date().toLocaleDateString())
  );
};

export default isFirstOnDate;
