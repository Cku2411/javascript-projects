import { TextEditor } from "./TextEditor.js";

export class LinkDialog {
  /**
   *
   * @param {TextEditor} editorInstance
   */
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.isOpen = false;
    this.render();
    this.bindEvent();
  }

  bindEvent() {
    // Cancel button
    this.dialog
      .querySelector(".bw-link-dialog__btn--cancel")
      .addEventListener("click", () => {
        this.close();
      });

    this.dialog
      .querySelector(".bw-link-dialog__btn--submit")
      .addEventListener("click", () => {
        console.log("iinser");
        this.submit();
      });
  }

  render() {
    this.dialog = document.createElement("div");
    this.dialog.className = "bw-wysiwyg__link-dialog";
    this.dialog.innerHTML = `
     <div class="bw-link-dialog__overlay"></div>
      <div class="bw-link-dialog__content">
        <div class="bw-link-dialog__header">Insert Link</div>
        <input type="url" class="bw-link-dialog__input" placeholder="https://example.com">
        <div class="bw-link-dialog__actions">
          <button type="button" class="bw-link-dialog__btn bw-link-dialog__btn--cancel">Cancel</button>
          <button type="button" class="bw-link-dialog__btn bw-link-dialog__btn--submit">Insert</button>
        </div>
      </div>
    `;

    // get inputfield
    this.input = this.dialog.querySelector(".bw-link-dialog__input");
    document.body.appendChild(this.dialog);
  }

  open() {
    // save selection
    this.editor.saveSelection();
    this.dialog.classList.add("is-open");
    this.isOpen = true;
  }
  close() {
    if (this.isOpen) {
      this.dialog.classList.remove("is-open");
      this.isOpen = false;
    }
  }

  submit() {
    // get value
    const value = this.input.value.trim();
    // add link
    console.log({ value });
    this.editor.restoreSelection();
    this.editor.link(value);

    this.close();
  }
}
