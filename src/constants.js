export const ITEMS_PER_PAGE = 100;

export const DISCOGS_HEADERS = {
  headers: {
    Authorization:
      "Discogs key=ObXNXjxZACXVRWGtaMlR, secret=JIPnNZpRmKadBUOfeLxwbzfTdrfKeOyG",
    "User-Agent": "Diskitty/1.0",
    "Content-Type": "application/json",
  },
};

export const ItemType = {
  Release: "release",
  Artist: "artist",
  Master: "master",
};
