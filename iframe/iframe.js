(function () {
  //   let template = document.createElement("template");
  customElements.define(
    "com-saccustomwidgets-utils-iframe",
    class Iframe extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this.iframe = document.createElement('iframe');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.border = '0px';
        this._shadowRoot.appendChild(this.iframe);
      }

      connectedCallback() {
        if (!this.firstConnection) {
          this.setUrl(this.url);
          this.setSandBox(this.sandBox);
        }
        this.firstConnection = true;
      }

      onCustomWidgetAfterUpdate(props) {
        if (this.firstConnection) {
          if (props.url) {
            this.setUrl(props.url);
          } else if (props.sandBox) {
            this.setSandBox(props.sandBox);
          }
        }
      }
      setUrl(url) {
        this.iframe.src = url;
      }
      setSandBox(sandbox) {
        this.iframe.sandbox = `allow-same-origin allow-scripts allow-forms allow-popups-to-escape-sandbox allow-downloads ${sandbox}`;
      }
    }

  );
})();
