import { waitUntilAuthReady } from "../../utils/firebase.js";
import { toggleLike } from "../../utils/favorites.js";
import { fetchArtist, fetchArtistReleases } from "../../utils/api.js";
import { ItemType, PROJECT_ROOT } from "../../constants/global.js";
import formatNote from "../../utils/formatNote.js";

let currentPage = 1;

export default {
  PROJECT_ROOT,

  state: {
    artist: null,
    releases: null,
    pagination: null,
    slicedVariations: true,
    seeInactives: false,
    noteExpanded: false,
    isFavorite: false,
    loggedIn: false,
  },

  toggleExpandNotes() {
    this.update({ noteExpanded: !this.state.noteExpanded });
  },

  toggleSeeInactives() {
    this.update({ seeInactives: !this.state.seeInactives });
  },

  toggleSlicedVariations() {
    this.update({ slicedVariations: !this.state.slicedVariations });
  },

  async loadNextPage(count) {
    const { releases } = await fetchArtistReleases(
      this.props.params.id,
      ++currentPage,
      count
    );
    return releases;
  },

  async fill(artistId) {
    const { artist, releases, pagination, fav } = await fetchArtist(artistId);
    this.update({ artist, releases, pagination, isFavorite: fav });

    console.log(artist);
    console.log(releases);
    console.log(pagination);

    if (artist.profile && this.$("pre.note"))
      this.$("pre.note").innerHTML = formatNote(artist.profile);

    const like = this.$(".like");

    if (like) {
      this.likeListener = ((e) => {
        e.preventDefault();
        e.stopPropagation();
        like.classList.toggle("liked");

        toggleLike(
          {
            id: artist.id,
            thumb: artist.images?.[0].uri,
            artist: artist.name,
          },
          ItemType.Artist
        );
      }).bind(this);

      like?.addEventListener("click", this.likeListener);
    }
  },

  async onMounted(props) {
    this.state.loggedIn = await waitUntilAuthReady();
    this.fill(props.params.id);
  },

  onBeforeUnmount() {
    if (this.likeListener)
      this.$(".like").removeEventListener("click", this.likeListener);
  },

  onUpdated(props) {
    if (!this.state.artist || this.props.params.id === props.params.id) return;
    this.fill(props.params.id);
  },
};
