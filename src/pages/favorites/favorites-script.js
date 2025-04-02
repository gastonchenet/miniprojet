import { waitUntilAuthReady } from "../../utils/firebase.js";
import { getFavorites } from "../../utils/favorites.js";
import { ItemType } from "../../constants/global.js";

const selections = {
  All: null,
  ...ItemType,
};

export default {
  state: {
    release: [],
    artist: [],
    master: [],
    all: [],
    count: 0,
    selected: selections.All,
    selections: Object.values(selections),
    loaded: false,
  },

  select(value) {
    this.update({ selected: value });
  },

  async onMounted() {
    await waitUntilAuthReady();
    this.update({ ...(await getFavorites()), loaded: true });
  },
};
