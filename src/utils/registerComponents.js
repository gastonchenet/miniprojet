import { register } from "riot";

const basename = (path, extension = "") => {
  const name = path.split("/").reverse()[0].replace(extension, "");
  if (name === "index") return path.split("/").reverse()[1];
  return name;
};

const globalComponentsContext = import.meta.webpackContext("../components/", {
  recursive: true,
  regExp: /[a-zA-Z0-9-]+\.riot/,
});

const pagesComponentsContext = import.meta.webpackContext("../pages/", {
  recursive: true,
  regExp: /[a-zA-Z0-9-]+\.riot/,
});

function registerFromContext(context) {
  context.keys().map((path) => {
    const name = basename(path, ".riot");
    const component = context(path);

    register(name, component.default || component);

    return { name, component };
  });
}

export default () => {
  registerFromContext(globalComponentsContext);
  registerFromContext(pagesComponentsContext);
};
