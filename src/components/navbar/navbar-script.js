import { auth, db } from "../../utils/firebase.js";
import { getFavorites } from "../../utils/favorites.js";
import appEvents from "../../utils/events.js";
import {
  ItemType,
  PROJECT_ROOT,
  PROJECT_TITLE,
} from "../../constants/global.js";

export default {
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
    this.updateFunc = (async () => {
      const favorites = await getFavorites();
      this.update({ favoritesCount: favorites.count });
    }).bind(this);

    appEvents.on("favoritesUpdated", this.updateFunc);

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
