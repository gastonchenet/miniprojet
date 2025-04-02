import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
} from "../constants/global.js";

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
});

const auth = firebase.auth();
const db = firebase.firestore();

export async function waitUntilAuthReady() {
  // Wait until Firebase Auth is ready
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe();

      // Resolve the promise with true if the user is logged in, false otherwise
      resolve(!!auth.currentUser);
    });
  });
}

export { auth, db };
