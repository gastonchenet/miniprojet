import { register } from "riot";

// This function is used to get the basename of a file path
const basename = (path, extension = "") => {
  const name = path.split("/").reverse()[0].replace(extension, "");
  if (name === "index") return path.split("/").reverse()[1];
  return name;
};

// Register all components in the components and pages folders
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
  // Register all components in the components and pages folders
  registerFromContext(globalComponentsContext);
  registerFromContext(pagesComponentsContext);
};
