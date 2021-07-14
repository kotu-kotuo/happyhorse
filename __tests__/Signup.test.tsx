import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { initTestHelpers, getPage } from "next-page-tester";
import "setimmediate";

initTestHelpers();

jest.mock("next/router", () => require("next-router-mock"));

// ローカルファイル操作用Nodeモジュール
const fs = require("fs");

// Firebase SDK テストユーティリティ
const firebase = require("@firebase/rules-unit-testing");

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

// FirebaseのProject ID
const PROJECT_ID = "happyhorse-bc5f6";

// 認証なしFirestoreクライアントの取得
function getFirestore() {
  const app = firebase.initializeTestApp({
    projectId: PROJECT_ID,
  });

  return app.firestore();
}

// テスト開始時に1回だけ実行される
beforeAll(async () => {
  // ローカルにあるRulesファイルを読み込む
  const rules = fs.readFileSync("firestore.rules", "utf8");
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

// テスト終了前に1回だけ実行される
afterAll(async () => {
  // エミュレーター上に作られたアプリ情報を全て消去する
  await Promise.all(firebase.apps().map((app) => app.delete()));
});

describe("SignUp", () => {
  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it("Should pass user login", async () => {
    const db = getFirestore();

    // const mockRouter = {
    //   push: jest.fn(),
    // };
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
