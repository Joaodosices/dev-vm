let _rsd = new Date();
let _red = new Date();

(function () {
    // let version = "2.3.1";
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `<link rel="stylesheet" type="text/css" href="https://sac-dev-cw.novartis.net/cw/dev/datepicker-master/light.css"/>`;

    class DatePicker extends HTMLElement {
        constructor() {
            super();
            this.init();
            // this.checkForUpdates();
        }
        
    
        fireChanged() {

            this.range_start= "";
            this.range_end= "";

            var properties = { dateVal: this.DP.getDateValue() };
            if (this._enablerange) { properties.secondDateVal = this.DP.getSecondDateValue(); }
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties,
                    range_start: this.range_start,
                    range_end: this.range_end

                }
            }));
        }

        set dateVal(value) {
            if (value == undefined || !this.DP) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setDateValue(value);
        }

        set secondDateVal(value) {
            if (value == undefined || !this.DP || !this._enablerange) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setSecondDateValue(value);
        }

        set format(value) {
            if (!this.DP) return;
            this.DP.setDisplayFormat(value);
        }

        set darktheme(value) {
            this.querySelector("link").setAttribute("href", "https://widgets.nkappler.de/datepicker/releases/2.3.1/" +
                (value ? "dark.css" : "light.css")
            );
        }

        set enablerange(value) {
            if (value == undefined || !this.DP) return;
            this._enablerange = value;
            this.DP.destroy();
            this.init();
        }

        // get range_start() {
        //     return this._export_settings.range_start;
        // }
        // set range_start(value) {
        //     value = _rsd;
        //     this._export_settings.range_start = value;
        // }

        // get range_end() {
        //     return this._export_settings.range_end;
        // }
        // set range_end(value) {
        //     value = _red;
        //     this._export_settings.range_end = value;
        // }



        init() {
            if (this.children.length === 2) return; //constructor called during drag+drop
            if (!this.querySelector("link")) {
                this.appendChild(tmpl.content.cloneNode(true));
            }

            var ctor = sap.m.DatePicker;
            if (this._enablerange) { ctor = sap.m.DateRangeSelection; }
            this.DP = new ctor({
                change: function () {
                    this.fireChanged();
                    this.dispatchEvent(new Event("onChange"));
                }.bind(this)
            }).addStyleClass("datePicker");

            // console.log("Heeeeeee"+rsd,_rsd,this.rsd);

            this.DP.placeAt(this);
            // this.DP.setMinDate(this.rsd);
            // this.DP.setMaxDate(this.red);

        }
    }

    customElements.define('nkappler-date-picker', DatePicker);
})();
