(function () {
    let _shadowRoot;
    let div;
    let widgetName;
    let _unit;
    let _item;
    let _itemdec;
    let _LEVEL;
    let _PARENTID;
    let _NODEID;
    let _BU;
    let _GAN;
    let _pnodename;
    var Ar = [];
    let _filterparent = [];
    let _filternode = [];
    let _filtervalue = [];
    var _setModeInfo = [1, 1, 1];
    let _dfnumber = [];
    let _dfdesc = [];
    let IDNum = [3, 3, 3];
    let IDNum1 = [0, 0, 0];
    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------  Start: Template Creation  ------------------------------------- */

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
    <div id="first" ></div>
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
            this.item = "";
            this.itemdec = "";
            this.level = "";
            this.parentid = "";
            this.nodeid = "";
            this.bu = "";
            this.pnodename = "";
            this.granularity = "";

            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        unit: this.unit,
                        item: this.item,
                        itemdec: this.itemdec,
                        level: this.level,
                        parentid: this.parentid,
                        nodeid: this.nodeid,
                        bu: this.bu,
                        pnodename: this.pnodename,
                        granularity: this.granularity
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

        get item() {
            return this._export_settings.item;
        }
        set item(value) {
            value = _item;
            this._export_settings.item = value;
        }

        get itemdec() {
            return this._export_settings.itemdec;
        }
        set itemdec(value) {
            value = _itemdec;
            this._export_settings.itemdec = value;
        }

        get footer() {
            return this._export_settings.footer;
        }
        set footer(value) {
            this._export_settings.footer = value;
        }

        get level() {
            return this._export_settings.level;
        }
        set level(value) {
            value = _LEVEL;
            this._export_settings.level = value;
        }

        get parentid() {
            return this._export_settings.parentid;
        }
        set parentid(value) {
            value = _PARENTID;
            this._export_settings.parentid = value;
        }

        get nodeid() {
            return this._export_settings.nodeid;
        }
        set nodeid(value) {
            value = _NODEID;
            this._export_settings.nodeid = value;
        }

        get bu() {
            return this._export_settings.bu;
        }
        set bu(value) {
            value = _BU;
            this._export_settings.bu = value;
        }

        get pnodename() {
            return this._export_settings.pnodename;
        }
        set pnodename(value) {
            value = _pnodename;
            this._export_settings.pnodename = value;
        }

        get granularity() {
            return this._export_settings.granularity;
        }
        set granularity(value) {
            value = _GAN;
            this._export_settings.granularity = value;
        }

        static get observedAttributes() {
            return [
                "unit",
                "footer",
                "item"
            ];
        }
    }

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------End: Main Class ------------------------------------- */

    customElements.define("com-ds-final-sap-sac-alive", MultiInput);


    function loadthis(that, changedProperties) {

        var that_ = that;
        widgetName = changedProperties.widgetName;

        /*--------------------------------------------------------------------------------------------------------------- */
        /*--------------------------Start: Data from SAC and prepare for JSON Model ------------------------------------- */
        /*--------------------------------------------------------------------------------------------------------------- */

        var a = changedProperties.footer;

        // console.log(a);

        var rowData = [[], [], [], [], [], [], [], []];

        for (var i = 0; i < a.length; i++) {

            switch (a[i].LEVEL.id) {
                case '1':
                    rowData[0].push(a[i]);
                    break;
                case '2':
                    rowData[1].push(a[i]);
                    break;
                case '3':
                    rowData[2].push(a[i]);
                    break;
                case '4':
                    rowData[3].push(a[i]);
                    break;
                case '5':
                    rowData[4].push(a[i]);
                    break;
                case '6':
                    rowData[5].push(a[i]);
                    break;
                case '7':
                    rowData[6].push(a[i]);
                    break;
                case '8':
                    rowData[7].push(a[i]);
                    break;
            }
        }

        // console.log(rowData);

        var data = [];
        var count = 0;
        var filterparent = [];
        var filternode = [];
        var filtervalue = [];
        var nodenm = changedProperties.default;
        var dfcount = 0;
        var dfnumber = [];
        var dfdesc = [];

        // console.log(rowData);

        if (rowData.length > 0) {

            for (var a = 0; a < rowData[0].length; a++) {

                var nodeid0 = rowData[0][a].NODENAME.id;
                var node0 = { text: rowData[0][a].DESCRIPTION.id, nodeid: nodeid0 };
                var id0 = rowData[0][a].NODEID.id;
                node0.nodes = [];
                var child0 = '';
                var pc0 = 0;
                dfcount++;
                for (var a0 = 0; a0 < nodenm.length; a0++) {
                    if (nodenm[a0] === nodeid0) {
                        dfnumber.push(dfcount - 1);
                        dfdesc.push(rowData[0][a].DESCRIPTION.id);
                    }
                }

                for (var b = 0; b < rowData[1].length; b++) {

                    if (rowData[1][b].PARENTID.id === id0) {

                        var nodeid1 = rowData[1][b].NODENAME.id;
                        var node1 = { text: rowData[1][b].DESCRIPTION.id, nodeid: nodeid1 };
                        var id1 = rowData[1][b].NODEID.id;
                        node1.nodes = [];
                        pc0 = pc0 + 1;
                        var child1 = '';
                        var pc1 = 0;
                        dfcount++;
                        for (var a1 = 0; a1 < nodenm.length; a1++) {
                            if (nodenm[a1] === nodeid1) {
                                dfnumber.push(dfcount - 1);
                                dfdesc.push(rowData[1][b].DESCRIPTION.id);
                            }
                        }

                        for (var c = 0; c < rowData[2].length; c++) {

                            if (rowData[2][c].PARENTID.id === id1) {

                                var nodeid2 = rowData[2][c].NODENAME.id;
                                var node2 = { text: rowData[2][c].DESCRIPTION.id, nodeid: nodeid2 };
                                var id2 = rowData[2][c].NODEID.id;
                                node2.nodes = [];
                                pc1 = pc1 + 1;
                                var child2 = '';
                                var pc2 = 0;
                                dfcount++;
                                for (var a2 = 0; a2 < nodenm.length; a2++) {
                                    if (nodenm[a2] === nodeid2) {
                                        dfnumber.push(dfcount - 1);
                                        dfdesc.push(rowData[2][c].DESCRIPTION.id);
                                    }
                                }


                                for (var d = 0; d < rowData[3].length; d++) {

                                    if (rowData[3][d].PARENTID.id === id2) {

                                        var nodeid3 = rowData[3][d].NODENAME.id;
                                        var node3 = { text: rowData[3][d].DESCRIPTION.id, nodeid: nodeid3 };
                                        var id3 = rowData[3][d].NODEID.id;
                                        node3.nodes = [];
                                        pc2 = pc2 + 1;
                                        var child3 = '';
                                        var pc3 = 0;
                                        dfcount++;
                                        for (var a3 = 0; a3 < nodenm.length; a3++) {
                                            if (nodenm[a3] === nodeid3) {
                                                dfnumber.push(dfcount - 1);
                                                dfdesc.push(rowData[3][d].DESCRIPTION.id);
                                            }
                                        }

                                        for (var e = 0; e < rowData[4].length; e++) {

                                            if (rowData[4][e].PARENTID.id === id3) {

                                                var nodeid4 = rowData[4][e].NODENAME.id;
                                                var node4 = { text: rowData[4][e].DESCRIPTION.id, nodeid: nodeid4 };
                                                var id4 = rowData[4][e].NODEID.id;
                                                node4.nodes = [];
                                                pc3 = pc3 + 1;
                                                var child4 = '';
                                                var pc4 = 0;
                                                dfcount++;
                                                for (var a4 = 0; a4 < nodenm.length; a4++) {
                                                    if (nodenm[a4] === nodeid4) {
                                                        dfnumber.push(dfcount - 1);
                                                        dfdesc.push(rowData[4][e].DESCRIPTION.id);
                                                    }
                                                }

                                                for (var f = 0; f < rowData[5].length; f++) {

                                                    if (rowData[5][f].PARENTID.id === id4) {

                                                        var nodeid5 = rowData[5][f].NODENAME.id;
                                                        var node5 = { text: rowData[5][f].DESCRIPTION.id, nodeid: nodeid5 };
                                                        var id5 = rowData[5][f].NODEID.id;
                                                        node5.nodes = [];
                                                        pc4 = pc4 + 1;
                                                        var child5 = '';
                                                        var pc5 = 0;
                                                        dfcount++;
                                                        for (var a5 = 0; a5 < nodenm.length; a5++) {
                                                            if (nodenm[a5] === nodeid5) {
                                                                dfnumber.push(dfcount - 1);
                                                                dfdesc.push(rowData[5][f].DESCRIPTION.id);
                                                            }
                                                        }

                                                        for (var g = 0; g < rowData[6].length; g++) {

                                                            if (rowData[6][g].PARENTID.id === id5) {

                                                                var nodeid6 = rowData[6][g].NODENAME.id;
                                                                var node6 = { text: rowData[6][g].DESCRIPTION.id, nodeid: nodeid6 };
                                                                var id6 = rowData[6][g].NODEID.id;
                                                                node6.nodes = [];
                                                                pc5 = pc5 + 1;
                                                                var child6 = '';
                                                                var pc6 = 0;
                                                                dfcount++;
                                                                for (var a6 = 0; a6 < nodenm.length; a6++) {
                                                                    if (nodenm[a6] === nodeid6) {
                                                                        dfnumber.push(dfcount - 1);
                                                                        dfdesc.push(rowData[6][g].DESCRIPTION.id);
                                                                    }
                                                                }

                                                                for (var h = 0; h < rowData[7].length; h++) {

                                                                    if (rowData[7][h].PARENTID.id === id6) {

                                                                        var nodeid7 = rowData[7][h].NODENAME.id;
                                                                        var node7 = { text: rowData[7][h].DESCRIPTION.id, nodeid: nodeid7 };
                                                                        var id7 = rowData[7][h].NODEID.id;
                                                                        node7.nodes = [];
                                                                        pc6 = pc6 + 1;
                                                                        var child7 = '';
                                                                        dfcount++;
                                                                        for (var a7 = 0; a7 < nodenm.length; a7++) {
                                                                            if (nodenm[a7] === nodeid7) {
                                                                                dfnumber.push(dfcount - 1);
                                                                                dfdesc.push(rowData[7][h].DESCRIPTION.id);
                                                                            }
                                                                        }

                                                                        child0 = child0 + ',' + nodeid7;
                                                                        child1 = child1 + ',' + nodeid7;
                                                                        child2 = child2 + ',' + nodeid7;
                                                                        child3 = child3 + ',' + nodeid7;
                                                                        child4 = child4 + ',' + nodeid7;
                                                                        child5 = child5 + ',' + nodeid7;
                                                                        child6 = child6 + ',' + nodeid7;
                                                                        child7 = child7 + ',' + nodeid7;

                                                                        var otherinfo7 = {
                                                                            LEVEL: rowData[7][h].LEVEL.id, BU: rowData[7][h].BU.id,
                                                                            PARENTID: rowData[7][h].PARENTID.id, NODEID: rowData[7][h].NODEID.id,
                                                                            PARENTNAME: rowData[6][g].DESCRIPTION.id, GRANULARITY: rowData[7][h].GRANULARITY.id
                                                                        }

                                                                        filterparent.push(otherinfo7);
                                                                        filternode.push(nodeid7);
                                                                        filtervalue.push(child7);
                                                                        count++;

                                                                        node6.nodes.push(node7);

                                                                    }
                                                                }

                                                                if (pc6 === 0) {

                                                                    child0 = child0 + ',' + nodeid6;
                                                                    child1 = child1 + ',' + nodeid6;
                                                                    child2 = child2 + ',' + nodeid6;
                                                                    child3 = child3 + ',' + nodeid6;
                                                                    child4 = child4 + ',' + nodeid6;
                                                                    child5 = child5 + ',' + nodeid6;
                                                                    child6 = child6 + ',' + nodeid6;

                                                                }

                                                                var otherinfo6 = {
                                                                    LEVEL: rowData[6][g].LEVEL.id, BU: rowData[6][g].BU.id,
                                                                    PARENTID: rowData[6][g].PARENTID.id, NODEID: rowData[6][g].NODEID.id,
                                                                    PARENTNAME: rowData[5][f].DESCRIPTION.id, GRANULARITY: rowData[6][g].GRANULARITY.id
                                                                }

                                                                filterparent.push(otherinfo6);
                                                                filternode.push(nodeid6);
                                                                filtervalue.push(child6);
                                                                count++;

                                                                node5.nodes.push(node6);


                                                            }
                                                        }
                                                        if (pc5 === 0) {

                                                            child0 = child0 + ',' + nodeid5;
                                                            child1 = child1 + ',' + nodeid5;
                                                            child2 = child2 + ',' + nodeid5;
                                                            child3 = child3 + ',' + nodeid5;
                                                            child4 = child4 + ',' + nodeid5;
                                                            child5 = child5 + ',' + nodeid5;

                                                        }

                                                        var otherinfo5 = {
                                                            LEVEL: rowData[5][f].LEVEL.id, BU: rowData[5][f].BU.id,
                                                            PARENTID: rowData[5][f].PARENTID.id, NODEID: rowData[5][f].NODEID.id,
                                                            PARENTNAME: rowData[4][e].DESCRIPTION.id, GRANULARITY: rowData[5][f].GRANULARITY.id
                                                        }

                                                        filterparent.push(otherinfo5);
                                                        filternode.push(nodeid5);
                                                        filtervalue.push(child5);
                                                        count++;

                                                        node4.nodes.push(node5);
                                                    }
                                                }
                                                if (pc4 === 0) {

                                                    child0 = child0 + ',' + nodeid4;
                                                    child1 = child1 + ',' + nodeid4;
                                                    child2 = child2 + ',' + nodeid4;
                                                    child3 = child3 + ',' + nodeid4;
                                                    child4 = child4 + ',' + nodeid4;

                                                }

                                                var otherinfo4 = {
                                                    LEVEL: rowData[4][e].LEVEL.id, BU: rowData[4][e].BU.id,
                                                    PARENTID: rowData[4][e].PARENTID.id, NODEID: rowData[4][e].NODEID.id,
                                                    PARENTNAME: rowData[3][d].DESCRIPTION.id, GRANULARITY: rowData[4][e].GRANULARITY.id
                                                }

                                                filterparent.push(otherinfo4);
                                                filternode.push(nodeid4);
                                                filtervalue.push(child4);
                                                count++;

                                                node3.nodes.push(node4);

                                            }
                                        }
                                        if (pc3 === 0) {

                                            child0 = child0 + ',' + nodeid3;
                                            child1 = child1 + ',' + nodeid3;
                                            child2 = child2 + ',' + nodeid3;
                                            child3 = child3 + ',' + nodeid3;

                                        }

                                        var otherinfo3 = {
                                            LEVEL: rowData[3][d].LEVEL.id, BU: rowData[3][d].BU.id,
                                            PARENTID: rowData[3][d].PARENTID.id, NODEID: rowData[3][d].NODEID.id,
                                            PARENTNAME: rowData[2][c].DESCRIPTION.id, GRANULARITY: rowData[3][d].GRANULARITY.id
                                        }

                                        filterparent.push(otherinfo3);
                                        filternode.push(nodeid3);
                                        filtervalue.push(child3);
                                        count++;

                                        node2.nodes.push(node3);

                                    }
                                }
                                if (pc2 === 0) {

                                    child0 = child0 + ',' + nodeid2;
                                    child1 = child1 + ',' + nodeid2;
                                    child2 = child2 + ',' + nodeid2;

                                } var otherinfo2 = {
                                    LEVEL: rowData[2][c].LEVEL.id, BU: rowData[2][c].BU.id,
                                    PARENTID: rowData[2][c].PARENTID.id, NODEID: rowData[2][c].NODEID.id,
                                    PARENTNAME: rowData[1][b].DESCRIPTION.id, GRANULARITY: rowData[2][c].GRANULARITY.id
                                }

                                filterparent.push(otherinfo2);
                                filternode.push(nodeid2);
                                filtervalue.push(child2);
                                count++;

                                node1.nodes.push(node2);
                            }
                        }

                        if (pc1 === 0) {

                            child0 = child0 + ',' + nodeid1;
                            child1 = child1 + ',' + nodeid1;

                        } var otherinfo1 = {
                            LEVEL: rowData[1][b].LEVEL.id, BU: rowData[1][b].BU.id,
                            PARENTID: rowData[1][b].PARENTID.id, NODEID: rowData[1][b].NODEID.id,
                            PARENTNAME: rowData[0][a].DESCRIPTION.id, GRANULARITY: rowData[1][b].GRANULARITY.id
                        }

                        filterparent.push(otherinfo1);
                        filternode.push(nodeid1);
                        filtervalue.push(child1);
                        count++;

                        node0.nodes.push(node1);
                    }
                }
                if (pc0 === 0) {

                    child0 = child0 + ',' + nodeid0;

                } var otherinfo0 = {
                    LEVEL: rowData[0][a].LEVEL.id, BU: rowData[0][a].BU.id,
                    PARENTID: rowData[0][a].PARENTID.id, NODEID: rowData[0][a].NODEID.id,
                    PARENTNAME: "root", GRANULARITY: rowData[0][a].GRANULARITY.id
                }

                filterparent.push(otherinfo0);
                filternode.push(nodeid0);
                filtervalue.push(child0);
                count++;

                data.push(node0);

            }

            // console.log(filterparent);

            _filterparent[that.widgetno - 1] = filterparent;
            _filternode[that.widgetno - 1] = filternode;
            _filtervalue[that.widgetno - 1] = filtervalue;
            _dfnumber[that.widgetno - 1] = dfnumber;
            _setModeInfo[that.widgetno] = 1;
            _dfdesc[that.widgetno - 1] = dfdesc;

            // console.log("Widget:");
            // console.log(that.widgetName);

            // console.log("Filternode:");
            // console.log(_filternode);

            // console.log("Filtervalue:");
            // console.log(_filtervalue);

            // console.log("DFNumber:");
            // console.log(_dfnumber);

        }

        /*--------------------------------------------------------------------------------------------------------------- */
        /*--------------------------End: Data from SAC and prepare for JSON Model ------------------------------------- */
        /*--------------------------------------------------------------------------------------------------------------- */

        div = document.createElement('div');
        // div.setAttribute("style", "position:fixed;");
        div.slot = "content_" + widgetName;

        let div0 = document.createElement('div');
        
        div0.innerHTML = '<link rel="stylesheet" href="https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/Final_Dropdown.css"> <script  id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">  <Tree id="Tree" sticky="HeaderToolbar"  items="{' + widgetName + '>/}" mode=""  selectionChange="onSelect"  includeItemInSelection="true"  updateFinished="onDefaultSelction" > <headerToolbar> <OverflowToolbar> <Input  width="93%" placeholder="Type to search" value="{search/query}" liveChange="onLiveChange" showSuggestion="true" showClearIcon="true" /> </OverflowToolbar> </headerToolbar><StandardTreeItem class="" title="{' + widgetName + '>text}" selected="{selected}"/> </Tree></mvc:View></script>'
        
        // div0.innerHTML = '<link rel="stylesheet" href="https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/Final_Dropdown.css"> <script  id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View  controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">  <Tree id="Tree" items="{' + widgetName + '>/}" mode=""  selectionChange="onSelect"  includeItemInSelection="true"  updateFinished="onDefaultSelction" > <headerToolbar> <OverflowToolbar> <SearchField id="search" width="93%" value="{search>/query}" showSearchButton="true"  search="hitsearch" liveChange="onLiveChange" /> </OverflowToolbar> </headerToolbar><StandardTreeItem class="" title="{' + widgetName + '>text}" selected="{selected}"/> </Tree></mvc:View></script>'
        // div0.innerHTML = '<link rel="stylesheet" href="https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/Final_Dropdown.css"> <script  id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View  controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"> <Tree  class="customColor"  id="Tree" items="{' + widgetName + '>/}" mode="MultiSelect"  selectionChange="onSelect"  includeItemInSelection="true" updateFinished="onDefaultSelction" > <headerToolbar><OverflowToolbar> <SearchField  width="93%" value="{search>/query}" liveChange="onLiveChange" /> </OverflowToolbar> </headerToolbar><StandardTreeItem class="customColor" title="{' + widgetName + '>text}" selected="{selected}"/></Tree></mvc:View></script>'
        // div0.innerHTML = '<div class="customColor">  <link rel="stylesheet" href="https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/Final_Dropdown.css"> <script  id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View  controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"> <Tree  class="customColor"  id="Tree" items="{' + widgetName + '>/}" mode="MultiSelect"  selectionChange="onSelect"  includeItemInSelection="true" updateFinished="onDefaultSelction" > <headerToolbar><OverflowToolbar> <SearchField  width="93%" value="{search>/query}" liveChange=".onLiveChange" /> </OverflowToolbar> </headerToolbar><StandardTreeItem class="customColor" title="{' + widgetName + '>text}" selected="{selected}"/></Tree></mvc:View></script></div>'
        _shadowRoot.appendChild(div0); 

        if (that._firstConnection === 1) {
        } else {
            let div2 = document.createElement('div');
            div2.innerHTML = '<div  class="" style="max-height: 550px; overflow-y: auto; " id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"> </slot></div>';
            _shadowRoot.appendChild(div2);
            that._firstConnection = 1;
        }
        that_.appendChild(div);

        var mapcanvas_divstr = _shadowRoot.getElementById('oView' + widgetName);

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
                        onInit: function (event) {

                         console.log(IDNum1[that.widgetno]);

                          if(IDNum1[that.widgetno]>0){  

                            switch (that.widgetno) {
                                case 1:
                                    if (sap.ui.getCore().byId("__xmlview1--Tree").getSelectedItems().length > 0) {
                                        sap.ui.getCore().byId("__xmlview1--Tree").removeSelections();
                                    }
                                    break;
                                case 2:
                                    if (sap.ui.getCore().byId("__xmlview2--Tree").getSelectedItems().length > 0) {
                                        sap.ui.getCore().byId("__xmlview2--Tree").removeSelections();
                                    }
                                    break;
                                case 3:
                                    if (sap.ui.getCore().byId("__xmlview3--Tree").getSelectedItems().length > 0) {
                                        sap.ui.getCore().byId("__xmlview3--Tree").removeSelections();
                                    }
                                    break;
                                case 4:
                                    if (sap.ui.getCore().byId("__xmlview4--Tree").getSelectedItems().length > 0) {
                                        sap.ui.getCore().byId("__xmlview4--Tree").removeSelections();
                                    }
                                    break;
                            }
                        }
                        IDNum1[that.widgetno] += 1;
                            

                            var oModel = new JSONModel(data);
                            sap.ui.getCore().setModel(oModel, that.widgetName);
                        },

                        onLiveChange: function (event) {

                            console.log("Search");
                            var query = event.getParameter("newValue").trim();
                            this.byId("Tree").getBinding("items").filter(query ? new sap.ui.model.Filter({
                                path: "text",
                                operator: "Contains",
                                value1: query,
                            }) : null);
                            this.byId("Tree").expandToLevel(9999);
                        },

                        hitsearch: function (event) {

                            console.log("Search");
                            var query = event.getSource().getValue();

                            this.byId("Tree").getBinding("items").filter(query ? new sap.ui.model.Filter({
                                path: "text",
                                operator: "Contains",
                                value1: query,
                            }) : null);
                            this.byId("Tree").expandToLevel(9999);
                        },

                        onDefaultSelction: function (event) {

                            if (IDNum[that.widgetno]) {
                                this.byId("Tree").setMode(that.setmode);
                                this.byId("Tree").expandToLevel(9999);

                                IDNum[that.widgetno] -= 1;

                            }

                            if (that.widgetName && that.setmode && _setModeInfo[that.widgetno]) {

                                // IDNum = IDNum + 1;
                                // console.log("IDNUM________________________");
                                // this.byId("Tree").sticky(true);

                                dfnumber = _dfnumber[that.widgetno - 1];
                                if (dfnumber.length > 0) {
                                    this.byId("Tree").expandToLevel(9999);
                                    filterparent = _filterparent[that.widgetno - 1];
                                    filtervalue = _filtervalue[that.widgetno - 1];
                                    filternode = _filternode[that.widgetno - 1];
                                    dfdesc = _dfdesc[that.widgetno - 1];
                                    var schild = "";
                                    var listselected = [];
                                    var listselecteddec = [];
                                    var nodeperent = [];
                                    var level_1 = [];
                                    var parentid_1 = [];
                                    var nodeid_1 = [];
                                    var bu_1 = [];
                                    var gan_1 = [];
                                    
                                    this.getView().byId("Tree").getItems()[3].setBolcked(true);
                                    
                                    for (var i = 0; i < dfnumber.length; i++) {
                                        this.byId("Tree").getItems()[dfnumber[i]].setSelected(true);
                                        var snode = that.default[i];
                                        listselected.push(snode);
                                        listselecteddec.push(dfdesc[i]);

                                        for (var x = 0; x < filternode.length; x++) {
                                            if (snode === filternode[x]) {
                                                schild += filtervalue[x];
                                                nodeperent.push(filterparent[x].PARENTNAME);
                                                level_1.push(filterparent[x].LEVEL);
                                                nodeid_1.push(filterparent[x].NODEID);
                                                parentid_1.push(filterparent[x].PARENTID);
                                                bu_1.push(filterparent[x].BU);
                                                gan_1.push(filterparent[x].GRANULARITY);
                                            }
                                        }

                                    }
                                    _unit = schild.substr(1, schild.length).split(",");

                                    _item = listselected;
                                    _itemdec = listselecteddec;
                                    _pnodename = nodeperent;
                                    _LEVEL = level_1;
                                    _NODEID = nodeid_1;
                                    _PARENTID = parentid_1;
                                    _BU = bu_1;
                                    _GAN = gan_1;

                                    that._firePropertiesChanged();
                                }
                                _setModeInfo[that.widgetno] = 0;
                            }

                            // $('.sapMIBar, .sapMListHdr').css('background-color', 'white');
                            // $('.sapMTreeItemBaseChildren').css('cursor', 'not-allowed');
                            // $('.sapMListItems ').css('pointer-events', 'none');
                            // $('.sapMTreeItemBaseChildren').addClass("disablebutton");
                            // $('Tree').css('max-height','550 px');
                            // $('.scrollbar-hidden::-webkit-scrollbar').css('display','none');
                            // var z = 0;

                            // for(var z=0; z<100; z++){
                                // $('#__item'+z+'__xmlview11--Tree-0').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item28-__xmlview1--Tree-0').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item28-__xmlview1--Tree-4').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item28-__xmlview1--Tree-0').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item28-__xmlview1--Tree-1').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item32-__xmlview1--Tree-1').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item32-__xmlview1--Tree-2').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item32-__xmlview1--Tree-4').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item32-__xmlview1--Tree-0').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item60-__xmlview1--Tree-1').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item60-__xmlview1--Tree-2').css({ "pointer-events": "none","color": "lightgray"});
                                // $('#__item60-__xmlview1--Tree-4').css({ "pointer-events": "none","color": "lightgray"});
                            // }
                        
                           

                            
                        },

                        onSelect: function (oEvent) {

                            var listselected = [];
                            var listselecteddec = [];
                            var schild = "";
                            var nodeperent = [];
                            var level_1 = [];
                            var parentid_1 = [];
                            var nodeid_1 = [];
                            var bu_1 = [];
                            var gan_1 = [];
                            filterparent = _filterparent[that.widgetno - 1];
                            filtervalue = _filtervalue[that.widgetno - 1];
                            filternode = _filternode[that.widgetno - 1];

                            for (var i = 0; i < this.getView().byId("Tree").getSelectedItems().length; i++) {
                                var snode = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject().nodeid;
                                var tnode = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject().text;
                                listselected.push(snode);
                                listselecteddec.push(tnode);

                                for (var x = 0; x < filternode.length; x++) {
                                    if (snode === filternode[x]) {
                                        schild += filtervalue[x];
                                        nodeperent.push(filterparent[x].PARENTNAME);
                                        level_1.push(filterparent[x].LEVEL);
                                        nodeid_1.push(filterparent[x].NODEID);
                                        parentid_1.push(filterparent[x].PARENTID);
                                        bu_1.push(filterparent[x].BU);
                                        gan_1.push(filterparent[x].GRANULARITY);
                                    }
                                }
                            }

                            nodeperent = nodeperent.filter((c, index) => {
                                return nodeperent.indexOf(c) === index;
                            });

                            var _unit1 = schild.substr(1, schild.length).split(",");

                            _unit = _unit1.filter((c, index) => {
                                return _unit1.indexOf(c) === index;
                            });

                            _item = listselected;
                            _itemdec = listselecteddec;
                            _pnodename = nodeperent;
                            _LEVEL = level_1;
                            _NODEID = nodeid_1;
                            _PARENTID = parentid_1;
                            _BU = bu_1;
                            _GAN = gan_1;
                            that._firePropertiesChanged();
                        }

                    });

                    return PageController;

                });

            // console.log("widgetName Final:" + Ar[0]);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);

            // console.log("[FOUND INDEX]", foundIndex, Ar[foundIndex]);
            var divfinal = Ar[foundIndex].div;

            // console.log(divfinal);

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

})();