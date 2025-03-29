export default function formatNote(note) {
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
