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
}
