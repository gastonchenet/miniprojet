import { router } from "@riotjs/route";
import placeholder from "../../assets/images/placeholder.png";
import { toggleLike, getFavorites } from "../../utils/favorites.js";
import { waitUntilAuthReady, auth } from "../../utils/firebase.js";
import appEvents from "../../utils/events.js";
import { PROJECT_ROOT } from "../../constants/global.js";

let oldScrollTop = 0;

export default {
  placeholder,

  state: {
    releases: null,
    favorites: {
      release: [],
      master: [],
      artist: [],
    },
    artistOnly: false,
    loading: false,
    showLikes: !!auth.currentUser,
  },

  returnTop() {
    document.querySelector("[data-page-scroller]")?.scroll({
      left: 0,
      top: 0,
      behavior: "smooth",
    });

    oldScrollTop = 0;
  },

  getColumns() {
    const releasesContainer = this.$(".releases-container");
    if (!releasesContainer) return 0;
    const gridStyle = window.getComputedStyle(releasesContainer);
    return gridStyle.gridTemplateColumns.split(/\s/).length;
  },

  onMounted(props) {
    waitUntilAuthReady().then(() => {
      this.update({ showLikes: !!auth.currentUser });
    });

    this.searchEvent = ((releases) => {
      this.update({ releases });
    }).bind(this);

    appEvents.on("searchUpdated", this.searchEvent);

    let lastClick = [0, null];

    if (this.props.loadNextPage) {
      const columns = this.getColumns();
      const releasesLength =
        Math.floor(this.props.releases.length / columns) * columns;
      this.state.releases = this.props.releases.slice(0, releasesLength);
    }

    this.update({
      artistOnly: (this.state.releases ?? props.releases).every(
        (r) => r.type === "artist"
      ),
    });

    if (!this.props.hideLikeButton) {
      waitUntilAuthReady().then(async () => {
        const favorites = await getFavorites();

        this.update({
          favorites: {
            release: favorites.release.map((f) => f.id),
            master: favorites.master.map((f) => f.id),
            artist: favorites.artist.map((f) => f.id),
          },
        });
      });
    }

    if (this.props.loadNextPage) {
      this.scrollListener = (async (e) => {
        const topButton = this.$(".top-button");

        if (
          topButton &&
          e.target.scrollTop > window.innerHeight &&
          oldScrollTop <= window.innerHeight
        ) {
          topButton.classList.remove("hidden");
        }

        if (
          topButton &&
          e.target.scrollTop <= window.innerHeight &&
          oldScrollTop > window.innerHeight
        ) {
          topButton.classList.add("hidden");
        }

        oldScrollTop = e.target.scrollTop;

        if (this.state.loading) return;
        const atBottom =
          e.target.scrollTop + 50 >=
          e.target.scrollHeight - e.target.clientHeight;
        if (!atBottom) return;
        this.update({ loading: true });

        const columns = this.getColumns();
        const releasesLength =
          Math.floor(this.props.releases.length / columns) * columns;
        const releases = await this.props.loadNextPage(releasesLength);

        this.state.releases.push(...releases);
        this.update({ loading: false });
      }).bind(this);

      document
        .querySelector("[data-page-scroller]")
        ?.addEventListener("scroll", this.scrollListener);
    }

    this.likeListener = this.$(".releases-container").addEventListener(
      "click",
      (e) => {
        const a = e.target.closest(".release");
        const b = e.target.closest(".like");
        if (!a) return;

        e.preventDefault();
        e.stopPropagation();

        const releaseId = parseInt(a.getAttribute("data-release-id"));
        const releaseType = a.getAttribute("data-release-type");

        const title = a.querySelector(".title")?.textContent;
        const artist = a.querySelector(".artist")?.textContent;

        if (this.props.hideLikeButton) {
          router.push(`${PROJECT_ROOT}/${releaseType}/${releaseId}`);
          return;
        }

        if (b) {
          b.classList.toggle("liked");

          toggleLike(
            {
              id: releaseId,
              title: artist ? title : undefined,
              thumb: a.querySelector(".illustration").src,
              artist: artist || title,
              year: parseInt(a.querySelector(".year").textContent),
            },
            releaseType
          );

          return;
        }

        const like = a.querySelector(".like");
        const now = Date.now();

        if (lastClick[1] === releaseId && now - lastClick[0] < 250) {
          like.classList.toggle("liked");

          toggleLike(
            {
              id: releaseId,
              title: artist ? title : undefined,
              thumb: a.querySelector(".illustration").src,
              artist: artist || title,
              year: parseInt(a.querySelector(".year").textContent),
            },
            releaseType
          );

          lastClick = [0, null];
        } else {
          lastClick = [now, releaseId];

          setTimeout(() => {
            if (lastClick[1] !== releaseId) return;
            router.push(`${PROJECT_ROOT}/${releaseType}/${releaseId}`);
          }, 300);
        }
      }
    );
  },

  onBeforeUnmount() {
    appEvents.off("searchUpdated", this.searchEvent);
    this.$(".releases-container").removeEventListener(
      "click",
      this.likeListener
    );

    if (this.scrollListener) {
      document
        .querySelector("[data-page-scroller]")
        ?.removeEventListener("scroll", this.scrollListener);
    }
  },
};
