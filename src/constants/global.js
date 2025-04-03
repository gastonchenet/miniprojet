// Project info
export const PROJECT_TITLE = "Diskitty";
export const PROJECT_DESCRIPTION = `Discover, share, and enjoy music with ${PROJECT_TITLE}.`;
export const PROJECT_ROOT = "";

// Firebase configuration
export const FIREBASE_API_KEY = "AIzaSyD9AGJjSHp8zlA2NhnS0y1mMda8XwpDe-c";
export const FIREBASE_AUTH_DOMAIN = "riot-a9eca.firebaseapp.com";
export const FIREBASE_PROJECT_ID = "riot-a9eca";

// Discogs configuration
export const DISCOGS_API_KEY = "ObXNXjxZACXVRWGtaMlR";
export const DISGOGS_API_SECRET = "JIPnNZpRmKadBUOfeLxwbzfTdrfKeOyG";
export const DISCOGS_HEADERS = {
  headers: {
    Authorization: `Discogs key=${DISCOGS_API_KEY}, secret=${DISGOGS_API_SECRET}`,
    "User-Agent": "Diskitty/1.0",
    "Content-Type": "application/json",
  },
};

// Miscellaneous
export const ITEMS_PER_PAGE = 100;

export const ItemType = {
  Release: "release",
  Artist: "artist",
  Master: "master",
};
