import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "../constants/global.js";

export default function fillHead() {
  // Set the title and meta description for the page
  const title = document.createElement("title");
  title.innerText = PROJECT_TITLE;
  document.head.appendChild(title);

  const metaDescription = document.createElement("meta");
  metaDescription.name = "description";
  metaDescription.content = PROJECT_DESCRIPTION;
  document.head.appendChild(metaDescription);
}
