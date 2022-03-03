(function () {
  let template = document.createElement("template");
  template.innerHTML = `
      <div id="target">
      </div>
      `;
  customElements.define(
    "com-novartis-utils-mouseover",
    class MouseOver3 extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.target = this._shadowRoot.getElementById('target');
      }

      connectedCallback() {
        const widget = this;
        if (!this.firstConnection) {
          this.setStyleValue();
          this.target.addEventListener('mouseover', function() {
            widget.dispatchEvent(new Event('onMouseOver'));
          });
          this.target.addEventListener('mouseleave', function() {
            widget.dispatchEvent(new Event('onMouseLeave'));
          });
          this.target.addEventListener('click', function() {
            widget.dispatchEvent(new Event('onClick'));
          });
        }
        this.firstConnection = true;
      }


      onCustomWidgetAfterUpdate(props) {
        if (this.firstConnection) {
            this.setStyleValue();
        }
      }
      
      setStyleValue() {
        this.target.style.position = 'absolute';
        this.target.style.height = `${this.hgt}px`;
        this.target.style.width = `${this.wdh}px`;
        this.target.style.top = `${this.top}px`;
        this.target.style.left = `${this.left}px`;
        this.target.style.backgroundColor = this.showActive ? 'red' : 'transparent';
        this.target.style.cursor = this.showHand ? 'pointer': 'auto';
      }
    }
  );
})();
