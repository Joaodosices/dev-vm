(function() {
  customElements.define(
    "com-sac-datepicker",
    class DatePicker extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        const item = this;
        // load material css
        const materialCss = document.createElement("link");
        materialCss.rel = "stylesheet";
        materialCss.href =
          "https://widgets.saccustomwidgets.com/widgets/mohan/daterangepicker.css";
        this._shadowRoot.appendChild(materialCss);

        // create input element where data range picker will be attached
        const input = document.createElement("input");
        input.style = "width:146px;height:26px;";
        input.id = "daterangepicker"
        this._shadowRoot.appendChild(input);

        const div = document.createElement("div");
        this._shadowRoot.appendChild(div);

        this.loadAsync(
          "https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/jquery-custom.js"
        ).then(result => {
          this.loadAsync(
            "https://widgets.saccustomwidgets.com/widgets/mohan/moment.min.js"
          ).then(result => {
            this.dispatchEvent(
              new CustomEvent("propertiesChanged", {
                detail: {
                  properties: {
                    startDate: moment().format("MM/DD/YYYY"),
                    endDate: moment().format("MM/DD/YYYY")
                  }
                }
              })
            );
            this.loadAsync(
              "https://widgets.saccustomwidgets.com/widgets/mohan/jQuery/daterangepicker-custom.js"
            ).then(result => {
              jQry(input).daterangepicker({
                parentEl: div,
                shadowRoot: this._shadowRoot,
                parent: this,
                calRefElement: jQry(this).parent().parent().parent().parent()
              });

              jQry(input).on("show.daterangepicker", function(ev, picker) {
                item.setStyle(545, 325);
                item.dispatchEvent(new CustomEvent("onInputClick"));
              });
              jQry(input).on(
                "apply.daterangepicker",
                function(ev, picker) {
                  item.dispatchEvent(
                    new CustomEvent("propertiesChanged", {
                      detail: {
                        properties: {
                          startDate: picker.startDate.format("MM/DD/YYYY"),
                          endDate: picker.endDate.format("MM/DD/YYYY")
                        }
                      }
                    })
                  );
                  item.setStyle(155,32);
                  item.dispatchEvent(new CustomEvent("onApplyClick"));
                }
              );

              jQry(input).on(
                "cancel.daterangepicker",
                function(ev, picker) {
                  item.setStyle(155,32);
                  item.dispatchEvent(new CustomEvent("onCancelClick"));
                }
              );
            });
          });
        });
      }

      loadAsync = src => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        return new Promise((resolve, reject) => {
          this._shadowRoot.appendChild(script);
          script.addEventListener("load", () => {
            resolve(script);
          });
        });
      };

      onCustomWidgetResize(width, height) {
      }

      setWidth(width) {
        jQry(this).parent().parent().parent().parent().css({"width": `${width}px`});
        jQry(this).parent().parent().parent().css({"width": `${width}px`});
      }
      setStyle(width, height) {
        jQry(this).parent().parent().parent().parent().css({"width": `${width}px`,"height": `${height}px`});
        jQry(this).parent().parent().parent().css({"width": `${width}px`,"height": `${height}px`});
      }
      setHeight(height) {
        jQry(this).parent().parent().parent().parent().css({"height": `${height}px`});
        jQry(this).parent().parent().parent().css({"height": `${height}px`});
      }
    }
  );
})();
