(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import url("https://sac-dev-cw.novartis.net/cw/dev/iframe/style.css")
    </style>

	<h4 class="widget-description">This widget allows you to embed into SAP Analytics Cloud web pages which contain download button/options.</h4>
    <h2 class="col-xs-12">General Properties</h2>
    <div class="builderentry">
        <label class="builderentry-label">Url</label>
        <input class="builderentry-form" id="url" type="text" />
    </div> 
    <div class="builderentry">
        <label class="builderentry-label">Properties</label>
        <input class="builderentry-form" id="sandBox" type="text" />
    </div> 
        `;
  customElements.define(
    "com-saccustomwidgets-utils-iframe-builder",
    class IframeBuilder extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.setChangeEventListeners(["url", "sandBox"]);
      }

      setChangeEventListeners(propArray) {
        const update = this.updateProp.bind(this);
        propArray.forEach((prop) => {
          this.getId(prop).addEventListener("change", () => update(prop));
        });
      }
      updateProp(prop) {
        this.dispatchEvent(
          new CustomEvent("propertiesChanged", {
            detail: {
              properties: {
                [prop]: this[prop],
              },
            },
          })
        );
      }

      getId(id) {
        return this._shadowRoot.getElementById(`${id}`);
      }

      get url() {
        return this.getId("url").value;
      }
      set url(url) {
        this.getId("url").value = url;
      }
      get sandBox() {
        return this.getId("sandBox").value;
      }
      set sandBox(sandbox) {
        this.getId("sandBox").value = sandbox;
      }
    }
  );
})();
