export default function formatNote(note) {
  // Escape the note to remove any HTML custom tags and format it
  const escaped = note
    .replace(/\[url=([^\]]*)\]([^[]*)\[\/url\]/g, (_, url, text) => {
      if (url.startsWith("http")) return text;
      return `<a href='${url}' class='link'>${text}</a>`;
    })
    .replace(/\[r=([^\]]*)\]/g, "<a href='/release/$1' class='link'>here</a>")
    .replace(/\[[^\]]*\]/g, "")
    .trim();

  return escaped.charAt(0).toUpperCase() + escaped.slice(1);
}
