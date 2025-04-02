import { auth, db } from "../../utils/firebase.js";
import { getFavorites } from "../../utils/favorites.js";
import appEvents from "../../utils/events.js";
import {
  ItemType,
  PROJECT_ROOT,
  PROJECT_TITLE,
} from "../../constants/global.js";

export default {
  // Constants
  PROJECT_TITLE,
  PROJECT_ROOT,

  state: {
    favoritesCount: 0,
    user: null,
  },

  gotoHome() {
    appEvents.trigger("search", { query: "", type: ItemType.Release });
  },

  async onMounted() {
    // Update favorites count when it changes
    this.updateFunc = (async () => {
      const favorites = await getFavorites();
      this.update({ favoritesCount: favorites.count });
    }).bind(this);

    appEvents.on("favoritesUpdated", this.updateFunc);

    // Update the navbar when the user logs in or out
    this.unsubAuthListener = auth.onAuthStateChanged(async () => {
      if (auth.currentUser) {
        const doc = await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get();

        const favorites = await getFavorites();

        this.update({
          user: { ...auth.currentUser, ...doc.data() },
          favoritesCount: favorites.count,
        });
      } else {
        this.update({ user: null, favoritesCount: 0 });
      }
    });
  },

  logout() {
    auth.signOut();
    window.location.reload();
  },

  onBeforeUnmount() {
    appEvents.off("favoritesUpdated", this.updateFunc);
    this.unsubAuthListener();
  },
};
