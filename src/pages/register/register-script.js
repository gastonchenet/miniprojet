import { PROJECT_ROOT } from "../../constants/global.js";
import { auth, db, waitUntilAuthReady } from "../../utils/firebase.js";
import { router } from "@riotjs/route";

export default {
  state: {
    passwordVisible: false,
    confirmPasswordVisible: false,
    error: null,
  },

  async onMounted() {
    await waitUntilAuthReady();
    if (auth.currentUser) router.push(PROJECT_ROOT + "/");
  },

  togglePasswordVisibility() {
    const passwordField = this.$("input[name='password']");
    passwordField.type =
      passwordField.type === "password" ? "text" : "password";

    this.update({ passwordVisible: !this.state.passwordVisible });
  },

  toggleConfirmPasswordVisibility() {
    const confirmPasswordField = this.$("input[name='confirm-password']");
    confirmPasswordField.type =
      confirmPasswordField.type === "password" ? "text" : "password";

    this.update({ confirmPasswordVisible: !this.state.confirmPasswordVisible });
  },

  async register(e) {
    e.preventDefault();

    this.update({ error: null });

    const username = this.$("input[name='username']").value;
    const email = this.$("input[name='email']").value;
    const password = this.$("input[name='password']").value;
    const confirmPassword = this.$("input[name='confirm-password']").value;

    if (!username || !email || !password || !confirmPassword) {
      return this.update({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return this.update({ error: "Passwords do not match" });
    }

    try {
      // Sign up with email and password using Firebase
      const userCredentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Attach the username to the user document in Firestore
      await db.collection("users").doc(userCredentials.user.uid).set({
        username,
        favoriteReleases: [],
        favoriteArtists: [],
        favoriteMasters: [],
      });

      router.push(PROJECT_ROOT + "/");
    } catch (error) {
      this.update({
        error: error.message.replace(/(Firebase:|\(.*\).?)/g, "").trim(),
      });
    }
  },
};
