import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "../constants/global.js";

export default function fillHead() {
  const title = document.createElement("title");
  title.innerText = PROJECT_TITLE;
  document.head.appendChild(title);

  const metaDescription = document.createElement("meta");
  metaDescription.name = "description";
  metaDescription.content = PROJECT_DESCRIPTION;
  document.head.appendChild(metaDescription);
}
