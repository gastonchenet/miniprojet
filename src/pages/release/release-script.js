import { toggleLike } from "../../utils/favorites.js";
import { waitUntilAuthReady } from "../../utils/firebase.js";
import { fetchRelease } from "../../utils/api.js";
import { ItemType, PROJECT_ROOT } from "../../constants/global.js";
import formatNote from "../../utils/formatNote.js";

export default {
  PROJECT_ROOT,

  state: {
    release: null,
    rating: null,
    noteExpanded: false,
    isFavorite: false,
    loggedIn: false,
  },

  toggleExpandNotes() {
    this.update({ noteExpanded: !this.state.noteExpanded });
  },

  async onMounted(props) {
    this.state.loggedIn = await waitUntilAuthReady();

    const { release, stats, fav } = await fetchRelease(props.params.id);

    console.log(release);
    console.log(stats);
    console.log(fav);

    this.update({
      release,
      rating: stats.rating,
      selectedImage: release?.images[0]?.uri,
      isFavorite: fav,
    });

    // Remove useless data from the release's note
    if (release.notes && this.$("pre.note"))
      this.$("pre.note").innerHTML = formatNote(release.notes);

    const like = this.$(".like");

    if (like) {
      this.likeListener = ((e) => {
        e.preventDefault();
        e.stopPropagation();
        like.classList.toggle("liked");

        toggleLike(
          {
            id: release.id,
            title: release.title,
            thumb: release.thumb,
            artist: release.artists[0].name,
            year: release.year,
          },
          ItemType.Release
        );
      }).bind(this);

      like?.addEventListener("click", this.likeListener);
    }
  },

  onBeforeUnmount() {
    if (this.likeListener)
      this.$(".like").removeEventListener("click", this.likeListener);
  },
};
