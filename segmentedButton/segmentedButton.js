(function () {
  let template = document.createElement("template");
  template.innerHTML = `
  <div id="ui5_content" name="ui5_content">
  <slot name="content"></slot>
  </div>

  <script id="oView" name="oView" type="sapui5/xmlview">
  </script>
`;

  customElements.define(
    "com-novartis-segmented-button",
    class SegmentedButton extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        if (!this._id) this._id = createGuid();
        else this.redrawn = true;

        this._shadowRoot.querySelector("#oView").id = this._id + "_oView";

        this.styleFile = document.createElement("style");
        this.appendChild(this.styleFile);
      }

      connectedCallback() {
        if (!this.firstConnection) {
          this.updateStyleFile();
          this.updateHtmlScript();
          loadThis(this);
          // this.setStyle();
        }
        this.firstConnection = true;
      }
      onCustomWidgetAfterUpdate(props) {
        if (this.firstConnection) {
          this.updateStyleFile();
          this.updateHtmlScript();

          loadThis(this);
          // this.setStyle();
        }
      }

      updateStyleFile() {
        this.style.width = this.orientation == "vertical" ? this.buttonWidth : this.buttonWidth * this.buttonCount + "px";
        this.style.height = this.orientation == "vertical" ? this.buttonHeight * this.buttonCount : this.buttonHeight + "px";
        this.styleFile.innerHTML = `
        .sac_widget_${this._id}, .sac_widget_${this._id} .sapUiView, .sac_widget_${this._id} .button-group{
          width: ${this.orientation == "vertical" ? this.buttonWidth : this.buttonWidth * this.buttonCount}px !important;
          height:${this.orientation == "vertical" ? this.buttonHeight * this.buttonCount : this.buttonHeight}px;
        }
          .sac_widget_${this._id} .button-group{
            font-family: ${this.fontFamily} !important;
            font-weight: ${this.fontWeight} !important;
            font-style: ${this.fontStyle} !important;
            display: ${this.orientation == "vertical" ? "block" : "inline-block"} !important;
            padding: 0 !important;
          }

          .sac_widget_${this._id} .sapMSegBBtn {
          width: ${this.buttonWidth}px !important;
          height: ${this.buttonHeight}px !important;
          line-height: ${this.buttonHeight}px !important;
          font-size: ${this.fontSize}px !important;
          display: ${this.orientation == "vertical" ? "block" : "inline-block"} !important;
          border-top: 1px solid ${this.borderColor} !important;
          border-bottom: ${this.orientation == "vertical" ? "none" : `1px solid ${this.borderColor}`} !important;
          border-right: ${this.orientation == "vertical" ? `1px solid ${this.borderColor}` : "none"} !important;
          border-left:1px solid ${this.borderColor} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtn.sapMSegBtnLastVisibleButton {
          border-right: 1px solid ${this.borderColor} !important;
          border-bottom: 1px solid ${this.borderColor} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtn.sapMSegBBtnFocusable:hover {
          background-color: ${this.hoverBackgroundColor} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtn.sapMSegBBtnFocusable:focus {
          outline: none !important;
        }
        .sac_widget_${this._id} .sapMSegBBtn:first-child {
          border-top-left-radius: ${this.borderRadius == "true" ? this.borderRadiusValue : 0}px !important;
          border-bottom-left-radius: ${
            this.borderRadius == "true" && this.orientation != "vertical" ? this.borderRadiusValue : 0
          }px !important;
          border-top-right-radius: ${
            this.borderRadius == "true" && this.orientation == "vertical" ? this.borderRadiusValue : 0
          }px !important;
          color: ${this.buttonTextColor0} !important;
          background-color: ${this.buttonBackColor0} !important;
        }
        .sac_widget_${this._id} .sapMSegBtnLastVisibleButton {
          border-top-right-radius:${
            this.borderRadius == "true" && this.orientation != "vertical" ? this.borderRadiusValue : 0
          }px !important;
          border-bottom-right-radius: ${this.borderRadius == "true" ? this.borderRadiusValue : 0}px !important;
          border-bottom-left-radius: ${
            this.borderRadius == "true" && this.orientation == "vertical" ? this.borderRadiusValue : 0
          }px !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(3) {
          color: ${this.buttonTextColor2} !important;
          background-color: ${this.buttonBackColor2} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(4) {
          color: ${this.buttonTextColor3} !important;
          background-color: ${this.buttonBackColor3} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(5) {
          color: ${this.buttonTextColor4} !important;
          background-color: ${this.buttonBackColor4} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(6) {
          color: ${this.buttonTextColor5} !important;
          background-color: ${this.buttonBackColor5} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(7) {
          color: ${this.buttonTextColor6} !important;
          background-color: ${this.buttonBackColor6} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(8) {
          color: ${this.buttonTextColor7} !important;
          background-color: ${this.buttonBackColor7} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtn:nth-child(9) {
          color: ${this.buttonTextColor8} !important;
          background-color: ${this.buttonBackColor8} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(10) {
          color: ${this.buttonTextColor9} !important;
          background-color: ${this.buttonBackColor9} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtn:nth-child(2) {
          color: ${this.buttonTextColor1} !important;
          background-color: ${this.buttonBackColor1} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(1) {
          background-color: ${this.buttonBackSelectedColor0} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtnSel.sapMSegBBtn:nth-child(2) {
          background-color: ${this.buttonBackSelectedColor1} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(3) {
          background-color: ${this.buttonBackSelectedColor2} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(4) {
          background-color: ${this.buttonBackSelectedColor3} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(5) {
          background-color: ${this.buttonBackSelectedColor4} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(6) {
          background-color: ${this.buttonBackSelectedColor5} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtnSel.sapMSegBBtn:nth-child(7) {
          background-color: ${this.buttonBackSelectedColor6} !important;
        }
        .sac_widget_${this._id} .sapMSegBBtnSel.sapMSegBBtn:nth-child(8) {
          background-color: ${this.buttonBackSelectedColor7} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(9) {
          background-color: ${this.buttonBackSelectedColor8} !important;
        }
        .sac_widget_${this._id}  .sapMSegBBtnSel.sapMSegBBtn:nth-child(10) {
          background-color: ${this.buttonBackSelectedColor9} !important;
        }
  `;
      }
      updateHtmlScript() {
        const selected = this.currentSelected ? this.currentSelected  : this.initSelected;
        let string = `<mvc:View controllerName="sap.m.sample.SegmentedButton.Page" height="100%" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">`;
        if (selected == -1) {
          string += `<SegmentedButton selectedButton='none' selectionChange="onSelectionChange" class="button-group">`;
        } else {
          string += `<SegmentedButton selectedKey='${selected}' selectionChange="onSelectionChange" class="button-group">`;
        }
        string += `<items class='items-list'>`;

        for (let i = 0; i < this.buttonCount; i++) {
          let btnText = "buttonText" + i;
          let btnState = "btnState" + i;
          string += `<SegmentedButtonItem  class='btn-item' press="onButtonPress${i}" text="${this[btnText]}" enabled="${
            this[btnState] == "enabled" ? true : false
          }" key="${i}" />
              `;
        }

        string += `
                </items> 
              </SegmentedButton>
            </mvc:View>`;
        let view = this.shadowRoot.getElementById(this._id + "_oView");
        view.innerHTML = string;
      }

      enableButtonItem(index) {
        if (index < this.buttonCount) {
          if (this[`btnState${index}`] != "enabled") {
            this[`btnState${index}`] = "enabled";
            this.updateHtmlScript();
            loadThis(this);
          }
        } else {
          console.warn("Invalid button index");
        }
      }
      disableButtonItem(index) {
        if (index < this.buttonCount) {
          if (this[`btnState${index}`] == "enabled") {
            this[`btnState${index}`] = "disabled";
            this.updateHtmlScript();
            loadThis(this);
          }
        } else {
          console.warn("Invalid button index");
        }
      }
      addButtonItem(text, textColor, backColor, backSelectedColor, btnState, index) {
        if (index >= 0 && index <= this.buttonCount) {
          if (this.buttonCount <= 10) {
            for (let i = this.buttonCount; i > index; i--) {
              this[`buttonText${i}`] = this[`buttonText${i - 1}`];
              this[`buttonTextColor${i}`] = this[`buttonTextColor${i - 1}`];
              this[`buttonBackColor${i}`] = this[`buttonBackColor${i - 1}`];
              this[`buttonBackSelectedColor${i}`] = this[`buttonBackSelectedColor${i - 1}`];
              this[`btnState${i}`] = this[`btnState${i - 1}`];
            }
            this[`buttonText${index}`] = text ? text : "New Button";
            this[`buttonTextColor${index}`] = textColor ? textColor : "#000000";
            this[`buttonBackColor${index}`] = backColor ? backColor : "#fafafa";
            this[`buttonBackSelectedColor${index}`] = backSelectedColor ? backSelectedColor : "#b8b8b8";
            this[`btnState${index}`] = btnState == "enabled" ? "enabled" : "disabled";
            ++this.buttonCount;

            this.updateStyleFile();
            this.updateHtmlScript();
            loadThis(this);
            this.setStyle();
          } else {
            console.warn('10 buttons can be added at most.')
          }
        } else {
          console.warn("invalid index");
        }
      }
      removeButtonItem(index) {
        if (index >= 0 && index < this.buttonCount) {
          for (let i = index; i < this.buttonCount; i++) {
            this[`buttonText${i}`] = this[`buttonText${i + 1}`];
            this[`buttonTextColor${i}`] = this[`buttonTextColor${i + 1}`];
            this[`buttonBackColor${i}`] = this[`buttonBackColor${i + 1}`];
            this[`buttonBackSelectedColor${i}`] = this[`buttonBackSelectedColor${i + 1}`];
            this[`btnState${i}`] = this[`btnState${i + 1}`];
          }
          let last = this.buttonCount - 1;
          this[`buttonText${last}`] = `Button ${last}`;
          this[`buttonTextColor${last}`] = "#000000";
          this[`buttonBackColor${last}`] = "#fafafa";
          this[`buttonBackSelectedColor${last}`] = "#b8b8b8";
          this[`btnState${last}`] = "enabled";

          --this.buttonCount;
          this.updateStyleFile();
          this.updateHtmlScript();
          loadThis(this);
          this.setStyle();
        }
      }
      getSelectedItem() {
        let selected = this.getElementsByClassName("sapMSegBBtnSel");
        return selected.length > 0 ? selected[0].textContent : 'none';
      }
      setStyle() {
        let width;
        let height;
        if (this.orientation == "vertical") {
          width = this.buttonWidth;
          height = this.buttonHeight * this.buttonCount;
        } else {
          width = this.buttonWidth * this.buttonCount;
          height = this.buttonHeight;
        }
        this.parentNode.parentNode.parentNode.parentNode.style.width = `${width}px`;
        this.parentNode.parentNode.parentNode.parentNode.style.height = `${height}px`;
        this.parentNode.parentNode.parentNode.style.width = `${width}px`;
        this.parentNode.parentNode.parentNode.style.height = `${height}px`;
      }
    }
  );

  function loadThis(that) {
    let content = document.createElement("div");
    content.className = "sac_widget_" + that._id;
    content.slot = "content";
    that.appendChild(content);
    sap.ui.getCore().attachInit(function () {
      // "use strict";
      sap.ui.define(
        ["jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/m/SegmentedButton"],
        function (jQuery, Controller, segmentedButtons) {
          // "use strict";
          let events = {
            onSelectionChange: function (oEvent) {
              that.dispatchEvent(new Event("buttonClicked"));
            },
          };
          // for (let i = 1; i < that.buttonCount; i++) {
          //   events[`onButtonPress${i}`] = function (oEvent) {
          //     console.log(i, oEvent.mParameters.id);
          //   };
          // }
          return Controller.extend("sap.m.sample.SegmentedButton.Page", events);
        }
      );
      var oView = sap.ui.xmlview({
        viewContent: jQuery(that._shadowRoot.getElementById(that._id + "_oView")).html(),
      });
      oView.placeAt(content);
      if (!that.redrawn) {
        const contents = that.getElementsByClassName(`sac_widget_${that._id}`);
        if (contents.length > 1) {
          contents[0].parentNode.removeChild(contents[0]);
        }
      } else {
        that.redrawn = false;
      }
    });
  }
  function createGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
})();
