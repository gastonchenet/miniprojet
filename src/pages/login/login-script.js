import { router } from "@riotjs/route";
import { auth, waitUntilAuthReady } from "../../utils/firebase.js";
import { PROJECT_ROOT } from "../../constants/global.js";

export default {
  state: {
    passwordVisible: false,
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

  async login(e) {
    e.preventDefault();

    this.update({ error: null });

    const email = this.$("input[name='email']").value;
    const password = this.$("input[name='password']").value;

    if (!email || !password) {
      return this.update({ error: "Please fill in all fields" });
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push(PROJECT_ROOT + "/");
    } catch (error) {
      this.update({
        error: error.message.replace(/(Firebase:|\(.*\).?)/g, "").trim(),
      });
    }
  },
};
