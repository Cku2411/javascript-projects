export const EVENTS = {
  // Picker lifecycle
  PICKER_READY: "picker:ready",
  PICKER_OPEN: "picker:open",
  PICKER_CLOSE: "picker:close",
  PICKER_DESTROY: "picker:destroy",

  //   date selection events
  DATE_SELECT: "date:select",
  DATE_CLEAR: "date:clear",

  //   view Event
  VIEW_CHANGE: "view:change",
  VIEW_RENDER: "view:render",
  VIEW_DAY_RENDERED: "view:daysRendered",
  VIEW_SHOWN: "view:shown",
  VIEW_HIDDEN: "view:hidden",

  //   state
  STATE_CHANGE: "state:change",
  STATE_RESET: "state:reset",
};

export function stateEvent(eventName) {
  return `state:${eventName}`;
}

export const ALL_EVENTS = Object.values(EVENTS);

export default EVENTS;
