import { db, auth } from "./firebase.js";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import observable from "@riotjs/observable";
import appEvents from "./events.js";

const fieldMap = {
  release: "favoriteReleases",
  artist: "favoriteArtists",
  master: "favoriteMasters",
};

let favoritesCache = {
  release: [],
  artist: [],
  master: [],
  filled: false,
  get all() {
    return this.release.concat(this.artist, this.master);
  },
  get count() {
    return this.release.length + this.artist.length + this.master.length;
  },
};

export async function getFavorites() {
  if (favoritesCache.filled) {
    return favoritesCache;
  }

  const favorites = {
    release: [],
    artist: [],
    master: [],
    get count() {
      return this.release.length + this.artist.length + this.master.length;
    },
    get all() {
      return this.release.concat(this.artist, this.master);
    },
  };

  if (!auth.currentUser) return favorites;

  const userId = auth.currentUser.uid;
  const userRef = db.collection("users").doc(userId);

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      console.error("User document not found");
      return;
    }

    const userData = doc.data();
    for (const key in fieldMap) {
      favorites[key] = userData[fieldMap[key]] || [];
    }

    console.log("Favorites loaded");
  } catch (error) {
    console.error("Error loading favorites:", error);
  }

  favoritesCache.release = favorites.release;
  favoritesCache.artist = favorites.artist;
  favoritesCache.master = favorites.master;
  favoritesCache.filled = true;

  return favorites;
}

export async function isFavorite(id, type) {
  if (!auth.currentUser) return false;
  const favorites = await getFavorites();
  return favorites[type].some((item) => item.id === id);
}

export async function toggleLike(favorite, type) {
  if (!auth.currentUser) {
    console.error("User is not logged in");
    return;
  }

  if (isNaN(favorite.year)) delete favorite.year;
  if (!favorite.title) delete favorite.title;
  favorite.type = type;

  const userId = auth.currentUser.uid;
  const userRef = db.collection("users").doc(userId);

  const fieldName = fieldMap[type];
  if (!fieldName) {
    console.error("Invalid type");
    return;
  }

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      console.error("User document not found");
      return;
    }

    const userData = doc.data();
    const favoritesArray = userData[fieldName] || [];
    const exists = favoritesArray.find((item) => item.id === favorite.id);

    if (exists) {
      await userRef.update({
        [fieldName]: arrayRemove(exists),
      });

      favoritesCache[type] = favoritesCache[type].filter(
        (item) => item.id !== favorite.id
      );
      console.log(`${type} removed from favorites`);
    } else {
      console.log(fieldName);
      await userRef.update({
        [fieldName]: arrayUnion(favorite),
      });

      favoritesCache[type].push(favorite);
      console.log(`${type} added to favorites`);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }

  appEvents.trigger("favoritesUpdated");
}
