import { DISCOGS_HEADERS, ITEMS_PER_PAGE, ItemType } from "../constants.js";
import { isFavorite } from "./favorites.js";

export async function search(
  query,
  type = ItemType.Release,
  page = 1,
  count = ITEMS_PER_PAGE
) {
  const url = new URL("https://api.discogs.com/database/search");
  url.searchParams.append("q", query);
  url.searchParams.append("type", type);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", count);

  const response = await fetch(url.toString(), DISCOGS_HEADERS);
  const { results, pagination } = await response.json();

  return { results, pagination };
}

search.util = {
  formatResults(results) {
    return results.map((result) => ({
      id: result.id,
      title: result.title.split(/\s*-\s*/)[1],
      artist: result.title.split(/\s*-\s*/)[0],
      year: result.year,
      thumb: result.thumb,
    }));
  },
};

export async function fetchArtistReleases(
  artistId,
  page = 1,
  count = ITEMS_PER_PAGE
) {
  const url = new URL(`https://api.discogs.com/artists/${artistId}/releases`);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", count);

  const response = await fetch(url.toString(), DISCOGS_HEADERS);
  const { releases, pagination } = await response.json();

  return { releases, pagination };
}

export async function fetchArtist(artistId, page = 1, count = ITEMS_PER_PAGE) {
  const res = await fetch(
    `https://api.discogs.com/artists/${artistId}`,
    DISCOGS_HEADERS
  );

  const [artist, { releases, pagination }, fav] = await Promise.all([
    res.json(),
    fetchArtistReleases(artistId, page, count),
    isFavorite(parseInt(artistId), ItemType.Artist),
  ]);

  return { artist, releases, pagination, fav };
}

export async function fetchRelease(releaseId) {
  const responses = await Promise.all([
    fetch(`https://api.discogs.com/releases/${releaseId}`, DISCOGS_HEADERS),
    fetch(
      `https://api.discogs.com/releases/${releaseId}/rating`,
      DISCOGS_HEADERS
    ),
  ]);

  const [release, stats, fav] = await Promise.all([
    ...responses.map((response) => response.json()),
    isFavorite(parseInt(releaseId), ItemType.Release),
  ]);

  return { release, stats, fav };
}

export async function fetchMaster(masterId) {
  const res = await fetch(
    `https://api.discogs.com/masters/${masterId}`,
    DISCOGS_HEADERS
  );

  const [master, fav] = await Promise.all([
    res.json(),
    isFavorite(parseInt(masterId), ItemType.Master),
  ]);

  return { master, fav };
}
