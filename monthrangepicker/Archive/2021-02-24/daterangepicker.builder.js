(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
        :host {
            display: block;
            padding: 27px;
        }
        * {
          box-sizing: border-box;
        }
        fieldset {
          min-width: 0;
          padding: 0;
          margin: 0;
          border: 0;
        }
        legend {
          display: block;
          width: 100%;
          padding: 0;
          margin-bottom: 20px;
          font-size: 21px;
          line-height: inherit;
          color: #333;
          border: 0;
          border-bottom: 1px solid #e5e5e5;
        }
        label {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 5px;
          font-weight: 700;
        }
        input, select {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: inherit;
          font: inherit;
          margin: 0;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .row {
          margin: 0 -15px;
        }
        .row:before, .row:after {
          display: table;
          content: " ";
        }
        .form-control {
          display: block;
          width: 100%;
          height: 34px;
          padding: 6px 12px;
          font-size: 14px;
          line-height: 1.42857143;
          color: #555;
          background-color: #fff;
          background-image: none;
          border: 1px solid #ccc;
          border-radius: 4px;
          -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
          box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
          -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
          -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
          transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        }
        div[class^='col-xs'] {
          float: left;
          position: relative;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px;
        }
        .col-xs-12 {
          width: 100%;
        }
        .col-form-label {
          margin-top: 8px;
        }
    </style>
    <fieldset>
      <legend>Date Range Picker Properties</legend>
        
            <div class="form-group col-xs-12">
                <label class="col-form-label">Date Format</label>
                <input type="string" class="form-control" id="dateFormat" />
            </div>
            <div class="form-group col-xs-12">
                <label class="col-form-label">External CSS Url</label>
                <input type="string" class="form-control" id="externalCssUrl" />
            </div> <div class="form-group col-xs-12">
            <label class="col-form-label">Selection Mode</label>
            <select class="form-control" id="mode">
              <option value="range">Range</option>
              <option value="single">Single Select</option>
          </select>
        </div>
        </div>  
      </fieldset>
        `;
    customElements.define(
      "com-saccustomwidgets-js-monthrangepicker-builder",
      class MultiselectBuilder extends HTMLElement {
        constructor() {
          super();
          this._shadowRoot = this.attachShadow({ mode: "open" });
          this._shadowRoot.appendChild(template.content.cloneNode(true));
          
          this.setChangeEventListeners([
            "dateFormat",
            "externalCssUrl",
            "mode"
          ]);
  
        }
        setChangeEventListeners(propArray) {
          const update = this.updateProp.bind(this);
          propArray.forEach((prop) => {
            this.getId(prop).addEventListener("change", () => update(prop));
          });
        }
  
        getId(id) {
          return this._shadowRoot.getElementById(`${id}`);
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
  
  
        // getters and setters
        get dateFormat() {
          return this.getId("dateFormat").value;
        }
        set dateFormat(value) {
          this.getId("dateFormat").value = value;
        }
        get externalCssUrl() {
          return this.getId("externalCssUrl").value;
        }
        set externalCssUrl(value) {
          this.getId("externalCssUrl").value = value;
        }
        get mode() {
          return this.getId("mode").value;
        }
        set mode(value) {
          this.getId("mode").value = value;
        }
      }
    );
  })();
  