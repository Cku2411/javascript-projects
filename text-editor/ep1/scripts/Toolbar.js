import { TextEditor } from "./TextEditor.js";

export class ToolBar {
  /**
   *
   * @param {TextEditor} editorInstance
   */
  constructor(editorInstance) {
    this.editorInstance = editorInstance;
    this.toolbar = null;
    this.buttons = new Map();

    this.bindEvents();
  }

  getButtonConfig() {
    return [
      { name: "bold", label: "B", title: "Bold" },
      { name: "italic", label: "I", title: "Italic" },
      { name: "underline", label: "U", title: "Underline" },
      { name: "strikethrough", label: "S", title: "Strikethrough" },
      { name: "separator" },
      { name: "heading1", label: "H1", title: "Heading 1" },
      { name: "heading2", label: "H2", title: "Heading 2" },
      { name: "separator" },
      { name: "bulletList", label: "•", title: "Bullet List" },
      { name: "numberedList", label: "1.", title: "Numbered List" },
      { name: "blockquote", label: '"', title: "Quote" },
    ];
  }

  render(wrapper) {
    this.toolbar = document.createElement("div");
    this.toolbar.className = "ck-toolbar";

    // render button
    this.getButtonConfig().forEach((buttonConfig) => {
      if (buttonConfig.name == "separator") {
        const seprator = document.createElement("span");
        seprator.className = "ck-toolbar-seperator";
        this.toolbar.appendChild(seprator);
        return;
      }
      const btn = this.createButton(buttonConfig);
      //   add to butotns map
      this.buttons.set(buttonConfig.name, btn);
      this.toolbar.appendChild(btn);
    });

    wrapper.insertBefore(this.toolbar, wrapper.firstChild);
  }

  createButton(buttonConfig) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ck-toolbar-btn";
    btn.title = buttonConfig.title;
    btn.dataset.action = buttonConfig.name;
    btn.textContent = buttonConfig.label;
    // add evenlistener
    btn.addEventListener("click", () => {
      console.log(buttonConfig.name);
      this.editorInstance[buttonConfig.name]();
      this.updateActiveStates();
    });

    return btn;
  }

  //   get state active for toolbar - update state
  updateActiveStates() {
    if (!this.editorInstance.isInEditor()) {
      this.buttons.forEach((btn) => {
        btn.classList.remove("is-active");
      });
      return;
    }

    const state = this.editorInstance.getState();
    console.log({ state });

    this.buttons.forEach((btn, name) => {
      if (state.hasOwnProperty(name)) {
        console.log(state[name]);

        btn.classList.toggle("is-active", state[name]);
      }
    });
  }

  bindEvents() {
    document.addEventListener("selectionchange", () => {
      this.updateActiveStates();
    });
  }
}
