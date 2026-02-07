export class Selection {
  /**
   *
   * @param {HTMLElement} editorEL
   */
  constructor(editorEL) {
    this.editorEL = editorEL;
    this.saveRange = null;
  }

  //   get current selection
  getSelection() {
    return window.getSelection();
  }

  // getselected TExdt
  getSelectedText() {
    return this.getSelection().toString();
  }

  isCollapsed() {
    return this.getSelection().isCollapsed;
  }

  //   get curretn range
  getRange() {
    const selection = this.getSelection();
    return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }

  //   check if current selection is inside editor
  isInEditor() {
    const selection = this.getSelection();
    console.log(selection.anchorNode);

    return selection.anchorNode && this.editorEL.contains(selection.anchorNode);
  }

  //   save the current selection
  save() {
    const selection = this.getSelection();
    if (selection.rangeCount > 0) {
      this.saveRange = selection.getRangeAt(0).cloneRange();
    }
  }
  //   restore previously saved selecton
  restore() {
    if (this.saveRange) {
      const selection = this.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.saveRange);
    }
  }

  // insert HTML
  insertHTML(html) {
    this.restore();
    const range = this.getRange();

    if (!range) return;

    range.deleteContents();
    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);
    range.collapse(false);
  }

  // insertText() giống như insertHTML(), nhưng chỉ chèn text thuần, không cho phép các ký tự đặc biệt (<, >, &) bị hiểu thành thẻ HTML.

  insertText(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    this.insertHTML(escaped);
  }
}
