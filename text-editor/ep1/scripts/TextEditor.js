export class TextEditor {
  /**
   *
   * @param {string} selector - CSS selector
   * @param {Object} options - Editor options
   * @param {Object} options.placeholder - place holder text
   */
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);

    // store options with defaults
    this.options = {
      placeholder: "Stert writing ...",
      ...options,
    };

    // render editor
    this.render();
  }

  render() {
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
  }
}
