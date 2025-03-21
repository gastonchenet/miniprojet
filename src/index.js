import "./styles/main.scss";
import "./styles/navbar.scss";
import "./styles/auth.scss";
import "./styles/release.scss";
import "./styles/like.scss";

import "@riotjs/hot-reload";
import { component } from "riot";
import registerGlobalComponents from "./register-global-components.js";
import Router from "./router.riot";

registerGlobalComponents();

component(Router)(document.getElementById("app"), {
  title: "Kittify",
});
