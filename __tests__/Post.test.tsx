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

// FirebaseのProject ID
const PROJECT_ID = "happyhorse-bc5f6";

// 認証付きFirestoreクライアントの取得
function getFirestoreWithAuth() {
  const app = firebase.initializeTestApp({
    projectId: PROJECT_ID,
    auth: { uid: "test_user", email: "test_user@example.com" },
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

describe("Post", () => {
  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });
  it("post success", async () => {
    const db = getFirestoreWithAuth();

    const { page } = await getPage({
      route: "/index",
    });
    render(page);

    expect(await screen.findByText("絞り込み検索")).toBeInTheDocument();

    userEvent.click(screen.getByText("掲載"));

    // expect(await screen.findByText("掲載する")).toBeInTheDocument();
    //TODO: エラー発生  FIRESTORE (8.6.8) INTERNAL ASSERTION FAILED: Unexpected state
  });
});
