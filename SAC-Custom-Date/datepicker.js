(function()  {
    let _shadowRoot;
    let _id;
    let _date;   

    let tmpl = document.createElement("template");
     tmpl.innerHTML = `
     <style>
     </style>
     <div id="ui5_content" name="ui5_content">
       <slot name="content"></slot>
     </div>

    <script id="oView" name="oView" type="sapui5/xmlview">
    <mvc:View
	    controllerName="sap.m.sample.DatePicker.Group"
	    xmlns:mvc="sap.ui.core.mvc"
	    xmlns:l="sap.ui.layout"
        xmlns:m="sap.m"
	   >
	    <m:Panel
		    id ="DatePanel"
		    headerText="Choose Date"
		    width="auto">
		    <m:Label text="" labelFor="dateInput"/>
		    
		<m:DateRangeSelection
			id="dateInput"
			displayFormat="MM/yyyy"
			change="handleChange"/>
	    </m:Panel>
	   
    </mvc:View>
   </script>   
     `;
 
     class DatePicker extends HTMLElement {
         constructor() {
             super(); 
             _shadowRoot = this.attachShadow({
                 mode: "open"
             });
             _shadowRoot.appendChild(tmpl.content.cloneNode(true));

             _id = createGuid();

             _shadowRoot.querySelector("#oView").id = _id + "_oView";

             this._export_settings = {};
             this._export_settings.date = "";

             this.addEventListener("click", event => {
               
                 console.log('click');
             });


                 
         }
 
         //Fired when the widget is added to the html DOM of the page
         connectedCallback() {
             try {
                 if (window.commonApp) {
                     let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                     if (outlineContainer && outlineContainer.getReactProps) {
                         let parseReactState = state => {
                             let components = {};

                             let globalState = state.globalState;
                             let instances = globalState.instances;
                             let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                             let names = app.names;

                             for (let key in names) {
                                 let name = names[key];

                                 let obj = JSON.parse(key).pop();
                                 let type = Object.keys(obj)[0];
                                 let id = obj[type];

                                 components[id] = {
                                     type: type,
                                     name: name
                                 };
                             }

                             for (let componentId in components) {
                                 let component = components[componentId];
                             }

                             let metadata = JSON.stringify({
                                 components: components,
                                 vars: app.globalVars
                             });

                             if (metadata != this.metadata) {
                                 this.metadata = metadata;

                                 this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                     detail: {
                                         properties: {
                                             metadata: metadata
                                         }
                                     }
                                 }));
                             }
                         };

                         let subscribeReactStore = store => {
                             this._subscription = store.subscribe({
                                 effect: state => {
                                     parseReactState(state);
                                     return {
                                         result: 1
                                     };
                                 }
                             });
                         };

                         let props = outlineContainer.getReactProps();
                         if (props) {
                             subscribeReactStore(props.store);
                         } else {
                             let oldRenderReactComponent = outlineContainer.renderReactComponent;
                             outlineContainer.renderReactComponent = e => {
                                 let props = outlineContainer.getReactProps();
                                 subscribeReactStore(props.store);

                                 oldRenderReactComponent.call(outlineContainer, e);
                             }
                         }
                     }
                 }
             } catch (e) { }
         }
 
          //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
         disconnectedCallback() {
             if (this._subscription) {
                 this._subscription();
                 this._subscription = null;
             }
         
         }
 
          //When the custom widget is updated, the Custom Widget SDK framework executes this function first
         onCustomWidgetBeforeUpdate(oChangedProperties) {
             if ("designMode" in oChangedProperties) {
                 this._designMode = oChangedProperties["designMode"];
             }
 
         }
 
         //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
         onCustomWidgetAfterUpdate(oChangedProperties) {
             loadthis(this);  
         }


         _firePropertiesChanged() {
             this.date = "";
             this.dispatchEvent(new CustomEvent("propertiesChanged", {
                 detail: {
                     properties: {
                         date: this.date
                     }
                 }
             }));
         }
         // SETTINGS
         get date() {
             return this._export_settings.date;
         }

         set date(value) {
             value = _date;
             this._export_settings.date = value;
         }
         static get observedAttributes() {
             return [
                 "date"
             ];
         }
         attributeChangedCallback(name, oldValue, newValue) {
             if (oldValue != newValue) {
                 this[name] = newValue;
             }
         }
         
     }
    customElements.define("com-sap-sac-datepicker", DatePicker);

    // UTILS
    function loadthis(that) {
        var that_ = that;

        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function () {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller"
            ], function (jQuery, Controller) {
                "use strict";

                return Controller.extend("sap.m.sample.DatePicker.Group", {
                    onButtonPressed: function (oEvent) {
                        console.log(oView.byId("dateInput").getDateValue());
                        _date = oView.byId("dateInput").getDateValue().toString();
                        that._firePropertiesChanged();
                        console.log(_date);

                        this.settings = {};
                        this.settings.date = "";

                        that.dispatchEvent(new CustomEvent("onStart", {
                            detail: {
                                settings: this.settings
                            }
                        }));
                    }
                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
            });
            oView.placeAt(content);

           
            if (that_._designMode) {
                oView.byId("dateInput").setEnabled(false);
            }
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }  
})();