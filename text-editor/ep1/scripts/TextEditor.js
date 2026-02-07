import { EVENTS } from "./constanst.js";
import { EventEmiiter } from "./EventEmitter.js";
import Formatter from "./Formatter.js";
import { Selection } from "./Selection.js";

export class TextEditor {
  // private fields

  /**
   *
   * @param {string} selector - CSS selector
   * @param {Object} options - Editor options
   * @param {Object} options.placeholder - place holder text
   */
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.wrapper = null;
    this.content = null;
    this.events = new EventEmiiter();
    this.selection = null;

    // store options with defaults
    this.options = {
      placeholder: "Stert writing ...",
      ...options,
    };

    // render editor
    this.render();
    // add event listener
    this.bindEvent();
  }

  render() {
    console.log(this.options.placeholder);

    // create editor Wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.className = "ck-editor";

    // create content area
    this.content = document.createElement("div");
    this.content.className = "ck-editor__content";
    this.content.contentEditable = true;
    this.content.dataset.placeholder = this.options.placeholder;

    this.wrapper.appendChild(this.content);
    this.container.appendChild(this.wrapper);

    // create selection manager
    this.selection = new Selection(this.wrapper);
    this.formatter = new Formatter(this.wrapper, this.selection);
  }

  bindEvent() {
    this.content.addEventListener("input", () => {
      if (this.content.textContent.trim() == "") {
        this.content.innerHTML = "<p><br></p>";
      }
      this.events.emit(EVENTS.CHANGE);
    });

    this.content.addEventListener("blur", () => {
      this.events.emit(EVENTS.BLUR);
    });

    this.content.addEventListener("focus", () => {
      if (!this.content.innerHTML.trim()) {
        this.content.innerHTML = "<p><br></p>";
      }
      this.events.emit(EVENTS.FOCUS, { data: "is changing" });
    });
  }

  // PUBLIC API

  on(event, callback) {
    this.events.on(event, callback);
  }

  off(event, callback) {
    this.events.off(event, callback);
  }

  saveSelection() {
    this.selection.save();
  }

  /**
   * Restore saved selection
   */
  restoreSelection() {
    this.selection.restore();
  }
  insertHtml(html) {
    this.selection.insertHTML(html);
  }
  insertText(text) {
    this.selection.insertText(text);
  }

  getSelectedText() {
    return this.selection.getSelectedText();
  }

  /**
   * Check ifselection is collapsed (just a cursor)
   * @returns {boolean}
   */
  isCollapsed() {
    return this.selection.isCollapsed();
  }

  // FORMATER
  bold() {
    this.formatter.bold();
  }

  italic() {
    this.formatter.italic();
  }

  underline() {
    this.formatter.underline();
  }

  strikethrough() {
    this.formatter.strikethrough();
  }

  //
  clearFormat() {
    this.formatter.clear();
  }
}
