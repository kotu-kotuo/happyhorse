import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { initTestHelpers, getPage } from "next-page-tester";
import "setimmediate";

initTestHelpers();

jest.mock("next/router", () => require("next-router-mock"));

describe("SignUp", () => {
  it("Should pass user login", async () => {
    const { page } = await getPage({
      route: "/signup",
    });
    render(page);

    expect(await screen.findByText("Sign Up")).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText("ユーザーネーム"), "エミリア");
    userEvent.type(
      screen.getByPlaceholderText("メールアドレス"),
      "test1@gmail.com"
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    expect(await screen.getByPlaceholderText("ユーザーネーム")).toHaveValue(
      "エミリア"
    );
    expect(await screen.getByPlaceholderText("メールアドレス")).toHaveValue(
      "test1@gmail.com"
    );
    expect(await screen.getByPlaceholderText("パスワード")).toHaveValue(
      "password"
    );
    userEvent.click(screen.getByText("新規登録する"));
  });
});
