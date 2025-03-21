import { db, auth } from "./firebase.js";
import { arrayUnion, arrayRemove } from "firebase/firestore";

const fieldMap = {
  release: "favoriteReleases",
  artist: "favoriteArtists",
  master: "favoriteMasters",
};

export async function getFavorites() {
  const favorites = {
    release: [],
    artist: [],
    master: [],
  };

  if (!auth.currentUser) {
    console.error("User is not logged in");
    return;
  }

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

  return favorites;
}

export async function isFavorite(id, type) {
  const favorites = await getFavorites();
  return favorites[type].some((item) => item.id === id);
}

export async function toggleLike(favorite, type) {
  if (!auth.currentUser) {
    console.error("User is not logged in");
    return;
  }

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
    const exists = favoritesArray.some((item) => item.id === favorite.id);

    if (exists) {
      await userRef.update({
        [fieldName]: arrayRemove(favorite),
      });

      console.log(`${type} removed from favorites`);
    } else {
      await userRef.update({
        [fieldName]: arrayUnion(favorite),
      });

      console.log(`${type} added to favorites`);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
}
