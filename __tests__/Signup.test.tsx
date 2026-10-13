import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import "setimmediate";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("../src/firebase/firebase", () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: "test-uid" } })
    ),
  },
  db: {
    collection: () => ({
      doc: () => ({
        set: () => Promise.resolve(),
        collection: () => ({
          doc: () => ({ set: () => Promise.resolve() }),
        }),
      }),
    }),
  },
}));

import SignUp from "../src/pages/signup";

describe("SignUp", () => {
  it("Should pass user login", async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    expect(await screen.findByText("Sign Up")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("ユーザーネーム"), "エミリア");
    await user.type(
      screen.getByPlaceholderText("メールアドレス"),
      "test1@gmail.com"
    );
    await user.type(screen.getByPlaceholderText("パスワード"), "password");
    expect(await screen.getByPlaceholderText("ユーザーネーム")).toHaveValue(
      "エミリア"
    );
    expect(await screen.getByPlaceholderText("メールアドレス")).toHaveValue(
      "test1@gmail.com"
    );
    expect(await screen.getByPlaceholderText("パスワード")).toHaveValue(
      "password"
    );
    await user.click(screen.getByText("新規登録する"));
  });
});
