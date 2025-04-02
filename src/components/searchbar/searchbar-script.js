import { router } from "@riotjs/route";
import appEvents from "../../utils/events.js";
import { search } from "../../utils/api.js";
import placeholder from "../../assets/images/placeholder.png";
import { ItemType, PROJECT_ROOT } from "../../constants/global.js";

let lastTyped = 0;

export default {
  PROJECT_ROOT,
  placeholder,

  state: {
    type: ItemType.Release,
    searchOptions: Object.values(ItemType),
    query: "",
    preview: [],
  },

  select(option) {
    this.update({ type: option });
    this.toggleMenu();
  },

  toggleMenu() {
    this.$(".menu").classList.toggle("visible");
  },

  emptyPreview() {
    // Remove the preview and hide the blur
    this.update({ preview: [] });
    document.querySelector(".content-blur")?.classList.remove("visible");
  },

  async updatePreview(query = "") {
    const { results } = await search(query, this.state.type, 1, 10);

    if (
      !this.$(".search-field").value ||
      document.activeElement !== this.$(".search-field")
    )
      return this.emptyPreview();

    if (results.length > 0)
      document.querySelector(".content-blur")?.classList.add("visible");

    this.update({ preview: search.util.formatResults(results) });
  },

  onSearchInput(e) {
    if (!e.target.value) return this.emptyPreview();
    lastTyped = Date.now();

    setTimeout(() => {
      if (!e.target.value) return this.emptyPreview();
      if (Date.now() - lastTyped < 500) return;
      this.updatePreview(e.target.value);
    }, 500);
  },

  search(e) {
    e.preventDefault();
    this.emptyPreview();
    this.$(".search-field").blur();

    const query = this.$(".search-field").value;
    const type = this.state.type;

    // Redirect to the search page with the query and type
    router.push(`${PROJECT_ROOT}/?q=${query}&type=${type}`);
    appEvents.trigger("search", { query, type });
  },

  onMounted() {
    const url = new URL(window.location.href);

    this.update({
      query: url.searchParams.get("q") || "",
      type: url.searchParams.get("type") || ItemType.Release,
    });

    this.blurListener = (() => this.emptyPreview()).bind(this);

    this.searchbarUpdateFunction = ((path) => {
      // If the path is relative, prepend the origin
      if (!path.startsWith("http")) {
        path = window.location.origin + path;
      }

      const url = new URL(path);
      let val = url.searchParams.get("q") || "";

      // If the path is not the root, set the search field value to an empty string
      if (url.pathname !== "/") val = "";

      this.$(".search-field").value = val;
    }).bind(this);

    this.menuClickListener = ((e) => {
      if (!e.target.closest(".menu-button")) {
        this.$(".menu")?.classList.remove("visible");
      }
    }).bind(this);

    router.on.value(this.searchbarUpdateFunction);
    window.addEventListener("click", this.menuClickListener);
    document
      .querySelector(".content-blur")
      ?.addEventListener("click", this.blurListener);
  },

  onBeforeUnmount() {
    router.off.value(this.searchbarUpdateFunction);
    window.removeEventListener("click", this.menuClickListener);
    document
      .querySelector(".content-blur")
      ?.removeEventListener("click", this.blurListener);
  },
};
