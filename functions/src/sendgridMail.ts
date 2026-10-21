import sgMail from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";

const SITE_URL = "https://happyhorse.vercel.app";
const FROM = { name: "happy horse", email: "happyhorse0518@gmail.com" };

// User-entered names and titles go into HTML mail bodies.
function escapeHtml(value: unknown): string {
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

function profileLink(uid: string): string {
  return link(`/profile?uid=${encodeURIComponent(uid)}`, "プロフィール画面へ");
}

// Withdrawn users are deleted from Auth but remain in chatrooms, so a missing
// user means "do not mail", not a failure.
async function emailOf(uid: string): Promise<string | undefined> {
  try {
    return (await getAuth().getUser(uid)).email;
  } catch (err) {
    if ((err as { code?: string }).code === "auth/user-not-found") return undefined;
    throw err;
  }
}

// Email the participants of a deal when a message is posted to its chatroom.
export const sendgridMail = functions
  .region("asia-northeast1")
  .runWith({ secrets: ["SENDGRID_API_KEY"] })
  .firestore.document("/users/{uid}/posts/{pid}/chatrooms/{cid}/messages/{mid}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (data.dealInterruption || data.dealCompleted) return;

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
    sgMail.setApiKey(apiKey);

    const path = snapshot.ref.path;
    // SendGrid errors only say "Forbidden" etc.; the cause is in response.body.
    const send = async (kind: string, to: string | undefined, subject: string, html: string) => {
      if (!to) {
        functions.logger.warn("Skipping mail: recipient has no email or was deleted", { path, kind });
        return;
      }
      try {
        await sgMail.send({ to, from: FROM, subject, html });
      } catch (err) {
        const body = (err as { response?: { body?: unknown } }).response?.body;
        functions.logger.error("SendGrid send failed", { path, kind, body });
        throw err;
      }
    };

    const receiverEmail = await emailOf(data.messageReceiverID);
    const receiverName = escapeHtml(data.messageReceiverName);
    const username = escapeHtml(data.username);
    const postTitle = escapeHtml(data.postTitle);
    const management = link("/message/management", "メッセージ管理画面へ");

    if (data.clientDecision) {
      await send(
        "clientDecision",
        receiverEmail,
        "【happyhorse】取引者があなたに決定しました。",
        `<div>${receiverName}さん</div><br><div>${username}さんがあなたを「${postTitle}」の取引者に決定しました。</div>${management}`,
      );
    } else if (data.rateCompleted) {
      const senderEmail = await emailOf(data.userID);
      await send(
        "rateCompleted",
        receiverEmail,
        "【happyhorse】評価が届きました。",
        `<div>${receiverName}さん</div><br><div>${username}さんから「${postTitle}」の取引の評価が届きました。</div>${profileLink(data.messageReceiverID)}`,
      );
      await send(
        "rateCompleted",
        senderEmail,
        "【happyhorse】評価が届きました。",
        `<div>${username}さん</div><br><div>${receiverName}さんから「${postTitle}」の取引の評価が届きました。</div>${profileLink(data.userID)}`,
      );
    } else if (data.pleaseRate) {
      await send(
        "pleaseRate",
        receiverEmail,
        "【happyhorse】評価をお願いします。",
        `<div>${receiverName}さん</div><br><div>${username}さんとの「${postTitle}」の取引が完了しました。評価をお願いします。</div>${management}`,
      );
    } else {
      await send(
        "newMessage",
        receiverEmail,
        "【happyhorse】新着メッセージがあります。",
        `<div>${receiverName}さん</div><br><div>${username}さんからの新着メッセージがあります。</div><br><div>掲載タイトル：「${postTitle}」</div>${management}`,
      );
    }
  });
