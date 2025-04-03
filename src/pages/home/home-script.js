import { search } from "../../utils/api.js";
import appEvents from "../../utils/events.js";
import { ItemType } from "../../constants/global.js";

let currentPage = 1;

export default {
  state: {
    items: 0,
    releases: null,
    fromSearch: false,
    query: "",
    type: ItemType.Release,
    updating: true,
    lastPage: 0,
  },

  getSearchParams(searchData) {
    const url = new URL(window.location.href);
    let query = url.searchParams.get("q") || "";
    let type = url.searchParams.get("type") || ItemType.Release;

    if (searchData) {
      query = searchData.query;
      type = searchData.type;
    }

    this.update({ query, type, fromSearch: !!query });

    return { query, type };
  },

  toggleFooter() {
    this.$(".footer-container").classList.toggle("hidden");
    this.$(".caret").classList.toggle("deployed");
  },

  async loadNextPage(count) {
    const { query, type } = this.getSearchParams();
    const data = await search(query, type, ++currentPage, count);
    return search.util.formatResults(data.results);
  },

  async fill(page = 1, searchData = null) {
    const { query, type } = this.getSearchParams(searchData);
    this.update({ updating: true });
    const data = await search(query, type, page);
    const releases = search.util.formatResults(data.results);
    console.log(data);

    if (searchData && Object.keys(searchData).length) {
      appEvents.trigger("searchUpdated", releases);
    }

    this.update({
      query,
      type,
      releases,
      items: data.pagination.items,
      lastPage: data.pagination.pages,
      fromSearch: !!this.state.query,
      updating: false,
    });
  },

  onMounted() {
    this.fill();
    this.updateSearch = ((searchData) => this.fill(1, searchData)).bind(this);
    appEvents.on("search", this.updateSearch);

    // Detects if the mouse is on the bottom of the screen and adds a class to the footer
    this.mouseOnBottom = ((e) => {
      const buttonClasses = this.$(".see-footer")?.classList;
      if (!buttonClasses) return;

      if (
        e.clientY > window.innerHeight - 100 &&
        !buttonClasses.contains("touchable")
      ) {
        buttonClasses.add("touchable");
      } else if (
        e.clientY <= window.innerHeight - 100 &&
        buttonClasses.contains("touchable")
      ) {
        buttonClasses.remove("touchable");
      }
    }).bind(this);

    document.addEventListener("mousemove", this.mouseOnBottom);
  },

  onUnmounted() {
    appEvents.off("search", this.updateSearch);
    document.removeEventListener("mousemove", this.mouseOnBottom);
  },
};
