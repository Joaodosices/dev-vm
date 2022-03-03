(function () {
    let _shadowRoot;
    let div;
    let widgetName;
    let _unit;
    var Ar = [];

 /*--------------------------------------------------------------------------------------------------------------- */
 /*--------------------------  Start: Template Creation  ------------------------------------- */ 

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
       
    `;

 /*--------------------------  End: Template Creation  ------------------------------------- */ 
 /*--------------------------------------------------------------------------------------------------------------- */


 /*--------------------------------------------------------------------------------------------------------------- */
 /*--------------------------Start: Main Class  ------------------------------------- */ 

    class MultiInput extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._export_settings = {};

            
            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);
                console.log('click');

            });

            this._firstConnection = 0;
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            loadthis(that, changedProperties);
        }

        _firePropertiesChanged() {
            this.unit = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        unit: this.unit
                    }
                }
            }));
        }

        get unit() {
            return this._export_settings.unit;
        }
        set unit(value) {
            value = _unit;
            this._export_settings.unit = value;
        }

        get footer() {
            return this._export_settings.footer;
        }
        set footer(value) {
            this._export_settings.footer = value;
        }

        static get observedAttributes() {
            return [
                "unit",
                "footer"
            ];
        }
    }

 /*--------------------------------------------------------------------------------------------------------------- */
 /*--------------------------End: Main Class ------------------------------------- */ 

    customElements.define("com-ds-dsds-sap-sac-mu", MultiInput);


    function loadthis(that, changedProperties) {

        var that_ = that;
        widgetName = changedProperties.widgetName;

 /*--------------------------------------------------------------------------------------------------------------- */
 /*--------------------------Start: Data from SAC and prepare for JSON Model ------------------------------------- */ 
 /*--------------------------------------------------------------------------------------------------------------- */

        var rowData = changedProperties.footer;

        var data = [];

        if (rowData.length > 0) {

            for (var a = 0; a < rowData[0].length; a++) {

                var node0 = { text: rowData[0][a].Description_a5y1o06718.id };
                var id0 = rowData[0][a].NODEID.id;
                node0.nodes = [];

                for (var b = 0; b < rowData[1].length; b++) {

                    if (rowData[1][b].PARENTID.id === id0) {

                        var node1 = { text: rowData[1][b].Description_a5y1o06718.id };
                        var id1 = rowData[1][b].NODEID.id;
                        node1.nodes = [];

                        for (var c = 0; c < rowData[2].length; c++) {

                            if (rowData[2][c].PARENTID.id === id1) {

                                var node2 = { text: rowData[2][c].Description_a5y1o06718.id };
                                var id2 = rowData[2][c].NODEID.id;
                                node2.nodes = [];

                                for (var d = 0; d < rowData[3].length; d++) {

                                    if (rowData[3][d].PARENTID.id === id2) {

                                        var node3 = { text: rowData[3][d].Description_a5y1o06718.id };
                                        var id3 = rowData[3][d].NODEID.id;
                                        node3.nodes = [];

                                        for (var e = 0; e < rowData[4].length; e++) {

                                            if (rowData[4][e].PARENTID.id === id3) {

                                                var node4 = { text: rowData[4][e].Description_a5y1o06718.id };
                                                var id4 = rowData[4][e].NODEID.id;
                                                node4.nodes = [];

                                                for (var f = 0; f < rowData[5].length; f++) {

                                                    if (rowData[5][f].PARENTID.id === id4) {

                                                        var node5 = { text: rowData[5][f].Description_a5y1o06718.id };
                                                        var id5 = rowData[5][f].NODEID.id;
                                                        node5.nodes = [];

                                                        for (var g = 0; g < rowData[6].length; g++) {

                                                            if (rowData[6][g].PARENTID.id === id5) {

                                                                var node6 = { text: rowData[6][g].Description_a5y1o06718.id };
                                                                var id6 = rowData[6][g].NODEID.id;
                                                                node6.nodes = [];

                                                                for (var h = 0; h < rowData[7].length; h++) {

                                                                    if (rowData[7][h].PARENTID.id === id6) {

                                                                        var node7 = { text: rowData[7][h].Description_a5y1o06718.id };
                                                                        var id7 = rowData[7][h].NODEID.id;
                                                                        node7.nodes = [];

                                                                        node6.nodes.push(node7);

                                                                    }
                                                                }

                                                                node5.nodes.push(node6);


                                                            }
                                                        }

                                                        node4.nodes.push(node5);
                                                    }
                                                }

                                                node3.nodes.push(node4);

                                            }
                                        }

                                        node2.nodes.push(node3);

                                    }
                                }

                                node1.nodes.push(node2);
                            }
                        }

                        node0.nodes.push(node1);
                    }
                }

                data.push(node0);

            }
            console.log(data);
        }

 /*--------------------------------------------------------------------------------------------------------------- */
 /*--------------------------End: Data from SAC and prepare for JSON Model ------------------------------------- */ 
 /*--------------------------------------------------------------------------------------------------------------- */


        div = document.createElement('div');
        // div.setAttribute("style", "position:fixed;");
        div.slot = "content_" + widgetName;

        let div0 = document.createElement('div');
        
        // Custom Tree Selection
        div0.innerHTML = '<script id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><SearchField width="auto" value="{search>/query}" liveChange=".onLiveChange" /><Tree   id="Tree" items="{Multiinput_1>/}" mode="SingleSelectLeft"  selectionChange="onSelect"  includeItemInSelection="true"><headerToolbar><Toolbar><content><Title text="Brand Hierarchy" level="H2" /><ToolbarSpacer /><Select selectedKey="SingleSelect" change="handleSelectChange"><items><core:Item key="SingleSelectLeft" text="Single Selection" /><core:Item key="MultiSelect" text="Multi Selection" /></items></Select></content></Toolbar></headerToolbar><StandardTreeItem title="{' + widgetName + '>text}"/></Tree></mvc:View></script>'
        _shadowRoot.appendChild(div0);

        if (that._firstConnection === 1) {
        } else {
            let div2 = document.createElement('div');
            div2.innerHTML = '<div style="max-height: 580px; overflow-y: auto;" id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"> </slot></div>';
            _shadowRoot.appendChild(div2);
            that._firstConnection = 1;
        }
        that_.appendChild(div);

        var mapcanvas_divstr = _shadowRoot.getElementById('oView' + widgetName);
        console.log("[MAPCANVAS]", mapcanvas_divstr);

        Ar.push({
            'id': widgetName,
            'div': mapcanvas_divstr
        });

        sap.ui.getCore().attachInit(function () {
            "use strict";

            //### Controller ###
            sap.ui.define(['sap/ui/core/mvc/Controller',
                'sap/ui/model/json/JSONModel'],
                function (Controller, JSONModel) {
                    "use strict";

                    var PageController = Controller.extend("myView.Template", {
                        onInit: function () {


                            console.log(that._export_settings.footer);
                            // set explored app's demo model on this sample
                            var oModel = new JSONModel(data);

                            console.log(oModel);

                            // this.getView().setModel(oModel, that.widgetName);
                            sap.ui.getCore().setModel(oModel, that.widgetName);
                        },
                        onSelect: function (oEvent) {
                            var listselected = ''
                            for (var i = 0; i < this.getView().byId("Tree").getSelectedItems().length; i++) {
                                listselected += this.getView().byId("Tree").getSelectedItems()[i].getBindingContext("Multiinput_1").getObject().text + ","
                            }

                            console.log(listselected);
                            _unit = listselected;
                            // new sap.m.MessageToast.show(_unit)
                            that._firePropertiesChanged();


                            //  console.log(unit);
                        },
                            onLiveChange: function(event) {
                                const query = event.getParameter("newValue").trim();
                                this.byId("Tree").getBinding("items").filter(query ? new sap.ui.model.Filter({
                                path: "text",
                                operator: "Contains",
                                value1: query,
                                }) : null);
                                this.byId("Tree").expandToLevel(9999);
                                },

                        handleSelectChange: function (oEvent) {
                            var mode = oEvent.getParameter("selectedItem").getKey();
                            this.byId("Tree").setMode(mode);
                            console.log(mode);
                        }

                    });

                    return PageController;

                });

            console.log("widgetName Final:" + Ar[0]);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            console.log("[FOUND INDEX]", foundIndex, Ar[foundIndex]);
            var divfinal = Ar[foundIndex].div;
            console.log(divfinal);

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

})();
