import { Selection } from "./Selection.js";

export default class Formatter {
  // class nhận vào editor và selection để xử lý format
  /**
   *
   * @param {HTMLElement} editorEl
   * @param {Selection} selection
   */
  constructor(editorEl, selection) {
    this.editorEl = editorEl;
    this.selection = selection;
  }

  //   exec commnad
  #exec(command, value = null) {
    // restore selection
    this.selection.restore();
    this.editorEl.focus();
    document.execCommand(command, false, value);
  }

  //   formatting method
  bold() {
    this.#exec("bold");
  }

  italic() {
    this.#exec("italic");
  }

  underline() {
    this.#exec("underline");
  }

  strikethrough() {
    this.#exec("strikeThrough");
  }

  clear() {
    this.#exec("removeFormat");
  }

  // Query State
  // ─────────────────────────────────────────────────────────────

  isBold() {
    return document.queryCommandState("bold");
  }

  isItalic() {
    return document.queryCommandState("italic");
  }

  isUnderline() {
    return document.queryCommandState("underline");
  }

  isStrikethrough() {
    return document.queryCommandState("strikeThrough");
  }
  // ─────────────────────────────────────────────────────────────
  // Block Formatting
  // ─────────────────────────────────────────────────────────────

  #toggleBlock(tag) {
    const currentFormatBlock = document
      .queryCommandValue("formatBlock")
      .toLowerCase();

    if (currentFormatBlock === tag) {
      this.#exec("formatBlock", "p");
    } else {
      this.#exec("formatBlock", tag);
    }
  }

  #isInsideTag(tagName) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    let node = selection.getRangeAt(0).commonAncestorContainer;
    while (node && node !== this.editorEl) {
      if (node.nodeName && node.nodeName.toLowerCase() === tagName) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }

  heading1() {
    this.#toggleBlock("h1");
  }

  heading2() {
    this.#toggleBlock("h2");
  }

  heading3() {
    this.#toggleBlock("h3");
  }

  paragraph() {
    this.#exec("formatBlock", "p");
  }

  blockquote() {
    // Check DOM directly - queryCommandValue fails inside lists
    if (this.#isInsideTag("blockquote")) {
      // Use outdent to remove blockquote
      this.#exec("outdent");
    } else {
      this.#exec("formatBlock", "blockquote");
    }
  }

  getState() {
    // get current blockFormat
    const blockFormat = document.queryCommandValue("formatBlock").toLowerCase();

    return {
      // Inline
      bold: this.isBold(),
      italic: this.isItalic(),
      underline: this.isUnderline(),
      strikethrough: this.isStrikethrough(),
    };
  }
}
