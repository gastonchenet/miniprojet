export default {
  state: {
    selectedImage: null,
  },

  selectImage(image) {
    this.update({ selectedImage: image });
  },

  onMounted() {
    // Set the first image as the default selected image
    this.selectImage(this.props.images[0].uri);

    // Scroll illustrations horizontally on wheel scroll
    const selectionsContainer = this.$(".selections-container");
    if (!selectionsContainer) return;
    let lastScroll = 0;

    this.scrollListener = ((e) => {
      e.preventDefault();

      if (Date.now() - lastScroll < 250) return;
      lastScroll = Date.now();

      selectionsContainer.scroll({
        left: selectionsContainer.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    }).bind(this);

    selectionsContainer.addEventListener("wheel", this.scrollListener);
  },

  onBeforeUnmount() {
    this.$(".selections-container")?.removeEventListener(
      "wheel",
      this.scrollListener
    );
  },
};
