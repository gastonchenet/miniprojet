import observable from "@riotjs/observable";

function AppEvents() {
  observable(this);
}

const appEvents = new AppEvents();

export default appEvents;
