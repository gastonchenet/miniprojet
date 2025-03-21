import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD9AGJjSHp8zlA2NhnS0y1mMda8XwpDe-c",
  authDomain: "riot-a9eca.firebaseapp.com",
  projectId: "riot-a9eca",
});

const auth = firebase.auth();
const db = firebase.firestore();

export async function waitUntilAuthReady() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });
  });
}

export { auth, db };
