import "./styles/main.scss";
import "./styles/navbar.scss";

import "@riotjs/hot-reload";
import { component } from "riot";
import registerGlobalComponents from "./register-global-components.js";
import App from "./app.riot";

registerGlobalComponents();

component(App)(document.getElementById("app"), {
  title: "Kittify"
});

