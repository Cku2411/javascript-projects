import { TextEditor } from "./TextEditor.js";

export class LinkDialog {
  /**
   *
   * @param {TextEditor} editorInstance
   */
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.render();
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

    document.body.appendChild(this.dialog);
  }

  open() {
    this.dialog.classList.add("is-open");
  }
}
