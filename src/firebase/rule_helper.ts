import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import type { Firestore } from "firebase/firestore";
import * as fs from "fs";

let testEnv: RulesTestEnvironment | undefined;

export const loadRules = async (
  projectID: string,
  fileName: string = "firestore.rules"
) => {
  testEnv = await initializeTestEnvironment({
    projectId: projectID,
    firestore: { rules: fs.readFileSync(fileName, "utf8") },
  });
  return testEnv;
};

const env = () => {
  if (!testEnv) {
    throw new Error("call loadRules() first");
  }
  return testEnv;
};

// Runs `fn` with a rules-disabled Firestore. The context is torn down after
// the callback, so the Firestore must not be used outside of `fn`.
export const withAdminDb = async (
  fn: (adminDb: Firestore) => void | Promise<void>
) =>
  env().withSecurityRulesDisabled(async (context) => {
    await fn(context.firestore() as unknown as Firestore);
  });

type AuthContext = { [key in "uid" | "email"]?: string };

export const db = (auth: AuthContext | undefined = undefined) =>
  (auth
    ? env().authenticatedContext(auth.uid, { email: auth.email }).firestore()
    : env().unauthenticatedContext().firestore()) as unknown as Firestore;

export const clearFirestoreData = () => env().clearFirestore();

export const cleanup = () => testEnv?.cleanup();
