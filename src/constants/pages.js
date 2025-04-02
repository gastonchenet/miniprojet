import { PROJECT_ROOT } from "./global.js";

export default [
  {
    path: PROJECT_ROOT + "/(/?[?#].*)?(#.*)?",
    componentName: "home",
  },
  {
    path: PROJECT_ROOT + "/favorites(/?[?#].*)?(#.*)?",
    componentName: "favorites",
  },
  {
    path: PROJECT_ROOT + "/login(/?[?#].*)?(#.*)?",
    componentName: "login",
  },
  {
    path: PROJECT_ROOT + "/register(/?[?#].*)?(#.*)?",
    componentName: "register",
  },
  {
    path: PROJECT_ROOT + "/release/:id",
    componentName: "release",
  },
  {
    path: PROJECT_ROOT + "/master/:id",
    componentName: "master",
  },
  {
    path: PROJECT_ROOT + "/artist/:id",
    componentName: "artist",
  },
];
