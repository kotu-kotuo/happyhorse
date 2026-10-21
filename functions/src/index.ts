import { initializeApp } from "firebase-admin/app";

initializeApp();

export { deletePost } from "./deletePost";
export { reviewRating } from "./reviewRating";
export { sendgridMail } from "./sendgridMail";
