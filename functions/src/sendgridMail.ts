import sgMail from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";

const SITE_URL = "https://happyhorse.vercel.app";
const FROM = { name: "happy horse", email: "happyhorse0518@gmail.com" };

// User-entered names and titles go into HTML mail bodies.
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function link(path: string, label: string): string {
  return `<p><a href="${SITE_URL}${path}">${label}</a></p>`;
}

// Email the participants of a deal when a message is posted to its chatroom.
export const sendgridMail = functions
  .region("asia-northeast1")
  .runWith({ secrets: ["SENDGRID_API_KEY"] })
  .firestore.document("/users/{uid}/posts/{pid}/chatrooms/{cid}/messages/{mid}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (data.dealInterruption || data.dealCompleted) return null;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");
    const auth = getAuth();
    const user = await auth.getUser(data.messageReceiverID);
    const receiverName = escapeHtml(data.messageReceiverName);
    const username = escapeHtml(data.username);
    const postTitle = escapeHtml(data.postTitle);
    const management = link("/message/management", "メッセージ管理画面へ");

    if (data.clientDecision) {
      await sgMail.send({
        to: user.email,
        from: FROM,
        subject: "【happyhorse】取引者があなたに決定しました。",
        html: `<div>${receiverName}さん</div><br><div>${username}さんがあなたを「${postTitle}」の取引者に決定しました。</div>${management}`,
      });
    } else if (data.rateCompleted) {
      const other = await auth.getUser(data.userID);
      await sgMail.send({
        to: user.email,
        from: FROM,
        subject: "【happyhorse】評価が届きました。",
        html: `<div>${receiverName}さん</div><br><div>${username}さんから「${postTitle}」の取引の評価が届きました。</div>${link(`/profile?uid=${encodeURIComponent(data.messageReceiverID)}`, "プロフィール画面へ")}`,
      });
      await sgMail.send({
        to: other.email,
        from: FROM,
        subject: "【happyhorse】評価が届きました。",
        html: `<div>${username}さん</div><br><div>${receiverName}さんから「${postTitle}」の取引の評価が届きました。</div>${link(`/profile?uid=${encodeURIComponent(data.userID)}`, "プロフィール画面へ")}`,
      });
    } else if (data.pleaseRate) {
      await sgMail.send({
        to: user.email,
        from: FROM,
        subject: "【happyhorse】評価をお願いします。",
        html: `<div>${receiverName}さん</div><br><div>${username}さんとの「${postTitle}」の取引が完了しました。評価をお願いします。</div>${management}`,
      });
    } else {
      await sgMail.send({
        to: user.email,
        from: FROM,
        subject: "【happyhorse】新着メッセージがあります。",
        html: `<div>${receiverName}さん</div><br><div>${username}さんからの新着メッセージがあります。</div><br><div>掲載タイトル：「${postTitle}」</div>${management}`,
      });
    }
    return null;
  });
