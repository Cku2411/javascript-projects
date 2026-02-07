import { EVENTS } from "./constanst.js";
import { TextEditor } from "./TextEditor.js";

const editor = new TextEditor("#editor", {
  placeholder: "hello it's me you looking for..",
});

const focusEvnt = (data) => {
  console.log("editor focus");
};

editor.on(EVENTS.FOCUS, focusEvnt);
editor.on(EVENTS.BLUR, () => {
  console.log("editor blur");
});
editor.on(EVENTS.CHANGE, () => {
  console.log("editor inputing");
});

window.editor = editor;
