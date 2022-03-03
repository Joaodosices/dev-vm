(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
       @import url("https://sac-dev-cw.novartis.net/cw/dev/segmentedButton/bootstrap.min.css")
      </style>
  
      <style>
      :host {
          display: block;
          padding: 12px;
      }  
      .division {
        padding: 5px 0;
        display: table;
      }
      .input-button {
        padding:8px;
        background-color: #ababab;
        margin:0;
        cursor: pointer;
      }
      .horizontal-line {
          margin: 5px 15px 15px 15px;
          border-top: 1px solid #ababab;
      }
      </style>
      <fieldset>
            <h2 class="col-sm-12">Segmented Button Properties</h2>
            <div class="form-group col-xs-6">
                <label class="col-form-label" for="orientation">Orientation</label> 
                <select class="form-control" id="orientation">
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                </select>
            </div>
            <div class="form-group col-xs-6">
              <label class="col-form-label">Initial Selected Item (index)</label>
              <select class="form-control" id="initSelected">
              </select>
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label" for="fontFamily">Font Family</label> 
                <select class="form-control" id="fontFamily">
                    <option value="current">Current</option>
                    <option style="font-family:arial" value="arial">Arial</option>
                    <option style="font-family:courier" value="courier">Courier</option>
                    <option style="font-family:georgia" value="georgia">Georgia</option>
                    <option style="font-family:lato" value="lato">Lato</option>
                    <option style="font-family:times new roman" value="times new roman">Times New Roman</option>
                    <option style="font-family:trebuchet ms" value="trebuchet ms">Trebuchet MS</option>
                    <option style="font-family:verdana" value="verdana">Verdana</option>
                    </select>
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label">Font Weight</label>
                <select class="form-control" id="fontWeight">
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                </select>
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label">Font Style</label>
                <select class="form-control" id="fontStyle">
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="oblique">Oblique</option>
                </select>
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label">Font Size</label>
                <input type=number min=8 class="form-control" id="fontSize" />
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label">Width</label>
                <input type=number min=10 class="form-control" id="buttonWidth" />
            </div>
            <div class="form-group col-xs-6">
                <label class="col-form-label">Height</label>
                <input type=number min=10 class="form-control" id="buttonHeight" />
            </div>
            <div class="col-xs-6">
                <label for="end">Hover Background Color</label>
                <input type="text" id="hoverBackgroundColor" class="form-control" />
            </div>
            <div class="col-xs-6">
                <label for="end">Border Color</label>
                <input type="text" id="borderColor" class="form-control" />
            </div>
            <div class="form-group col-xs-4">
                <label class="col-form-label" for="borderRadius">Round Corner</label>
                <select class="form-control" id="borderRadius">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div class="form-group col-xs-4" id="borderRadiusValueDiv">
                <label class="col-form-label">Border Radius</label>
                <input type="number" min=0 id="borderRadiusValue" class="form-control" />
            </div>
            <div class="form-group col-xs-4">
                <label class="col-form-label">No. of Buttons</label>
                <div style="display:flex">
                    <label id="minus" class="input-button">-</label>
                    <input id="buttonCount" readonly type="number" min=1 max=10 style="padding:8px 6px;" class="form-control" />
                    <label id="plus" class="input-button">+</label>
                </div>
            </div>
            <hr class="col-xs-12 horizontal-line" />
            <div id="buttons">
            </div>
      </fieldset>
          `;
  customElements.define(
    "com-novartis-segmented-button-builder",
    class ButtonGroupBuilder extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        const countUpdate = this.updateDivisionCount.bind(this);
        // division count events
        this.getId("minus").addEventListener("click", () => countUpdate("minus"));
        this.getId("plus").addEventListener("click", () => countUpdate("plus"));

        this.setChangeEventListeners([
          "orientation",
          "initSelected",
          "fontFamily",
          "fontWeight",
          "fontStyle",
          "fontSize",
          "buttonWidth",
          "buttonHeight",
          'hoverBackgroundColor',
          "borderColor",
          "borderRadius",
          "borderRadiusValue"
        ]);
      }

      setChangeEventListeners(propArray) {
        const update = this.updateProp.bind(this);

        propArray.forEach((prop) => {
          this.getId(prop).addEventListener("change", () => update(prop));
        });
      }

      updateBorderRadius(borderRadius) {
        this.getId("borderRadiusValueDiv").style.pointerEvents = borderRadius === "true" ? "all" : "none";
        this.getId("borderRadiusValueDiv").style.opacity = borderRadius === "true" ? 1 : 0.4;
      }
      updateDivisionCount(operation) {
        if (operation === "minus") {
          if (this.buttonCount === 1) {
            alert("at least 1 buttons required");
          } else {
            this.buttonCount -= 1;
            this.updateProp("buttonCount");
          }
        } else if (operation === "plus") {
          if (this.buttonCount === 10) {
            alert("at most 10 buttons allowed");
          } else {
            this.buttonCount += 1;
            this.updateProp("buttonCount");
          }
        }
      }
      addDivisions(buttons) {
        const parent = this.getId("buttons");
        const conCurrent = parent.childElementCount;
        if (conCurrent === 0) {
          // at start up
          for (let i = 0; i < 2; i++) {
            this.addNewRangeItem(i, parent);
          }
        }
        const current = parent.childElementCount;
        if (current / 2 < buttons) {
          for (let i = current / 2; i < buttons; i++) {
            this.addNewRangeItem(i, parent);
          }
        } else if (current / 2 > buttons) {
          for (let i = current; i > buttons * 2; i--) {
            parent.removeChild(parent.childNodes[i]);
          }
        } else if (current / 2 === buttons) {
          console.log("equals");
        }

        // add select items to initstateif radio
        const select = this.getId('initSelected');
        const totalNoOfButtons =parent.childElementCount / 2;
        let text = '<option value=-1>none</option>';
        for (let i=0; i<totalNoOfButtons; i++) {
          text += `<option value=${i}>${i}</option>`;
        }
        select.innerHTML = text;
      }

      addNewRangeItem(i, parent) {
        const update = this.updateProp.bind(this);
        let sample = document.createElement("div");
        sample.className = "division";
          // <div class="col-xs-6">
          //     <label for="range_color">Width</label>
          //     <input type="number" min=1 id="buttonWidth${i}" class="form-control" />
          // </div>
        sample.innerHTML = ` 
          <label class="col-xs-2 col-form-label" for="legend_text">Text:</label>
          <div class="col-xs-10">
              <input type="text" id="buttonText${i}" class="form-control" />
          </div>
          <div class="col-xs-6">
              <label for="end">Text Color</label>
              <input type="text" id="buttonTextColor${i}" class="form-control" />
          </div>
          <div class="col-xs-6">
              <label for="range_color">Background Color</label>
              <input type="text" id="buttonBackColor${i}" class="form-control" />
          </div>
          <div class="col-xs-6">
              <label for="range_color">Background Color (selected)</label>
              <input type="text" id="buttonBackSelectedColor${i}" class="form-control" />
          </div>
          <div class="col-xs-6">
              <label for="range_color">Button State</label>
              <select class="form-control" id="btnState${i}">
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
              </select>
          </div>
          `;

        let inputs = sample.getElementsByTagName("input");
        let select = sample.getElementsByTagName("select");

        inputs[0].onchange = (e) => update(`buttonText${i}`, e);
        inputs[1].onchange = (e) => update(`buttonTextColor${i}`, e);
        inputs[2].onchange = (e) => update(`buttonBackColor${i}`, e);
        inputs[3].onchange = (e) => update(`buttonBackSelectedColor${i}`, e);
        // inputs[5].onchange = (e) => update(`buttonWidth${i}`, e);
        select[0].onchange = (e) => update(`btnState${i}`, e);

        parent.appendChild(sample);

        inputs[0].value = this[`buttonText${i}`] ? this[`buttonText${i}`] : `Button ${i}`;
        inputs[1].value = this[`buttonTextColor${i}`] ? this[`buttonTextColor${i}`] : "#000000";
        inputs[2].value = this[`buttonBackColor${i}`] ? this[`buttonBackColor${i}`] : "#fafafa";
        inputs[3].value = this[`buttonBackSelectedColor${i}`] ? this[`buttonBackSelectedColor${i}`] : "#b8b8b8";
        // inputs[5].value = this[`buttonWidth${i}`] ? this[`buttonWidth${i}`] : "auto";
        select[0].value = this[`btnState${i}`] ? this[ `btnState${i}`] : 'enabled';
        
        const line = document.createElement("hr");
        line.className = "horizontal-line";
        parent.appendChild(line);
      }

      updateProp(prop, e) {
        const value = this[prop] ? this[prop] : e ? e.target.value : null;
        this.dispatchEvent(
          new CustomEvent("propertiesChanged", {
            detail: {
              properties: {
                [prop]: value,
              },
            },
          })
        );
        switch (prop) {
          case "buttonCount": {
            this.addDivisions(value);
            break;
          }
          case "borderRadius": {
            this.updateBorderRadius(value);
            break;
          }
          default: {
            break;
          }
        }
      }

      getId(id) {
        return this._shadowRoot.getElementById(`${id}`);
      }

      get orientation() {
        return this.getId("orientation").value;
      }
      set orientation(orientation) {
        this.getId("orientation").value = orientation;
      }
      get initSelected() {
        return parseInt(this.getId('initSelected').value);
      }
      set initSelected(value) {
        this.getId('initSelected').value = value;
      }
      get fontFamily() {
        return this.getId("fontFamily").value;
      }
      set fontFamily(font) {
        this.getId("fontFamily").value = font;
      }
      get fontWeight() {
        return this.getId("fontWeight").value;
      }
      set fontWeight(weight) {
        this.getId("fontWeight").value = weight;
      }
      get fontStyle() {
        return this.getId("fontStyle").value;
      }
      set fontStyle(style) {
        this.getId("fontStyle").value = style;
      }
      get fontSize() {
        return this.getId("fontSize").valueAsNumber;
      }
      set fontSize(value) {
        this.getId("fontSize").value = value;
      }
      get buttonWidth() {
        return this.getId('buttonWidth').valueAsNumber;
      }
      set buttonWidth(value) {
        this.getId('buttonWidth').value = value;
      }
      get buttonHeight() {
        return this.getId('buttonHeight').valueAsNumber;
      }
      set buttonHeight(value) {
        this.getId('buttonHeight').value = value;
      }
      get hoverBackgroundColor() {
        return this.getId("hoverBackgroundColor").value;
      }
      set hoverBackgroundColor(color) {
        this.getId("hoverBackgroundColor").value = color;
      }
      get borderColor() {
        return this.getId("borderColor").value;
      }
      set borderColor(color) {
        this.getId("borderColor").value = color;
      }
      get borderRadius() {
        return this.getId("borderRadius").value;
      }
      set borderRadius(radius) {
        this.getId("borderRadius").value = radius;
        this.updateBorderRadius(radius);
      }
      get borderRadiusValue() {
        return this.getId("borderRadiusValue").value;
      }
      set borderRadiusValue(value) {
        this.getId("borderRadiusValue").value = value;
      }
      get buttonCount() {
        return this.getId("buttonCount").valueAsNumber;
      }
      set buttonCount(bCount) {
        this.addDivisions(bCount);
        this.getId("buttonCount").value = bCount;
      }

      get buttonText0() {
        return this.getId("buttonText0").value;
      }
      set buttonText0(text) {
        this.getId("buttonText0").value = text;
      }
      get buttonTextColor0() {
        return this.getId("buttonTextColor0").value;
      }
      set buttonTextColor0(color) {
        this.getId("buttonTextColor0").value = color;
      }
      get buttonBackColor0() {
        return this.getId("buttonBackColor0").value;
      }
      set buttonBackColor0(color) {
        this.getId("buttonBackColor0").value = color;
      }
      get buttonBackSelectedColor0() {
        return this.getId("buttonBackSelectedColor0").value;
      }
      set buttonBackSelectedColor0(color) {
        this.getId("buttonBackSelectedColor0").value = color;
      }
      get btnState0() {
        const item = this.getId("btnState0");
        return item ? item.value : null;
      }
      set btnState0(state) {
        const item = this.getId("btnState0");
        if (item) {
          item.value = state;
        }
      }

      get buttonText1() {
        const item = this.getId('buttonText1');
        return item ? item.value : null;
      }
      set buttonText1(text) {
        const item = this.getId("buttonText1");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor1() {
        const item = this.getId("buttonTextColor1");
        return item ? item.value : null;
      }
      set buttonTextColor1(color) {
        const item = this.getId("buttonTextColor1");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor1() {
        const item = this.getId("buttonBackColor1");
        return item ? item.value : null;
      }
      set buttonBackColor1(color) {
        const item = this.getId("buttonBackColor1");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor1() {
        const item = this.getId("buttonBackSelectedColor1");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor1(color) {
        const item = this.getId("buttonBackSelectedColor1");
        if (item) {
          item.value = color;
        }
      }

      get btnState1() {
        const item = this.getId("btnState1");
        return item ? item.value : null;
      }
      set btnState1(state) {
        const item = this.getId("btnState1");
        if (item) {
          item.value = state;
        }
      }

      get buttonText2() {
        const item = this.getId("buttonText2");
        return item ? item.value : null;
      }
      set buttonText2(text) {
        const item = this.getId("buttonText2");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor2() {
        const item = this.getId("buttonTextColor2");
        return item ? item.value : null;
      }
      set buttonTextColor2(color) {
        const item = this.getId("buttonTextColor2");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor2() {
        const item = this.getId("buttonBackColor2");
        return item ? item.value : null;
      }
      set buttonBackColor2(color) {
        const item = this.getId("buttonBackColor2");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor2() {
        const item = this.getId("buttonBackSelectedColor2");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor2(color) {
        const item = this.getId("buttonBackSelectedColor2");
        if (item) {
          item.value = color;
        }
      }
      get btnState2() {
        const item = this.getId("btnState2");
        return item ? item.value : null;
      }
      set btnState2(state) {
        const item = this.getId("btnState2");
        if (item) {
          item.value = state;
        }
      }

      get buttonText3() {
        const item = this.getId("buttonText3");
        return item ? item.value : null;
      }
      set buttonText3(text) {
        const item = this.getId("buttonText3");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor3() {
        const item = this.getId("buttonTextColor3");
        return item ? item.value : null;
      }
      set buttonTextColor3(color) {
        const item = this.getId("buttonTextColor3");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor3() {
        const item = this.getId("buttonBackColor3");
        return item ? item.value : null;
      }
      set buttonBackColor3(color) {
        const item = this.getId("buttonBackColor3");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor3() {
        const item = this.getId("buttonBackSelectedColor3");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor3(color) {
        const item = this.getId("buttonBackSelectedColor3");
        if (item) {
          item.value = color;
        }
      }
      get btnState3() {
        const item = this.getId("btnState3");
        return item ? item.value : null;
      }
      set btnState3(state) {
        const item = this.getId("btnState3");
        if (item) {
          item.value = state;
        }
      }

      get buttonText4() {
        const item = this.getId("buttonText4");
        return item ? item.value : null;
      }
      set buttonText4(text) {
        const item = this.getId("buttonText4");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor4() {
        const item = this.getId("buttonTextColor4");
        return item ? item.value : null;
      }
      set buttonTextColor4(color) {
        const item = this.getId("buttonTextColor4");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor4() {
        const item = this.getId("buttonBackColor4");
        return item ? item.value : null;
      }
      set buttonBackColor4(color) {
        const item = this.getId("buttonBackColor4");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor4() {
        const item = this.getId("buttonBackSelectedColor4");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor4(color) {
        const item = this.getId("buttonBackSelectedColor4");
        if (item) {
          item.value = color;
        }
      }
      get btnState4() {
        const item = this.getId("btnState4");
        return item ? item.value : null;
      }
      set btnState4(state) {
        const item = this.getId("btnState4");
        if (item) {
          item.value = state;
        }
      }

      get buttonText5() {
        const item = this.getId("buttonText5");
        return item ? item.value : null;
      }
      set buttonText5(text) {
        const item = this.getId("buttonText5");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor5() {
        const item = this.getId("buttonTextColor5");
        return item ? item.value : null;
      }
      set buttonTextColor5(color) {
        const item = this.getId("buttonTextColor5");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor5() {
        const item = this.getId("buttonBackColor5");
        return item ? item.value : null;
      }
      set buttonBackColor5(color) {
        const item = this.getId("buttonBackColor5");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor5() {
        const item = this.getId("buttonBackSelectedColor5");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor5(color) {
        const item = this.getId("buttonBackSelectedColor5");
        if (item) {
          item.value = color;
        }
      }
      get btnState5() {
        const item = this.getId("btnState5");
        return item ? item.value : null;
      }
      set btnState5(state) {
        const item = this.getId("btnState5");
        if (item) {
          item.value = state;
        }
      }

      get buttonText6() {
        const item = this.getId("buttonText6");
        return item ? item.value : null;
      }
      set buttonText6(text) {
        const item = this.getId("buttonText6");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor6() {
        const item = this.getId("buttonTextColor6");
        return item ? item.value : null;
      }
      set buttonTextColor6(color) {
        const item = this.getId("buttonTextColor6");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor6() {
        const item = this.getId("buttonBackColor6");
        return item ? item.value : null;
      }
      set buttonBackColor6(color) {
        const item = this.getId("buttonBackColor6");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor6() {
        const item = this.getId("buttonBackSelectedColor6");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor6(color) {
        const item = this.getId("buttonBackSelectedColor6");
        if (item) {
          item.value = color;
        }
      }
      get btnState6() {
        const item = this.getId("btnState6");
        return item ? item.value : null;
      }
      set btnState6(state) {
        const item = this.getId("btnState6");
        if (item) {
          item.value = state;
        }
      }

      get buttonText7() {
        const item = this.getId("buttonText7");
        return item ? item.value : null;
      }
      set buttonText7(text) {
        const item = this.getId("buttonText7");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor7() {
        const item = this.getId("buttonTextColor7");
        return item ? item.value : null;
      }
      set buttonTextColor7(color) {
        const item = this.getId("buttonTextColor7");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor7() {
        const item = this.getId("buttonBackColor7");
        return item ? item.value : null;
      }
      set buttonBackColor7(color) {
        const item = this.getId("buttonBackColor7");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor7() {
        const item = this.getId("buttonBackSelectedColor7");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor7(color) {
        const item = this.getId("buttonBackSelectedColor7");
        if (item) {
          item.value = color;
        }
      }
      get btnState7() {
        const item = this.getId("btnState7");
        return item ? item.value : null;
      }
      set btnState7(state) {
        const item = this.getId("btnState7");
        if (item) {
          item.value = state;
        }
      }

      get buttonText8() {
        const item = this.getId("buttonText8");
        return item ? item.value : null;
      }
      set buttonText8(text) {
        const item = this.getId("buttonText8");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor8() {
        const item = this.getId("buttonTextColor8");
        return item ? item.value : null;
      }
      set buttonTextColor8(color) {
        const item = this.getId("buttonTextColor8");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor8() {
        const item = this.getId("buttonBackColor8");
        return item ? item.value : null;
      }
      set buttonBackColor8(color) {
        const item = this.getId("buttonBackColor8");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor8() {
        const item = this.getId("buttonBackSelectedColor8");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor8(color) {
        const item = this.getId("buttonBackSelectedColor8");
        if (item) {
          item.value = color;
        }
      }
      get btnState8() {
        const item = this.getId("btnState8");
        return item ? item.value : null;
      }
      set btnState8(state) {
        const item = this.getId("btnState8");
        if (item) {
          item.value = state;
        }
      }

      get buttonText9() {
        const item = this.getId("buttonText9");
        return item ? item.value : null;
      }
      set buttonText9(text) {
        const item = this.getId("buttonText9");
        if (item) {
          item.value = text;
        }
      }
      get buttonTextColor9() {
        const item = this.getId("buttonTextColor9");
        return item ? item.value : null;
      }
      set buttonTextColor9(color) {
        const item = this.getId("buttonTextColor9");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackColor9() {
        const item = this.getId("buttonBackColor9");
        return item ? item.value : null;
      }
      set buttonBackColor9(color) {
        const item = this.getId("buttonBackColor9");
        if (item) {
          item.value = color;
        }
      }
      get buttonBackSelectedColor9() {
        const item = this.getId("buttonBackSelectedColor9");
        return item ? item.value : null;
      }
      set buttonBackSelectedColor9(color) {
        const item = this.getId("buttonBackSelectedColor9");
        if (item) {
          item.value = color;
        }
      }
      get btnState9() {
        const item = this.getId("btnState9");
        return item ? item.value : null;
      }
      set btnState9(state) {
        const item = this.getId("btnState9");
        if (item) {
          item.value = state;
        }
      }
    }
  );
})();
