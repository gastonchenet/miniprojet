import { toggleLike } from "../../utils/favorites.js";
import { waitUntilAuthReady } from "../../utils/firebase.js";
import { fetchMaster } from "../../utils/api.js";
import { ItemType, PROJECT_ROOT } from "../../constants/global.js";
import formatNote from "../../utils/formatNote.js";

export default {
  PROJECT_ROOT,

  state: {
    master: null,
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

    const { master, fav } = await fetchMaster(props.params.id);

    console.log(master);
    console.log(fav);

    this.update({
      master,
      selectedImage: master.images[0].uri,
      isFavorite: fav,
    });

    if (master.notes && this.$("pre.note"))
      this.$("pre.note").innerHTML = formatNote(master.notes);

    const like = this.$(".like");

    this.likeListener = ((e) => {
      e.preventDefault();
      e.stopPropagation();
      like.classList.toggle("liked");

      toggleLike(
        {
          id: master.id,
          title: master.title,
          thumb: master.images[0].uri,
          artist: master.artists[0].name,
          year: master.year,
        },
        ItemType.Master
      );
    }).bind(this);

    like?.addEventListener("click", this.likeListener);
  },

  onBeforeUnmount() {
    this.$(".like")?.removeEventListener("click", this.likeListener);
  },
};
