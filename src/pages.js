export default [
  {
    path: "/(/?[?#].*)?(#.*)?",
    label: "Home",
    componentName: "home",
  },
  {
    path: "/favorites(/?[?#].*)?(#.*)?",
    label: "Favorites",
    componentName: "favorites",
  },
  {
    path: "/login(/?[?#].*)?(#.*)?",
    label: "Login",
    componentName: "login",
  },
  {
    path: "/register(/?[?#].*)?(#.*)?",
    label: "Register",
    componentName: "register",
  },
  {
    path: "/release/:id",
    label: "Release",
    componentName: "release",
  },
  {
    path: "/master/:id",
    label: "Master",
    componentName: "master",
  },
  {
    path: "/artist/:id",
    label: "Artist",
    componentName: "artist",
  },
];
