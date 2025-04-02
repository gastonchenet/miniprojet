import firebase from "firebase/compat/app";
import { router } from "@riotjs/route";
import { auth, db } from "../../utils/firebase.js";
import { PROJECT_ROOT } from "../../constants/global.js";

export default {
  signinWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth
      .signInWithPopup(provider)
      .then(async (result) => {
        const user = result.user;

        const userDoc = await db.collection("users").doc(user.uid).get();

        if (!userDoc) {
          await db.collection("users").doc(user.uid).set({
            username: user.displayName,
            favoriteReleases: [],
            favoriteArtists: [],
            favoriteMasters: [],
          });
        }

        router.push(PROJECT_ROOT + "/");
      })
      .catch((error) => {
        this.update({
          // Display an error message if firebase fails to sign in
          error: error.message.replace(/(Firebase:|\(.*\).?)/g, "").trim(),
        });
      });
  },
};
