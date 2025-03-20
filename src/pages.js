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
    path: "/releases/:id",
    label: "Release",
    componentName: "release",
  },
];
