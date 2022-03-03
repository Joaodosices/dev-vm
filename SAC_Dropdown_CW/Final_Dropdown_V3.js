(function () {
    let _shadowRoot;
    let div;
    let widgetName;
    let _SelectedChild;
    let _SelectedNode;
    let _SelectedNodeDec;
    let _ptid;
    let _ptdec;
    let _FF1;
    let _FF2;
    var Ar = [];
    let _filternode = [];
    let _filtervalue = [];
    let _filterinfo = [];
    let _setModeInfo = [1, 1, 1];
    let _dfnumber = [];
    let _dfdesc = [];
    let _BuilderPanel = [];
    let _dfF1 = [];
    let _dfF2 = [];
    let IDNum = [3, 3, 3];
    let IDNum1 = [0, 0, 0];
    let _FontStyle = [];

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------  Start: Template Creation  ------------------------------------- */

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `<div id="root"></div> `;
    // tmpl.innerHTML = `<div id="root"></div> `;

    /*--------------------------  End: Template Creation  ------------------------------------- */
    /*--------------------------------------------------------------------------------------------------------------- */

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------Start: Main Class  ------------------------------------- */

    class MultiInput extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({ mode: "open" });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));
            // _shadowRoot.getElementById("root");

            this._export_settings = {};

            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);

            });
            this._props = {};
            this._firstConnection = 0;
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            loadthis(that, changedProperties);

        }

        _firePropertiesChanged() {
            this.SelectedChild = "";
            this.SelectedNodeId = "";
            this.SelectedNodeDec = "";
            this.Field1_Value = "";
            this.Field2_Value = "";
            this.ptid = "";
            this.ptdec = "";

            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        SelectedChild: this.SelectedChild,
                        SelectedNodeId: this.SelectedNodeId,
                        SelectedNodeDec: this.SelectedNodeDec,
                        ptid: this.ptid,
                        ptdec: this.ptdec,
                        Field1_Value: this.Field1_Value,
                        Field2_Value: this.Field2_Value
                    }
                }
            }));
        }

        // Get Set property for data return method
        get SelectedChild() {
            return this._export_settings.SelectedChild;
        }
        set SelectedChild(value) {
            value = _SelectedChild;
            this._export_settings.SelectedChild = value;
        }

        get SelectedNodeId() {
            return this._export_settings.SelectedNodeId;
        }
        set SelectedNodeId(value) {
            value = _SelectedNode;
            this._export_settings.SelectedNodeId = value;
        }

        get SelectedNodeDec() {
            return this._export_settings.SelectedNodeDec;
        }
        set SelectedNodeDec(value) {
            value = _SelectedNodeDec;
            this._export_settings.SelectedNodeDec = value;
        }

        get ptid() {
            return this._export_settings.ptid;
        }
        set ptid(value) {
            value = _ptid;
            this._export_settings.ptid = value;
        }

        get ptdec() {
            return this._export_settings.ptdec;
        }
        set ptdec(value) {
            value = _ptdec;
            this._export_settings.ptdec = value;
        }

        get Field1_Value() {
            return this._export_settings.Field1_Value;
        }
        set Field1_Value(value) {
            value = _FF1;
            this._export_settings.Field1_Value = value;
        }

        get Field2_Value() {
            return this._export_settings.Field2_Value;
        }
        set Field2_Value(value) {
            value = _FF2;
            this._export_settings.Field2_Value = value;
        }

        get setdata() {
            return this._export_settings.setdata;
        }
        set setdata(value) {
            this._export_settings.setdata = value;
        }



        static get observedAttributes() {
            return [
                "SelectedChild",
                "setdata",
                "SelectedNodeId"
            ];
        }
    }

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------End: Main Class ------------------------------------- */

    customElements.define("com-ds-finalv3-sap-sac-alive", MultiInput);

    function loadthis(that, changedProperties) {

        var that_ = that;
        widgetName = changedProperties.widgetName;

        /*--------------------------------------------------------------------------------------------------------------- */
        /*--------------------------Start: Data from SAC and prepare for JSON Model ------------------------------------- */
        /*--------------------------------------------------------------------------------------------------------------- */

        var LL = that.LEVEL_col;
        // console.log(LL);
        var PI = that.PARENTID_col;
        // console.log(PI);
        var NI = that.NODEID_col;
        // console.log(NI);
        var TI = that.TEXTID_col;
        // console.log(TI);
        var TD = that.TEXTDEC_col;
        // console.log(TD);

        var a = changedProperties.setdata;

        var rowData = [[], [], [], [], [], [], [], []];

        // Level wise Node Distrubution
        if (a) {
            for (var i = 0; i < a.length; i++) {

                switch (a[i][LL].id) {
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
        }

        //Node Hierarchy Creation based on Paren-Child Relations
        var data = [];
        var count = 0;
        var filternode = [];
        var filtervalue = [];
        var filterinfo = [];
        var nodenm = changedProperties.default;
        var dfcount = 0;
        var dfnumber = [];
        var dfdesc = [];
        var F1 = that.Field1_Name;
        var F2 = that.Field2_Name;
        var dfF1 = [];
        var dfF2 = [];
        var FontStyle = [that.fstyle,that.fsize,that.fbi,that.fcolor]
        _FontStyle[that.widgetno] = FontStyle;
        console.log(that.widgetno);
        console.log(_FontStyle);

        // Check and Set Separator
        if (that.Separator) {
            _BuilderPanel[that.widgetno] = { Separator: that.Separator, Display: that.Display, Show_Display: that.Show_Display };
            var spart = that.Separator;
            var Selection = that.Display;
        } else {
            spart = _BuilderPanel[that.widgetno].Separator;
            Selection = _BuilderPanel[that.widgetno].Display;
        }

        if (rowData.length > 0) {

            for (var a = 0; a < rowData[0].length; a++) {

                var nodeid0 = rowData[0][a][TI].id;
                var nodedec0 = rowData[0][a][TD].id;
                var nodeIdDec0 = nodeid0 + " " + spart + " " + nodedec0;
                var selectionnode0 = { nodedec: nodedec0, nodeid: nodeid0, nodeIdDec: nodeIdDec0 };
                var node0 = { nodedec: nodedec0, nodeid: nodeid0, nodeIdDec: nodeIdDec0, text: selectionnode0[Selection] };
                // Field Mapping for Return Data      
                if (F1) {
                    node0[F1] = rowData[0][a][F1].id;
                }
                if (F2) {
                    node0[F2] = rowData[0][a][F2].id;;
                }

                var id0 = rowData[0][a][NI].id;
                node0.nodes = [];
                var child0 = '';
                var pc0 = 0;
                dfcount++;
                for (var a0 = 0; a0 < nodenm.length; a0++) {
                    if (nodenm[a0] === nodeid0) {
                        dfnumber.push(dfcount - 1);
                        dfdesc.push(nodedec0);

                        if (F1) {
                            dfF1.push(rowData[0][a][F1].id);
                        }
                        if (F2) {
                            dfF2.push(rowData[0][a][F2].id);
                        }
                    }
                }

                for (var b = 0; b < rowData[1].length; b++) {

                    if (rowData[1][b][PI].id === id0) {

                        var nodeid1 = rowData[1][b][TI].id;
                        var nodedec1 = rowData[1][b][TD].id;
                        var nodeIdDec1 = nodeid1 + " " + spart + " " + nodedec1;
                        var selectionnode1 = { nodedec: nodedec1, nodeid: nodeid1, nodeIdDec: nodeIdDec1 };
                        var node1 = { nodedec: nodedec1, nodeid: nodeid1, nodeIdDec: nodeIdDec1, text: selectionnode1[Selection] };

                        if (F1) {
                            node1[F1] = rowData[1][b][F1].id;
                        }
                        if (F2) {
                            node1[F2] = rowData[1][b][F2].id;;
                        }

                        var id1 = rowData[1][b][NI].id;
                        node1.nodes = [];
                        pc0 = pc0 + 1;
                        var child1 = '';
                        var pc1 = 0;
                        dfcount++;
                        for (var a1 = 0; a1 < nodenm.length; a1++) {
                            if (nodenm[a1] === nodeid1) {
                                dfnumber.push(dfcount - 1);
                                dfdesc.push(nodedec1);

                                if (F1) {
                                    dfF1.push(rowData[1][b][F1].id);
                                }
                                if (F2) {
                                    dfF2.push(rowData[1][b][F2].id);
                                }
                            }
                        }

                        for (var c = 0; c < rowData[2].length; c++) {

                            if (rowData[2][c][PI].id === id1) {

                                var nodeid2 = rowData[2][c][TI].id;
                                var nodedec2 = rowData[2][c][TD].id;
                                var nodeIdDec2 = nodeid2 + " " + spart + " " + nodedec2;
                                var selectionnode2 = { nodedec: nodedec2, nodeid: nodeid2, nodeIdDec: nodeIdDec2 };
                                var node2 = { nodedec: nodedec2, nodeid: nodeid2, nodeIdDec: nodeIdDec2, text: selectionnode2[Selection] };

                                if (F1) {
                                    node2[F1] = rowData[2][c][F1].id;
                                }
                                if (F2) {
                                    node2[F2] = rowData[2][c][F2].id;
                                }

                                var id2 = rowData[2][c][NI].id;
                                node2.nodes = [];
                                pc1 = pc1 + 1;
                                var child2 = '';
                                var pc2 = 0;
                                dfcount++;
                                for (var a2 = 0; a2 < nodenm.length; a2++) {
                                    if (nodenm[a2] === nodeid2) {
                                        dfnumber.push(dfcount - 1);
                                        dfdesc.push(nodedec2);


                                        if (F1) {
                                            dfF1.push(rowData[3][c][F1].id);
                                        }
                                        if (F2) {
                                            dfF2.push(rowData[3][c][F2].id);
                                        }
                                    }
                                }


                                for (var d = 0; d < rowData[3].length; d++) {

                                    if (rowData[3][d][PI].id === id2) {

                                        var nodeid3 = rowData[3][d][TI].id;
                                        var nodedec3 = rowData[3][d][TD].id;
                                        var nodeIdDec3 = nodeid3 + " " + spart + " " + nodedec3;
                                        var selectionnode3 = { nodedec: nodedec3, nodeid: nodeid3, nodeIdDec: nodeIdDec3 };
                                        var node3 = { nodedec: nodedec3, nodeid: nodeid3, nodeIdDec: nodeIdDec3, text: selectionnode3[Selection] };

                                        if (F1) {
                                            node3[F1] = rowData[3][d][F1].id;
                                        }
                                        if (F2) {
                                            node3[F2] = rowData[3][d][F2].id;;
                                        }

                                        var id3 = rowData[3][d][NI].id;
                                        node3.nodes = [];
                                        pc2 = pc2 + 1;
                                        var child3 = '';
                                        var pc3 = 0;
                                        dfcount++;
                                        for (var a3 = 0; a3 < nodenm.length; a3++) {
                                            if (nodenm[a3] === nodeid3) {
                                                dfnumber.push(dfcount - 1);
                                                dfdesc.push(nodedec3);


                                                if (F1) {
                                                    dfF1.push(rowData[3][d][F1].id);
                                                }
                                                if (F2) {
                                                    dfF2.push(rowData[3][d][F2].id);
                                                }
                                            }
                                        }

                                        for (var e = 0; e < rowData[4].length; e++) {

                                            if (rowData[4][e][PI].id === id3) {

                                                var nodeid4 = rowData[4][e][TI].id;
                                                var nodedec4 = rowData[4][e][TD].id;
                                                var nodeIdDec4 = nodeid4 + " " + spart + " " + nodedec4;
                                                var selectionnode4 = { nodedec: nodedec4, nodeid: nodeid4, nodeIdDec: nodeIdDec4 };
                                                var node4 = { nodedec: nodedec4, nodeid: nodeid4, nodeIdDec: nodeIdDec4, text: selectionnode4[Selection] };

                                                if (F1) {
                                                    node4[F1] = rowData[4][e][F1].id;
                                                }
                                                if (F2) {
                                                    node4[F2] = rowData[4][e][F2].id;;
                                                }

                                                var id4 = rowData[4][e][NI].id;
                                                node4.nodes = [];
                                                pc3 = pc3 + 1;
                                                var child4 = '';
                                                var pc4 = 0;
                                                dfcount++;
                                                for (var a4 = 0; a4 < nodenm.length; a4++) {
                                                    if (nodenm[a4] === nodeid4) {
                                                        dfnumber.push(dfcount - 1);
                                                        dfdesc.push(nodedec04);


                                                        if (F1) {
                                                            dfF1.push(rowData[4][e][F1].id);
                                                        }
                                                        if (F2) {
                                                            dfF2.push(rowData[4][e][F2].id);
                                                        }
                                                    }
                                                }

                                                for (var f = 0; f < rowData[5].length; f++) {

                                                    if (rowData[5][f][PI].id === id4) {

                                                        var nodeid5 = rowData[5][f][TI].id;
                                                        var nodedec5 = rowData[5][f][TD].id;
                                                        var nodeIdDec5 = nodeid5 + " " + spart + " " + nodedec5;
                                                        var selectionnode5 = { nodedec: nodedec5, nodeid: nodeid5, nodeIdDec: nodeIdDec5 };
                                                        var node5 = { nodedec: nodedec5, nodeid: nodeid5, nodeIdDec: nodeIdDec5, text: selectionnode5[Selection] };

                                                        if (F1) {
                                                            node5[F1] = rowData[5][f][F1].id;
                                                        }
                                                        if (F2) {
                                                            node5[F2] = rowData[5][f][F2].id;;
                                                        }

                                                        var id5 = rowData[5][f][NI].id;
                                                        node5.nodes = [];
                                                        pc4 = pc4 + 1;
                                                        var child5 = '';
                                                        var pc5 = 0;
                                                        dfcount++;
                                                        for (var a5 = 0; a5 < nodenm.length; a5++) {
                                                            if (nodenm[a5] === nodeid5) {
                                                                dfnumber.push(dfcount - 1);
                                                                dfdesc.push(nodedec5);

                                                                if (F1) {
                                                                    dfF1.push(rowData[5][f][F1].id);
                                                                }
                                                                if (F2) {
                                                                    dfF2.push(rowData[5][f][F2].id);
                                                                }
                                                            }
                                                        }

                                                        for (var g = 0; g < rowData[6].length; g++) {

                                                            if (rowData[6][g][PI].id === id5) {

                                                                var nodeid6 = rowData[6][g][TI].id;
                                                                var nodedec6 = rowData[6][g][TD].id;
                                                                var nodeIdDec6 = nodeid6 + " " + spart + " " + nodedec6;
                                                                var selectionnode6 = { nodedec: nodedec6, nodeid: nodeid6, nodeIdDec: nodeIdDec6 };
                                                                var node6 = { nodedec: nodedec6, nodeid: nodeid6, nodeIdDec: nodeIdDec6, text: selectionnode6[Selection] };

                                                                if (F1) {
                                                                    node6[F1] = rowData[6][g][F1].id;
                                                                }
                                                                if (F2) {
                                                                    node6[F2] = rowData[6][g][F2].id;;
                                                                }

                                                                var id6 = rowData[6][g][NI].id;
                                                                node6.nodes = [];
                                                                pc5 = pc5 + 1;
                                                                var child6 = '';
                                                                var pc6 = 0;
                                                                dfcount++;
                                                                for (var a6 = 0; a6 < nodenm.length; a6++) {
                                                                    if (nodenm[a6] === nodeid6) {
                                                                        dfnumber.push(dfcount - 1);
                                                                        dfdesc.push(nodedec6);


                                                                        if (F1) {
                                                                            dfF1.push(rowData[6][g][F1].id);
                                                                        }
                                                                        if (F2) {
                                                                            dfF2.push(rowData[6][g][F2].id);
                                                                        }
                                                                    }
                                                                }

                                                                for (var h = 0; h < rowData[7].length; h++) {

                                                                    if (rowData[7][h][PI].id === id6) {

                                                                        var nodeid7 = rowData[7][h][TI].id;
                                                                        var nodedec0 = rowData[7][h][TD].id;
                                                                        var nodeIdDec7 = nodeid7 + " " + spart + " " + nodedec7;
                                                                        var selectionnode7 = { nodedec: nodedec7, nodeid: nodeid7, nodeIdDec: nodeIdDec7 };
                                                                        var node7 = { nodedec: nodedec7, nodeid: nodeid7, nodeIdDec: nodeIdDec7, text: selectionnode7[Selection] };

                                                                        if (F1) {
                                                                            node7[F1] = rowData[7][h][F1].id;
                                                                        }
                                                                        if (F2) {
                                                                            node7[F2] = rowData[7][h][F2].id;;
                                                                        }

                                                                        var id7 = rowData[7][h][NI].id;
                                                                        node7.nodes = [];
                                                                        pc6 = pc6 + 1;
                                                                        var child7 = '';
                                                                        dfcount++;
                                                                        for (var a7 = 0; a7 < nodenm.length; a7++) {
                                                                            if (nodenm[a7] === nodeid7) {
                                                                                dfnumber.push(dfcount - 1);
                                                                                dfdesc.push(nodedec7);


                                                                                if (F1) {
                                                                                    dfF1.push(rowData[7][h][F1].id);
                                                                                }
                                                                                if (F2) {
                                                                                    dfF2.push(rowData[7][h][F2].id);
                                                                                }
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
                                                                            LEVEL: rowData[7][h][LL].id,
                                                                            PARENTID: rowData[7][h][PI].id,
                                                                            NODEID: rowData[7][h][NI].id,
                                                                            PTDEC: rowData[6][g][TD].id,
                                                                            PTID: rowData[6][g][TI].id,
                                                                            GRANULARITY: rowData[7][h].GRANULARITY.id,
                                                                            BU: rowData[7][h].BU.id
                                                                        }

                                                                        filterinfo.push(otherinfo7);
                                                                        filternode.push(nodeid7);
                                                                        filtervalue.push(child7);
                                                                        count++;



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
                                                                    LEVEL: rowData[6][g][LL].id,
                                                                    PARENTID: rowData[6][g][PI].id,
                                                                    NODEID: rowData[6][g][NI].id,
                                                                    PTDEC: rowData[5][f][TD].id,
                                                                    PTID: rowData[5][f][TI].id,
                                                                    GRANULARITY: rowData[6][g].GRANULARITY.id,
                                                                    BU: rowData[6][g].BU.id
                                                                }

                                                                filterinfo.push(otherinfo6);

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
                                                            LEVEL: rowData[5][f][LL].id,
                                                            PARENTID: rowData[5][f][PI].id,
                                                            NODEID: rowData[5][f][NI].id,
                                                            PTDEC: rowData[4][e][TD].id,
                                                            PTID: rowData[4][e][TI].id,
                                                            GRANULARITY: rowData[5][f].GRANULARITY.id,
                                                            BU: rowData[5][f].BU.id
                                                        }

                                                        filterinfo.push(otherinfo5);

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
                                                    LEVEL: rowData[4][e][LL].id,
                                                    PARENTID: rowData[4][e][PI].id,
                                                    NODEID: rowData[4][e][NI].id,
                                                    PTDEC: rowData[3][d][TD].id,
                                                    PTID: rowData[3][d][TI].id,
                                                    GRANULARITY: rowData[4][e].GRANULARITY.id,
                                                    BU: rowData[4][e].BU.id
                                                }

                                                filterinfo.push(otherinfo4);

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
                                            LEVEL: rowData[3][d][LL].id,
                                            PARENTID: rowData[3][d][PI].id,
                                            NODEID: rowData[3][d][NI].id,
                                            PTDEC: rowData[2][c][TD].id,
                                            PTID: rowData[2][c][TI].id,
                                            GRANULARITY: rowData[3][d].GRANULARITY.id,
                                            BU: rowData[3][d].BU.id
                                        }

                                        filterinfo.push(otherinfo3);

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

                                }

                                var otherinfo2 = {
                                    LEVEL: rowData[2][c][LL].id,
                                    PARENTID: rowData[2][c][PI].id,
                                    NODEID: rowData[2][c][NI].id,
                                    PTDEC: rowData[1][b][TD].id,
                                    PTID: rowData[1][b][TI].id,
                                    GRANULARITY: rowData[2][c].GRANULARITY.id,
                                    BU: rowData[2][c].BU.id
                                }

                                filterinfo.push(otherinfo2);

                                filternode.push(nodeid2);
                                filtervalue.push(child2);
                                count++;

                                node1.nodes.push(node2);
                            }
                        }

                        if (pc1 === 0) {

                            child0 = child0 + ',' + nodeid1;
                            child1 = child1 + ',' + nodeid1;

                        }

                        var otherinfo1 = {
                            LEVEL: rowData[1][b][LL].id,
                            PARENTID: rowData[1][b][PI].id,
                            NODEID: rowData[1][b][NI].id,
                            PTDEC: rowData[0][a][TD].id,
                            PTID: rowData[0][a][TI].id,
                            GRANULARITY: rowData[1][b].GRANULARITY.id,
                            BU: rowData[1][b].BU.id
                        }

                        filterinfo.push(otherinfo1);

                        filternode.push(nodeid1);
                        filtervalue.push(child1);
                        count++;

                        node0.nodes.push(node1);
                    }
                }
                if (pc0 === 0) {

                    child0 = child0 + ',' + nodeid0;

                }

                var otherinfo0 = {
                    LEVEL: rowData[0][a][LL].id,
                    PARENTID: rowData[0][a][PI].id,
                    NODEID: rowData[0][a][NI].id,
                    PTDEC: "root",
                    PTID: "root",
                    GRANULARITY: rowData[0][a].GRANULARITY.id,
                    BU: rowData[0][a].BU.id
                }

                filterinfo.push(otherinfo0);
                filternode.push(nodeid0);
                filtervalue.push(child0);
                count++;

                data.push(node0);

            }

            console.log(filterinfo);

            _filternode[that.widgetno - 1] = filternode;
            _filtervalue[that.widgetno - 1] = filtervalue;
            _filterinfo[that.widgetno - 1] = filtervalue;
            _dfnumber[that.widgetno - 1] = dfnumber;
            _setModeInfo[that.widgetno] = 1;
            _dfdesc[that.widgetno - 1] = dfdesc;
            _dfF1[that.widgetno] = dfF1;
            _dfF2[that.widgetno] = dfF2;


        }

        /*--------------------------------------------------------------------------------------------------------------- */
        /*--------------------------End: Data from SAC and prepare for JSON Model ------------------------------------- */
        /*--------------------------------------------------------------------------------------------------------------- */

        div = document.createElement('div');

        div.slot = "content_" + widgetName;

        //Set Display to Chosse ID,DEC,ID-DEC at Runtime
        if (that.Show_Display === "Yes") {
            var Selelect_List = '<Select width="45%" selectedKey="' + changedProperties.Display + '"  change="handleSelectChange"> <items> <core:Item key="nodeid" text="ID" /> <core:Item key="nodedec" text="DESCRIPTION" /> <core:Item key="nodeIdDec" text="ID-DESCRIPTION" /> </items></Select>'
            var WD = `45%`;
        }
        else {
            Selelect_List = "";
            WD = `93%`;
        }

        let div0 = document.createElement('div');

        //Div Tree Structure
        div0.innerHTML = '<script id="oView' + widgetName + '" name="oView' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"  xmlns="sap.m">  <Tree class=""  id="Tree"  items="{' + widgetName + '>/}" mode="MultiSelect"  selectionChange="onSelect"  includeItemInSelection="true" updateFinished="onDefaultSelction" > <headerToolbar> <OverflowToolbar> ' + Selelect_List + ' <Input  width="' + WD + '" placeholder="Type to search" value="{search/query}" liveChange="onLiveChange" /> </OverflowToolbar> </headerToolbar><StandardTreeItem title="{' + widgetName + '>text}" selected="{selected}"/></Tree></mvc:View></script>'
        // div0.style.position = "sticky";
        _shadowRoot.appendChild(div0);

        if (that._firstConnection === 1) {
        } else {
            let div2 = document.createElement('div');
            div2.innerHTML = '<div style="max-height: 550px; border-radius: 15px; overflow-y: hidden;" id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><div style="max-height: 550px; border-radius: 15px; overflow-y: auto;" id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"> </slot></div></div>';
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

                            if (IDNum1[that.widgetno] > 0) {
                                // Check Widgetno. for Custom Widget xmlView coordination
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

                            //Data assigned to Model For Tree Structure
                            var oModel = new JSONModel(data);
                            sap.ui.getCore().setModel(oModel, that.widgetName);
                        },

                        // Live Search for SearchField 
                        onLiveChange: function (event) {
                            const query = event.getParameter("newValue").trim();
                            this.byId("Tree").getBinding("items").filter(query ? new sap.ui.model.Filter({
                                path: "text",
                                operator: "Contains",
                                value1: query,
                            }) : null);
                            this.byId("Tree").expandToLevel(9999);
                        },

                        // DefaultSelection at OnInitialization
                        onDefaultSelction: function (event) {

                            if (IDNum[that.widgetno]) {
                                this.byId("Tree").setMode(that.Selection_Type);
                                this.byId("Tree").expandToLevel(9999);

                                IDNum[that.widgetno] -= 1;

                            }

                            if (that.widgetName && that.Selection_Type && _setModeInfo[that.widgetno]) {

                                // this.byId("Tree").setMode(that.Selection_Type);

                                dfnumber = _dfnumber[that.widgetno - 1];

                                filterinfo = _filterinfo[that.widgetno - 1];
                                filtervalue = _filtervalue[that.widgetno - 1];
                                filternode = _filternode[that.widgetno - 1];
                                dfdesc = _dfdesc[that.widgetno - 1];
                                var schild = "";
                                var listselected = [];
                                var listselecteddec = [];
                                var ptextid = [];
                                var ptextdec = [];



                                for (var i = 0; i < dfnumber.length; i++) {
                                    this.byId("Tree").getItems()[dfnumber[i]].setSelected(true);
                                    var snode = that.default[i];
                                    listselected.push(snode);
                                    listselecteddec.push(dfdesc[i]);

                                    for (var x = 0; x < filternode.length; x++) {
                                        if (snode === filternode[x]) {
                                            schild += filtervalue[x];
                                            ptextid.push(filterinfo[x].PTID);
                                            ptextdec.push(filterinfo[x].PTDEC);
                                        }
                                    }
                                }
                                _SelectedChild = schild.substr(1, schild.length).split(",");
                                _SelectedNodeDec = listselecteddec;
                                _SelectedNode = listselected;
                                _FF1 = _dfF1[that.widgetno];
                                _FF2 = _dfF2[that.widgetno];
                                _ptdec = ptextdec;
                                _ptid = ptextid;

                                that._firePropertiesChanged();
                                _setModeInfo[that.widgetno] = 0;


                            }
                            // var fbi = _FontStyle[widgetno];
                            // console.log(fbi);
                            // var fst = _FontStyle[widgetno]
                            // console.log(fst);
                            // var fc = _FontStyle[widgetno]
                            // console.log(fc);
                            // var fs = _FontStyle[widgetno]
                            // console.log(fs);
                            // for (var j = 0; j < this.getView().byId("Tree").getItems().length; j++) {
                            //     if (this.getView().byId("Tree").getItems()[j].mProperties.title == 'Total') {
                            //         // sap.ui.getCore().byId("Tree").getItems()[j].$(.find('.sapMCb').attr('id').setEnabled(false);
                            //         this.byId("Tree").getItems()[j].$().CSS('color', 'Lightgrey');
                            //         this.byId("Tree").getItems()[j].$().CSS('pointer-events', 'none');
                            //     }
                            // }

                            
                            var fbi = _FontStyle[that.widgetno];

                        console.log(fbi);
                           

                            $('.sapMTreeItemBase').css({ "background-color": "transparent", "font-weight": fbi[2], "font-family": fbi[0], "color": fbi[3], "font-size": fbi[1] + "px" });
                            console.log("Bbbbbbbbbbbbbbbbbbb");
                            $('.sapMTreeItemBase, .sapMIBar').css({ "background-color": "transparent" });
                            $('.sapMLIB').css({ "border-bottom": "0px solid #e5e5e5" });
                            $('.sapMIBar').css({ "background-color": "transparent" });
                            
                            // $('.sapMTreeItemBase:hover').css({ "background-color": "Lightgray", "font-weight": "bold"});
                            // $('.sapMSltLabel ').css({ "background-color": "transparent", "font-style": "normal", "font-family": "cambria" });
                            // $('.sapMListHdr, .sapMListHdrTBar').css({ "background-color": "transparent", "font-weight": "bold", "font-family": "Arial" });

                            console.log("Font_Style------------------------------");

                        },

                        // Set DisplayTitle Node for ID,DEC,ID-DEC
                        handleSelectChange: function (oEvent) {
                            var displaymode = oEvent.getParameter("selectedItem").getKey();

                            this.byId("Tree").expandToLevel(99);

                            for (var i = 0; i < this.getView().byId("Tree").getItems().length; i++) {

                                var node = this.getView().byId("Tree").getItems()[i].getBindingContext(that.widgetName).getObject()[displaymode];

                                this.byId("Tree").getItems()[i].setTitle(node);
                            }
                        },

                        // OnSelect Event for Tree Hierarchy at Runtime
                        onSelect: function (oEvent) {
                            var listselected = [];
                            var listselecteddec = [];
                            var schild = "";
                            var FFF1 = [];
                            var ptextid = [];
                            var ptextdec = [];
                            var ll_1 = [];
                            var pi_1 = [];
                            var ni_1 = [];
                            var FFF2 = [];

                            filterinfo = _filterinfo[that.widgetno - 1];
                            filtervalue = _filtervalue[that.widgetno - 1];
                            filternode = _filternode[that.widgetno - 1];
                            F1 = that.Field1_Name;
                            F2 = that.Field2_Name;

                            for (var i = 0; i < this.getView().byId("Tree").getSelectedItems().length; i++) {
                                var snode = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject().nodeid;
                                var tnode = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject().nodedec;

                                listselected.push(snode);
                                listselecteddec.push(tnode);

                                if (F1) {
                                    var F1node = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject()[F1];
                                    FFF1.push(F1node);
                                }

                                if (F2) {
                                    var F2node = this.getView().byId("Tree").getSelectedItems()[i].getBindingContext(that.widgetName).getObject()[F2];
                                    FFF2.push(F2node);
                                }

                                for (var x = 0; x < filternode.length; x++) {
                                    if (snode === filternode[x]) {
                                        schild += filtervalue[x];
                                        ptextid.push(filterinfo[x].PTID);
                                        ptextdec.push(filterinfo[x].PTDEC);
                                        ll_1.push(filterinfo[x].LEVEL);
                                        pi_1.push(filterinfo[x].PARENTID);
                                        ni_1.push(filterinfo[x].NODEID);

                                    }
                                }
                            }

                            _SelectedNode = listselected;
                            _SelectedNodeDec = listselecteddec;

                            var _unit1 = schild.substr(1, schild.length).split(",");
                            _SelectedChild = _unit1.filter((c, index) => {
                                return _unit1.indexOf(c) === index;
                            });

                            _FF1 = FFF1;
                            _FF2 = FFF2;
                            _ptdec = ptextdec;
                            _ptid = ptextid;

                            that._firePropertiesChanged();

                        }

                    });

                    return PageController;

                });

            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

})();