import "./styles/main.scss";
import "./styles/navbar.scss";
import "./styles/footer.scss";
import "./styles/auth.scss";
import "./styles/release.scss";
import "./styles/like.scss";
import "./styles/not-found.scss";

import "@riotjs/hot-reload";
import { component } from "riot";
import registerGlobal from "./register-global.js";
import Router from "./router.riot";

registerGlobal();

component(Router)(document.getElementById("app"), {
  title: "Diskitty",
});
