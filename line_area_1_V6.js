var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

let min;
let max;
let count = 0;
let click = 1;
let check = 1;
let maxrng;
let minrng;
let rng = 1;

(function () {

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------  Start: Template Creation  ------------------------------------- */

    //Chart Block in HTML
    const prepared = document.createElement('template')
    prepared.innerHTML = `
  <div id="root" style="width: 100%; height: 100%;">
  </div>
`

    /*--------------------------  End: Template Creation  ------------------------------------- */
    /*--------------------------------------------------------------------------------------------------------------- */


    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------Start: Main Class  ------------------------------------- */

    //Main JS Class holds methods to be called
    class SamplePrepared extends HTMLElement {
        constructor() {

            //call SAC DOM Super method to get shadow DOM information
            super()

            //Get shadow DOM informations
            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(prepared.content.cloneNode(true))

            //Set HTML block in shadow DOM of SAC
            this._root = this._shadowRoot.getElementById('root')

            //_props object is used to hold properties infosrmation
            this._props = {}

            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);
                // console.log('click');

            });

            //Call render() method to plot chart
            // this.render(this._resultSet, this._Vrname, this.KFName, this.YDirection, this._S1, this._S2, this.ReplaceNull, this._DateAxes, this._Isyear,1)
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            render(that, this._root, changedProperties);
            // render(this._resultSet, this._Vrname, this.KFName, this.YDirection, this._S1, this._S2, this.ReplaceNull, this._DateAxes, this._Isyear,that, changedProperties);
        }

        _firePropertiesChanged() {
            this.selectedNode = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        selectedNode: this.selectedNode
                    }
                }
            }));
        }
    }

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------End: Main Class ------------------------------------- */

    customElements.define('com-sap-sample-linearea-prepared', SamplePrepared);


    // function render(resultSet1, _Vrname, _KFName, _YDirection, _S1, _S2, _ReplaceNull, _DateAxes, _Isyear, that, changedProperties) {

    async function render(that, root1, changedProperties) {

        var resultSet1 = that.resultset_1;
        var _KFName = that.KFName_1;
        var _VrnameUp = that.VrnameUp_1;
        var _Vrname = that.Vrname_1;
        var _YDirection = that.YDirection_1;
        var _S1 = that.S1_1;
        var _S2 = that.S2_1;
        var _ReplaceNull = that.ReplaceNull_1;
        var _ColorUp = that.LineColorUp;
        var _DateAxes = that.DateAxes_1;
        var _Isyear = that.Isyear_1;

        console.log(that);

        await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
        await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
        await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

        // anychart.onDocumentReady(function () {
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create(root1, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.background.opacity = 0

        var data = [];
        console.log(resultSet1);

        var len = resultSet1.length;

        if (_Vrname.length > 1) {
            var inc = _S1 * 3 + _S2 * 7;
        } else {
            inc = _S1 * 2 + _S2 * 6;
        }

        for (var i = 0; i < len; i = i + inc) {

            var ActualAmountUp = [null, null, null, null, null, null, null, null];
            var RangeAmountUp = [null, null, null, null, null, null, null, null, null, null, null, null];

            var ActualAmount = [null, null, null, null, null, null, null, null];
            var RangeAmount = [null, null, null, null, null, null, null, null, null, null, null, null];
            var PriceAmount = [null, null, null, null, null, null, null, null];

            var NoofItem = _S1;

            for (var j = 0; j < NoofItem; j++) {
                ActualAmountUp[j] = resultSet1[i + j]["@MeasureDimension"].formattedValue;

                if (resultSet1[i + j]["@MeasureDimension"].rawValue == _ReplaceNull) { ActualAmountUp[j] = null; }
            }

            NoofItem = NoofItem + _S2 * 3;

            for (var k = 0; j < NoofItem; j++, k++) {
                RangeAmountUp[k] = resultSet1[i + j]["@MeasureDimension"].formattedValue;

                if (resultSet1[i + j]["@MeasureDimension"].rawValue == _ReplaceNull) { RangeAmountUp[k] = null; }
            }

            NoofItem = NoofItem + _S1;

            for (var l = 0; j < NoofItem; j++, l++) {
                ActualAmount[l] = resultSet1[i + j]["@MeasureDimension"].formattedValue;

                if (resultSet1[i + j]["@MeasureDimension"].rawValue == _ReplaceNull) { ActualAmount[l] = null; }
            }

            NoofItem = NoofItem + _S2 * 3;

            for (var n = 0; j < NoofItem; j++, n++) {
                RangeAmount[n] = resultSet1[i + j]["@MeasureDimension"].formattedValue;

                if (resultSet1[i + j]["@MeasureDimension"].rawValue == _ReplaceNull) { RangeAmount[n] = null; }
            }

            if (_Vrname.length > 1) {
                for (var m = 0; j < inc; j++, m++) {
                    var no = parseFloat(resultSet1[i + j]["@MeasureDimension"].rawValue);
                    PriceAmount[m] = no.toFixed(3);

                    if (resultSet1[i + j]["@MeasureDimension"].rawValue == _ReplaceNull) { PriceAmount[m] = null; }
                }
            }
// console.log(ActualAmount);

            var dt = new Date(resultSet1[i]["DATE"].description);
            // check = 1;
            var a = {

                date: dt,
                A0: ActualAmount[0],
                A1: ActualAmount[1],
                A2: ActualAmount[2],
                A3: ActualAmount[3],
                A4: ActualAmount[4],
                A5: ActualAmount[5],
                A6: ActualAmount[6],
                A7: ActualAmount[7],
                mid0: RangeAmount[0],
                high0: RangeAmount[1],
                low0: RangeAmount[2],
                mid1: RangeAmount[3],
                high1: RangeAmount[4],
                low1: RangeAmount[5],
                mid2: RangeAmount[6],
                high2: RangeAmount[7],
                low2: RangeAmount[8],
                mid3: RangeAmount[9],
                high3: RangeAmount[10],
                low3: RangeAmount[11],
                A0Up: ActualAmountUp[0],
                A1Up: ActualAmountUp[1],
                A2Up: ActualAmountUp[2],
                A3Up: ActualAmountUp[3],
                A4Up: ActualAmountUp[4],
                A5Up: ActualAmountUp[5],
                A6Up: ActualAmountUp[6],
                A7Up: ActualAmountUp[7],
                mid0Up: RangeAmountUp[0],
                high0Up: RangeAmountUp[1],
                low0Up: RangeAmountUp[2],
                mid1Up: RangeAmountUp[3],
                high1Up: RangeAmountUp[4],
                low1Up: RangeAmountUp[5],
                mid2Up: RangeAmountUp[6],
                high2Up: RangeAmountUp[7],
                low2Up: RangeAmountUp[8],
                mid3Up: RangeAmountUp[9],
                high3Up: RangeAmountUp[10],
                low3Up: RangeAmountUp[11],
                ZERO: 0,
                P0: PriceAmount[0],
                P1: PriceAmount[1],
                P2: PriceAmount[2],
                P3: PriceAmount[3],
                P4: PriceAmount[4],
                P5: PriceAmount[5],
                P6: PriceAmount[6],
                P7: PriceAmount[7],
            }

            data.push(a);

        }

        chart.data = data;
        chart.leftAxesContainer.layout = "vertical";
        chart.rightAxesContainer.layout = "vertical";

        { // Axis

            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.cursorTooltipEnabled = false;

            var dateAxis1 = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis1.cursorTooltipEnabled = false;

            dateAxis.dateFormats.setKey("month", _Isyear);
            dateAxis.renderer.labels.template.fontSize = 13;
            dateAxis.renderer.labels.template.fontFamily = "SF UI Text";
            dateAxis.tooltip.label.fontFamily = "SF UI Text";
            dateAxis.tooltip.label.fontSize = 13;
            if (_Isyear === 'yyyy') {
                dateAxis.dateFormatter.dateFormat = "yyyy";
                dateAxis.startLocation = 0.3;
                dateAxis.endLocation = 0.7;
                dateAxis.baseInterval = {
                    "timeUnit": "year",
                    "count": 1
                }
                dateAxis1.disabled = true;
            } else {

                // dateAxis1.renderer.minGridDistance = 50;
                dateAxis1.disabled = false;
                dateAxis1.dateFormatter.dateFormat = "[bold]yyyy[/]";
                dateAxis1.renderer.grid.template.disabled = false;
                dateAxis1.baseInterval = {
                    "timeUnit": "year",
                    "count": 1
                }

                if (_Isyear === 'MMM') {

                    dateAxis.startLocation = 0;
                    dateAxis.endLocation = 0.7;
                    dateAxis.periodChangeDateFormats.setKey("month", "MMM");
                    dateAxis.renderer.minGridDistance = 50;
                    dateAxis.dateFormatter.dateFormat = "MMM yyyy";
                    dateAxis.renderer.grid.template.disabled = true;
                } else {

                    dateAxis.startLocation = 0;
                    dateAxis.endLocation = 0.7;
                    dateAxis.periodChangeDateFormats.setKey("month", "Qq");
                    dateAxis.dateFormats.setKey("month", "Qq");
                    dateAxis.renderer.minGridDistance = 50;
                    dateAxis.dateFormatter.dateFormat = "Qq, yyyy";
                    dateAxis.renderer.grid.template.disabled = true;
                }

                dateAxis1.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

                dateAxis1.renderer.labels.template.fontSize = 13;
                dateAxis.renderer.labels.template.fontFamily = "SF UI Text";
                dateAxis1.renderer.labels.template.fontWeight = "bold";
                dateAxis1.tooltip.label.fontFamily = "SF UI Text";
                dateAxis1.tooltip.label.fontSize = 13;
                dateAxis1.renderer.labels.template.events.on("hit", function (ev) {
                    var start = ev.target.dataItem.date;
                    var end = new Date(start);
                    end.setMonth(end.getMonth() + 12);
                    dateAxis.zoomToDates(start, end);
                    dateAxis1.zoomToDates(start, end);
                    min = start;
                    max = end;
                    click = 0;
                    console.log(min);
                    console.log(max);

                    //         console.log("---KFG-----");
                    // console.log("Min Value :" + new Date(min));
                    // console.log("Max Value :" + new Date(max));
                    // count = 1;
                })

                dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                dateAxis.renderer.labels.template.events.on("hit", function (ev) {
                    var start = ev.target.dataItem.date;
                    start.setMonth(0);
                    var end = new Date(start);
                    end.setMonth(end.getMonth() + 12);
                    dateAxis.zoomToDates(start, end);
                    dateAxis1.zoomToDates(start, end);
                    min = start;
                    max = end;
                    click = 0;

                    console.log(min);
                    console.log(max);
                    // console.log("---KFG-----");
                    // console.log("Min Value :" + new Date(min));
                    // console.log("Max Value :" + new Date(max));
                    // count = 1;     
                })

                // if(max && min && count > 1){
                //   console.log("-----------------------------------------");                 
                //   console.log(changedProperties.widgetName);   
                //   count++;              
                //   console.log(min);
                //   console.log(max);              
                //   dateAxis.zoomToDates(min, max);
                //   dateAxis1.zoomToDates(min, max);

                // console.log("Min Value :" + dateAxis.minZoomed);
                // console.log("Max Value :" + dateAxis.maxZoomed);
                // console.log("-----------------------------------------"); 
                // }else{console.log('------ABC--------------');  
                // count++; }

            }
            var valueAxisTopLeft = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxisTopLeft.cursorTooltipEnabled = false;
            valueAxisTopLeft.marginBottom = 70;
            // valueAxisTopLeft.peddingBottom = 70;
            valueAxisTopLeft.renderer.grid.template.disabled = false;
            valueAxisTopLeft.renderer.labels.template.fontSize = 13;
            valueAxisTopLeft.renderer.labels.template.fontFamily = "SF UI Text";
            valueAxisTopLeft.tooltip.label.fontFamily = "SF UI Text";
            valueAxisTopLeft.tooltip.label.fontSize = 13;
            valueAxisTopLeft.numberFormatter = new am4core.NumberFormatter();
            valueAxisTopLeft.numberFormatter.numberFormat = "#.##a";
            //   valueAxisTopLeft.height = am4core.percent(40);
            valueAxisTopLeft.renderer.minGridDistance = 20;
            valueAxisTopLeft.numberFormatter.bigNumberPrefixes = [
                { "number": 1e+3, "suffix": "k" },
                { "number": 1e+6, "suffix": "m" },
                { "number": 1e+9, "suffix": "b" }
            ];

            var valueAxisLeft = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxisLeft.cursorTooltipEnabled = false;
            valueAxisLeft.renderer.grid.template.disabled = false;
            valueAxisLeft.height = am4core.percent(85);
            //   valueAxisLeft.marginTop = 30;
            valueAxisLeft.renderer.labels.template.fontSize = 13;
            valueAxisLeft.renderer.labels.template.fontFamily = "SF UI Text";
            valueAxisLeft.tooltip.label.fontFamily = "SF UI Text";
            valueAxisLeft.tooltip.label.fontSize = 13;
            valueAxisLeft.numberFormatter = new am4core.NumberFormatter();
            valueAxisLeft.numberFormatter.numberFormat = "#.##a";
            valueAxisLeft.numberFormatter.bigNumberPrefixes = [
                { "number": 1e+3, "suffix": "k" },
                { "number": 1e+6, "suffix": "m" },
                { "number": 1e+9, "suffix": "b" }
            ];



            var valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxisRight.cursorTooltipEnabled = false;
            valueAxisRight.renderer.opposite = true;
            //   valueAxisRight.marginTop = 30;
            //   valueAxisRight.marginBottom = 30;
            valueAxisRight.renderer.grid.template.disabled = false;
            valueAxisRight.renderer.labels.template.fontSize = 13;
            valueAxisRight.height = am4core.percent(85);
            valueAxisRight.renderer.labels.template.fontFamily = "SF UI Text";
            valueAxisRight.tooltip.label.fontFamily = "SF UI Text";
            valueAxisRight.tooltip.label.fontSize = 13;
            valueAxisRight.renderer.grid.template.disabled = true;
            valueAxisRight.numberFormatter = new am4core.NumberFormatter();
            valueAxisRight.numberFormatter.numberFormat = "#.##";

            var valueAxisTopRight = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxisTopRight.cursorTooltipEnabled = false;
            // valueAxisTopRight.marginTop = 200;
            // valueAxisTopRight.marginBottom = 350;
            valueAxisTopRight.renderer.opposite = true;
            valueAxisTopRight.renderer.grid.template.disabled = false;
            valueAxisTopRight.renderer.labels.template.fontSize = 13;
            valueAxisTopRight.renderer.labels.template.fontFamily = "SF UI Text";
            valueAxisTopRight.tooltip.label.fontFamily = "SF UI Text";
            valueAxisTopRight.tooltip.label.fontSize = 13;
            valueAxisTopRight.renderer.grid.template.disabled = true;
            valueAxisTopRight.numberFormatter = new am4core.NumberFormatter();
            valueAxisTopRight.numberFormatter.numberFormat = "#.##";
        }

        // Series Style
        {
            var SS = ["0", "3,3", "8,4", "8,4,2,4", "0", "3,3", "8,4", "8,4,2,4"];
        }

        // Bullets Style
        {
            var BS = [am4core.Circle,
            am4core.Triangle,
            am4core.Rectangle,
            am4core.Rectangle,
            am4core.Circle,
            am4core.Triangle,
            am4core.Rectangle,
            am4core.Rectangle,
            ];
        }

        // dummy series
        var seriesD0 = chart.series.push(new am4charts.LineSeries());
        seriesD0.data = chart.data;
        seriesD0.dataFields.valueY = "ZERO";
        seriesD0.dataFields.dateX = "date";
        seriesD0.xAxis = dateAxis1;
        seriesD0.name = "DUMMY";
        // seriesD0.hidden = true;
        seriesD0.hiddenInLegend = true;

        //Section1
        {
            for (var i = 0; i < _S1; i++) {
                // Create series for Actuals down

                var series0 = chart.series.push(new am4charts.LineSeries());
                series0.data = chart.data;
                series0.dataFields.valueY = "A" + i;
                series0.dataFields.dateX = "date";
                series0.name = _KFName[i];
                series0.tooltipText = "[bold] {date}[/] \n" + _Vrname[0] + "\n{name}: {valueY} ";
                series0.tooltip.getFillFromObject = false;
                series0.tooltip.background.fill = am4core.color("#F8F8F8");
                series0.tooltip.autoTextColor = false;
                series0.tooltip.label.fill = am4core.color("#000000");
                series0.tooltip.label.fontSize = 13;
                series0.tooltip.label.fontFamily = "SF UI Text"
                series0.tensionX = 0.9;
                series0.strokeWidth = 1.5;
                series0.defaultState.transitionDuration = 1500;
                series0.stroke = am4core.color(_DateAxes[0]);
                series0.hiddenInLegend = true;

                if (_YDirection[i] === 'L') {
                    series0.yAxis = valueAxisLeft;
                } else {
                    series0.yAxis = valueAxisRight;
                }
                series0.strokeDasharray = SS[i];
                var bullet = series0.bullets.push(new am4charts.Bullet());
                var square = bullet.createChild(BS[i]);
                square.width = 6;
                square.height = 6;
                square.horizontalCenter = "middle";
                square.verticalCenter = "middle";
                square.fill = am4core.color(_DateAxes[0]);
            }
        }

        //Section1 Top
        {
            for (var i = 0; i < _S1; i++) {
                // Create series for Actuals Top

                var seriesT0 = chart.series.push(new am4charts.LineSeries());
                seriesT0.data = chart.data;
                seriesT0.dataFields.valueY = "A" + i + "Up";
                seriesT0.dataFields.dateX = "date";
                seriesT0.name = _KFName[i];
                seriesT0.tooltipText = "[bold] {date}[/] \n" + _VrnameUp[0] + "\n{name}: {valueY} ";
                seriesT0.tooltip.getFillFromObject = false;
                seriesT0.tooltip.background.fill = am4core.color("#F8F8F8");
                seriesT0.tooltip.autoTextColor = false;
                seriesT0.tooltip.label.fill = am4core.color("#000000");
                seriesT0.tooltip.label.fontSize = 13;
                seriesT0.tooltip.label.fontFamily = "SF UI Text"
                seriesT0.tensionX = 0.9;
                seriesT0.strokeWidth = 1.5;
                seriesT0.defaultState.transitionDuration = 1500;
                seriesT0.stroke = am4core.color(_ColorUp[0]);
                if (_YDirection[i] === 'L') {
                    seriesT0.yAxis = valueAxisTopLeft;
                } else {
                    seriesT0.yAxis = valueAxisTopRight;
                }
                seriesT0.strokeDasharray = SS[i];
                var bullet = seriesT0.bullets.push(new am4charts.Bullet());
                var square = bullet.createChild(BS[i]);
                square.width = 6;
                square.height = 6;
                square.horizontalCenter = "middle";
                square.verticalCenter = "middle";
                square.fill = am4core.color(_ColorUp[0]);

            }
        }


        //Section1.1
        {
            if (_Vrname.length > 1) {
                for (var i = 0; i < _S1 + _S2; i++) {
                    // Create series for Price

                    var series01 = chart.series.push(new am4charts.LineSeries());
                    series01.data = chart.data;
                    series01.dataFields.valueY = "P" + i;
                    series01.dataFields.dateX = "date";
                    series01.name = _KFName[i];
                    series01.tooltipText = "[bold] {date}[/] \n" + _Vrname[1] + "\n{name}: {valueY}";
                    series01.tooltip.getFillFromObject = false;
                    series01.tooltip.background.fill = am4core.color("#F8F8F8");
                    series01.tooltip.autoTextColor = false;
                    series01.tooltip.label.fill = am4core.color("#000000");
                    series01.tooltip.label.fontSize = 13;
                    series01.tooltip.label.fontFamily = "SF UI Text"
                    series01.tensionX = 0.9;
                    series01.strokeWidth = 1.5;
                    series01.defaultState.transitionDuration = 1500;
                    series01.stroke = am4core.color(_DateAxes[1]);
                    series01.hiddenInLegend = true;

                    series01.yAxis = valueAxisRight;

                    var pno = i;
                    if (i >= _S1) { pno = i - _S1; }

                    series01.strokeDasharray = SS[pno];
                    var bullet = series01.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[pno]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_DateAxes[1]);
                }
            }
        }

        //Section1.1 Top
        // {
        //     if (_Vrname.length > 1) {
        //         for (var i = 0; i < _S1 + _S2; i++) {
        //             // Create series for Actuals

        //             var seriesT01 = chart.series.push(new am4charts.LineSeries());
        //             seriesT01.data = chart.data;
        //             seriesT01.dataFields.valueY = "P" + i;
        //             seriesT01.dataFields.dateX = "date";
        //             seriesT01.name = _KFName[i];
        //             seriesT01.tooltipText = "[bold] {date}[/] \n" + _Vrname[1] + "\n{name}: {valueY}";
        //             seriesT01.tooltip.getFillFromObject = false;
        //             seriesT01.tooltip.background.fill = am4core.color("#F8F8F8");
        //             seriesT01.tooltip.autoTextColor = false;
        //             seriesT01.tooltip.label.fill = am4core.color("#000000");
        //             seriesT01.tooltip.label.fontSize = 13;
        //             seriesT01.tooltip.label.fontFamily = "SF UI Text"
        //             seriesT01.tensionX = 0.9;
        //             seriesT01.strokeWidth = 1.5;
        //             seriesT01.defaultState.transitionDuration = 1500;
        //             seriesT01.stroke = am4core.color(_DateAxes[1]);
        //             seriesT01.hiddenInLegend = true;

        //             seriesT01.yAxis = valueAxisTopRight;

        //             var pno = i;
        //             if (i >= _S1) { pno = i - _S1; }

        //             seriesT01.strokeDasharray = SS[pno];
        //             var bullet = seriesT01.bullets.push(new am4charts.Bullet());
        //             var square = bullet.createChild(BS[pno]);
        //             square.width = 6;
        //             square.height = 6;
        //             square.horizontalCenter = "middle";
        //             square.verticalCenter = "middle";
        //             square.fill = am4core.color(_DateAxes[1]);
        //         }
        //     }
        // }



        //Section 2 
        {
            function createSeries(field, name, hiddenInLegend) {
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = field;
                series.dataFields.dateX = "date";
                series.name = name;
                if (hiddenInLegend) {
                    series.hiddenInLegend = true;
                }
                return series;
            }

            for (var i = 0; i < _S2; i++) {

                var yAxis_value = valueAxisRight;

                if (_YDirection[_S1 + i] === 'L') {
                    yAxis_value = valueAxisLeft;
                }

                //Range0
                if (i == 0) {

                    // Create series for Mid
                    var seriesR0 = createSeries("mid" + i, _KFName[_S1 + i], false)
                    seriesR0.data = chart.data;
                    seriesR0.dataFields.openValueY = "high" + i;
                    seriesR0.dataFields.lowValueY = "low" + i;
                    seriesR0.tooltipText = "[bold] {date}[/] \n" + _Vrname[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR0.tooltip.getFillFromObject = false;
                    seriesR0.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR0.tooltip.autoTextColor = false;
                    seriesR0.tooltip.label.fill = am4core.color("#000000");
                    seriesR0.tooltip.label.fontSize = 13;
                    seriesR0.tooltip.label.fontFamily = "SF UI Text"
                    seriesR0.tensionX = 0.9;
                    seriesR0.strokeWidth = 1.5;
                    seriesR0.defaultState.transitionDuration = 1500;
                    seriesR0.yAxis = yAxis_value;
                    seriesR0.hiddenInLegend = true;

                    var bullet = seriesR0.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR0.stroke = am4core.color(_DateAxes[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_DateAxes[0]);

                    // Create series for Close
                    var seriesC0 = createSeries("high" + i, "high", true);
                    seriesC0.data = chart.data;
                    seriesC0.dataFields.openValueY = "mid" + i;
                    // seriesC0.tooltipText = "{name}-{valueY} ";
                    seriesC0.fillOpacity = 0.3;
                    seriesC0.tensionX = 0.9;
                    seriesC0.strokeWidth = 0;
                    seriesC0.defaultState.transitionDuration = 1500;
                    seriesC0.yAxis = yAxis_value;
                    seriesC0.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    // Create series for open
                    var seriesO0 = createSeries("low" + i, "low", true);
                    seriesO0.data = chart.data;
                    seriesO0.dataFields.openValueY = "mid" + i;
                    seriesO0.fillOpacity = 0.3;
                    // seriesO0.tooltipText = "{name}:{valueY} ";
                    seriesO0.tensionX = 0.9;
                    seriesO0.strokeWidth = 0;
                    seriesO0.defaultState.transitionDuration = 1500;
                    seriesO0.yAxis = yAxis_value;
                    seriesO0.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    seriesR0.events.on("hidden", function () {
                        seriesC0.hide();
                        seriesO0.hide();
                    });

                    seriesR0.events.on("shown", function () {
                        seriesC0.show();
                        seriesO0.show();
                    });

                }

                //Range1          
                if (i == 1) {

                    // Create series for Mid
                    var seriesR1 = createSeries("mid" + i, _KFName[_S1 + i], false)
                    seriesR1.data = chart.data;
                    seriesR1.dataFields.openValueY = "high" + i;
                    seriesR1.dataFields.lowValueY = "low" + i;
                    seriesR1.tooltipText = "[bold] {date}[/] \n " + _Vrname[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR1.tooltip.getFillFromObject = false;
                    seriesR1.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR1.tooltip.autoTextColor = false;
                    seriesR1.tooltip.label.fill = am4core.color("#000000");
                    seriesR1.tooltip.label.fontSize = 13;
                    seriesR1.tooltip.label.fontFamily = "SF UI Text"
                    seriesR1.tensionX = 0.9;
                    seriesR1.strokeWidth = 1.5;
                    seriesR1.defaultState.transitionDuration = 1500;
                    seriesR1.yAxis = yAxis_value;
                    seriesR1.hiddenInLegend = true;

                    var bullet = seriesR1.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR1.stroke = am4core.color(_DateAxes[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_DateAxes[0]);

                    // Create series for Close
                    var seriesC1 = createSeries("high" + i, "high", true);
                    seriesC1.data = chart.data;
                    seriesC1.dataFields.openValueY = "mid" + i;
                    // seriesC1.tooltipText = "{name}-{valueY} ";
                    seriesC1.fillOpacity = 0.3;
                    seriesC1.tensionX = 0.9;
                    seriesC1.strokeWidth = 0;
                    seriesC1.defaultState.transitionDuration = 1500;
                    seriesC1.yAxis = yAxis_value;
                    seriesC1.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    // Create series for open
                    var seriesO1 = createSeries("low" + i, "low", true);
                    seriesO1.data = chart.data;
                    seriesO1.dataFields.openValueY = "mid" + i;
                    seriesO1.fillOpacity = 0.3;
                    // seriesO1.tooltipText = "{name}-{valueY} ";
                    seriesO1.tensionX = 0.9;
                    seriesO1.strokeWidth = 0;
                    seriesO1.defaultState.transitionDuration = 1500;
                    seriesO1.yAxis = yAxis_value;
                    seriesO1.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    seriesR1.events.on("hidden", function () {
                        seriesC1.hide();
                        seriesO1.hide();
                    });

                    seriesR1.events.on("shown", function () {
                        seriesC1.show();
                        seriesO1.show();
                    });

                }

                //Range2         
                if (i == 2) {

                    // Create series for Mid
                    var seriesR2 = createSeries("mid" + i, _KFName[_S1 + i], false)
                    seriesR2.data = chart.data;
                    seriesR2.dataFields.openValueY = "high" + i;
                    seriesR2.dataFields.lowValueY = "low" + i;
                    seriesR2.tooltipText = "[bold] {date}[/] \n " + _Vrname[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR2.tooltip.getFillFromObject = false;
                    seriesR2.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR2.tooltip.autoTextColor = false;
                    seriesR2.tooltip.label.fill = am4core.color("#000000");
                    seriesR2.tooltip.label.fontSize = 13;
                    seriesR2.tooltip.label.fontFamily = "SF UI Text"
                    seriesR2.tensionX = 0.9;
                    seriesR2.strokeWidth = 1.5;
                    seriesR2.defaultState.transitionDuration = 1500;
                    seriesR2.yAxis = yAxis_value;
                    seriesR2.hiddenInLegend = true;

                    var bullet = seriesR2.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR2.stroke = am4core.color(_DateAxes[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_DateAxes[0]);

                    // Create series for Close
                    var seriesC2 = createSeries("high" + i, "high", true);
                    seriesC2.data = chart.data;
                    seriesC2.dataFields.openValueY = "mid" + i;
                    // seriesC2.tooltipText = "{name}-{valueY} ";
                    seriesC2.fillOpacity = 0.3;
                    seriesC2.tensionX = 0.9;
                    seriesC2.strokeWidth = 0;
                    seriesC2.defaultState.transitionDuration = 1500;
                    seriesC2.yAxis = yAxis_value;
                    seriesC2.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    // Create series for open
                    var seriesO2 = createSeries("low" + i, "low", true);
                    seriesO2.data = chart.data;
                    seriesO2.dataFields.openValueY = "mid" + i;
                    seriesO2.fillOpacity = 0.3;
                    // seriesO2.tooltipText = "{name}-{valueY} ";
                    seriesO2.tensionX = 0.9;
                    seriesO2.strokeWidth = 0;
                    seriesO2.defaultState.transitionDuration = 1500;
                    seriesO2.yAxis = yAxis_value;
                    seriesO2.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    seriesR2.events.on("hidden", function () {
                        seriesC2.hide();
                        seriesO2.hide();
                    });

                    seriesR2.events.on("shown", function () {
                        seriesC2.show();
                        seriesO2.show();
                    });

                }

                //Range3          
                if (i == 3) {

                    // Create series for Mid
                    var seriesR3 = createSeries("mid" + i, _KFName[_S1 + i], false)
                    seriesR3.data = chart.data;
                    seriesR3.dataFields.openValueY = "high" + i;
                    seriesR3.dataFields.lowValueY = "low" + i;
                    seriesR3.tooltipText = "[bold] {date}[/] \n " + _Vrname[0] + "\n  {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR3.tooltip.getFillFromObject = false;
                    seriesR3.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR3.tooltip.autoTextColor = false;
                    seriesR3.tooltip.label.fill = am4core.color("#000000");
                    seriesR3.tooltip.label.fontSize = 13;
                    seriesR3.tooltip.label.fontFamily = "SF UI Text";
                    seriesR3.tensionX = 0.9;
                    seriesR3.strokeWidth = 1.5;
                    seriesR3.defaultState.transitionDuration = 1500;
                    seriesR3.yAxis = yAxis_value;
                    seriesR3.hiddenInLegend = true;
                    var bullet = seriesR3.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR3.stroke = am4core.color(_DateAxes[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_DateAxes[0]);

                    // Create series for Close
                    var seriesC3 = createSeries("high" + i, "high", true);
                    seriesC3.data = chart.data;
                    seriesC3.dataFields.openValueY = "mid" + i;
                    // seriesC3.tooltipText = "{name}-{valueY} ";
                    seriesC3.fillOpacity = 0.3;
                    seriesC3.tensionX = 0.9;
                    seriesC3.strokeWidth = 0;
                    seriesC3.defaultState.transitionDuration = 1500;
                    seriesC3.yAxis = yAxis_value;
                    seriesC3.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    // Create series for open
                    var seriesO3 = createSeries("low" + i, "low", true);
                    seriesO3.data = chart.data;
                    seriesO3.dataFields.openValueY = "mid" + i;
                    seriesO3.fillOpacity = 0.3;
                    // seriesO3.tooltipText = "{name}-{valueY} ";
                    seriesO3.tensionX = 0.9;
                    seriesO3.strokeWidth = 0;
                    seriesO3.defaultState.transitionDuration = 1500;
                    seriesO3.yAxis = yAxis_value;
                    seriesO3.fill = am4core.color(_DateAxes[0]).lighten(0.3);

                    seriesR3.events.on("hidden", function () {
                        seriesC3.hide();
                        seriesO3.hide();
                    });

                    seriesR3.events.on("shown", function () {
                        seriesC3.show();
                        seriesO3.show();
                    });

                }

            }

            ///////////////////////------TOP SECTION---------////////////////////////////////////////////////////

            for (var i = 0; i < _S2; i++) {

                var yAxis_value = valueAxisTopLeft;

                // if (_YDirection[_S1 + i] === 'L') {
                //     yAxis_value = valueAxisTopLeft;
                // }

                //Range0
                if (i == 0) {

                    // Create series for Mid
                    var seriesR0 = createSeries("mid" + i + "Up", _KFName[_S1 + i], false)
                    seriesR0.data = chart.data;
                    seriesR0.dataFields.openValueY = "high" + i + "Up";
                    seriesR0.dataFields.lowValueY = "low" + i + "Up";
                    seriesR0.tooltipText = "[bold] {date}[/] \n" + _VrnameUp[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR0.tooltip.getFillFromObject = false;
                    seriesR0.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR0.tooltip.autoTextColor = false;
                    seriesR0.tooltip.label.fill = am4core.color("#000000");
                    seriesR0.tooltip.label.fontSize = 13;
                    seriesR0.tooltip.label.fontFamily = "SF UI Text"
                    seriesR0.tensionX = 0.9;
                    seriesR0.strokeWidth = 1.5;
                    seriesR0.defaultState.transitionDuration = 1500;
                    seriesR0.yAxis = yAxis_value;

                    var bullet = seriesR0.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR0.stroke = am4core.color(_ColorUp[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_ColorUp[0]);

                    // Create series for Close
                    var seriesC0 = createSeries("high" + i + "Up", "high", true);
                    seriesC0.data = chart.data;
                    seriesC0.dataFields.openValueY = "mid" + i + "Up";
                    // seriesC0.tooltipText = "{name}-{valueY} ";
                    seriesC0.fillOpacity = 0.3;
                    seriesC0.tensionX = 0.9;
                    seriesC0.strokeWidth = 0;
                    seriesC0.defaultState.transitionDuration = 1500;
                    seriesC0.yAxis = yAxis_value;
                    seriesC0.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    // Create series for open
                    var seriesO0 = createSeries("low" + i + "Up", "low", true);
                    seriesO0.data = chart.data;
                    seriesO0.dataFields.openValueY = "mid" + i + "Up";
                    seriesO0.fillOpacity = 0.3;
                    // seriesO0.tooltipText = "{name}:{valueY} ";
                    seriesO0.tensionX = 0.9;
                    seriesO0.strokeWidth = 0;
                    seriesO0.defaultState.transitionDuration = 1500;
                    seriesO0.yAxis = yAxis_value;
                    seriesO0.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    seriesR0.events.on("hidden", function () {
                        seriesC0.hide();
                        seriesO0.hide();
                    });

                    seriesR0.events.on("shown", function () {
                        seriesC0.show();
                        seriesO0.show();
                    });

                }

                //Range1          
                if (i == 1) {

                    // Create series for Mid
                    var seriesR1 = createSeries("mid" + i + "Up", _KFName[_S1 + i], false)
                    seriesR1.data = chart.data;
                    seriesR1.dataFields.openValueY = "high" + i + "Up";
                    seriesR1.dataFields.lowValueY = "low" + i + "Up";
                    seriesR1.tooltipText = "[bold] {date}[/] \n " + _VrnameUp[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR1.tooltip.getFillFromObject = false;
                    seriesR1.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR1.tooltip.autoTextColor = false;
                    seriesR1.tooltip.label.fill = am4core.color("#000000");
                    seriesR1.tooltip.label.fontSize = 13;
                    seriesR1.tooltip.label.fontFamily = "SF UI Text"
                    seriesR1.tensionX = 0.9;
                    seriesR1.strokeWidth = 1.5;
                    seriesR1.defaultState.transitionDuration = 1500;
                    seriesR1.yAxis = yAxis_value;

                    var bullet = seriesR1.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR1.stroke = am4core.color(_ColorUp[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_ColorUp[0]);

                    // Create series for Close
                    var seriesC1 = createSeries("high" + i + "Up", "high", true);
                    seriesC1.data = chart.data;
                    seriesC1.dataFields.openValueY = "mid" + i + "Up";
                    // seriesC1.tooltipText = "{name}-{valueY} ";
                    seriesC1.fillOpacity = 0.3;
                    seriesC1.tensionX = 0.9;
                    seriesC1.strokeWidth = 0;
                    seriesC1.defaultState.transitionDuration = 1500;
                    seriesC1.yAxis = yAxis_value;
                    seriesC1.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    // Create series for open
                    var seriesO1 = createSeries("low" + i + "Up", "low", true);
                    seriesO1.data = chart.data;
                    seriesO1.dataFields.openValueY = "mid" + i + "Up";
                    seriesO1.fillOpacity = 0.3;
                    // seriesO1.tooltipText = "{name}-{valueY} ";
                    seriesO1.tensionX = 0.9;
                    seriesO1.strokeWidth = 0;
                    seriesO1.defaultState.transitionDuration = 1500;
                    seriesO1.yAxis = yAxis_value;
                    seriesO1.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    seriesR1.events.on("hidden", function () {
                        seriesC1.hide();
                        seriesO1.hide();
                    });

                    seriesR1.events.on("shown", function () {
                        seriesC1.show();
                        seriesO1.show();
                    });

                }

                //Range2         
                if (i == 2) {

                    // Create series for Mid
                    var seriesR2 = createSeries("mid" + i + "Up", _KFName[_S1 + i], false)
                    seriesR2.data = chart.data;
                    seriesR2.dataFields.openValueY = "high" + i + "Up";
                    seriesR2.dataFields.lowValueY = "low" + i + "Up";
                    seriesR2.tooltipText = "[bold] {date}[/] \n " + _VrnameUp[0] + "\n {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR2.tooltip.getFillFromObject = false;
                    seriesR2.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR2.tooltip.autoTextColor = false;
                    seriesR2.tooltip.label.fill = am4core.color("#000000");
                    seriesR2.tooltip.label.fontSize = 13;
                    seriesR2.tooltip.label.fontFamily = "SF UI Text"
                    seriesR2.tensionX = 0.9;
                    seriesR2.strokeWidth = 1.5;
                    seriesR2.defaultState.transitionDuration = 1500;
                    seriesR2.yAxis = yAxis_value;

                    var bullet = seriesR2.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR2.stroke = am4core.color(_ColorUp[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_ColorUp[0]);

                    // Create series for Close
                    var seriesC2 = createSeries("high" + i + "Up", "high", true);
                    seriesC2.data = chart.data;
                    seriesC2.dataFields.openValueY = "mid" + i + "Up";
                    // seriesC2.tooltipText = "{name}-{valueY} ";
                    seriesC2.fillOpacity = 0.3;
                    seriesC2.tensionX = 0.9;
                    seriesC2.strokeWidth = 0;
                    seriesC2.defaultState.transitionDuration = 1500;
                    seriesC2.yAxis = yAxis_value;
                    seriesC2.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    // Create series for open
                    var seriesO2 = createSeries("low" + i + "Up", "low", true);
                    seriesO2.data = chart.data;
                    seriesO2.dataFields.openValueY = "mid" + i + "Up";
                    seriesO2.fillOpacity = 0.3;
                    // seriesO2.tooltipText = "{name}-{valueY} ";
                    seriesO2.tensionX = 0.9;
                    seriesO2.strokeWidth = 0;
                    seriesO2.defaultState.transitionDuration = 1500;
                    seriesO2.yAxis = yAxis_value;
                    seriesO2.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    seriesR2.events.on("hidden", function () {
                        seriesC2.hide();
                        seriesO2.hide();
                    });

                    seriesR2.events.on("shown", function () {
                        seriesC2.show();
                        seriesO2.show();
                    });

                }

                //Range3          
                if (i == 3) {

                    // Create series for Mid
                    var seriesR3 = createSeries("mid" + i + "Up", _KFName[_S1 + i], false)
                    seriesR3.data = chart.data;
                    seriesR3.dataFields.openValueY = "high" + i + "Up";
                    seriesR3.dataFields.lowValueY = "low" + i + "Up";
                    seriesR3.tooltipText = "[bold] {date}[/] \n " + _VrnameUp[0] + "\n  {name}: {valueY} \n High: {openValueY} \n Low: {lowValueY}";
                    seriesR3.tooltip.getFillFromObject = false;
                    seriesR3.tooltip.background.fill = am4core.color("#F8F8F8");
                    seriesR3.tooltip.autoTextColor = false;
                    seriesR3.tooltip.label.fill = am4core.color("#000000");
                    seriesR3.tooltip.label.fontSize = 13;
                    seriesR3.tooltip.label.fontFamily = "SF UI Text";
                    seriesR3.tensionX = 0.9;
                    seriesR3.strokeWidth = 1.5;
                    seriesR3.defaultState.transitionDuration = 1500;
                    seriesR3.yAxis = yAxis_value;

                    var bullet = seriesR3.bullets.push(new am4charts.Bullet());
                    var square = bullet.createChild(BS[i]);
                    seriesR3.stroke = am4core.color(_ColorUp[0]);
                    square.width = 6;
                    square.height = 6;
                    square.horizontalCenter = "middle";
                    square.verticalCenter = "middle";
                    square.fill = am4core.color(_ColorUp[0]);

                    // Create series for Close
                    var seriesC3 = createSeries("high" + i + "Up", "high", true);
                    seriesC3.data = chart.data;
                    seriesC3.dataFields.openValueY = "mid" + i + "Up";
                    // seriesC3.tooltipText = "{name}-{valueY} ";
                    seriesC3.fillOpacity = 0.3;
                    seriesC3.tensionX = 0.9;
                    seriesC3.strokeWidth = 0;
                    seriesC3.defaultState.transitionDuration = 1500;
                    seriesC3.yAxis = yAxis_value;
                    seriesC3.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    // Create series for open
                    var seriesO3 = createSeries("low" + i + "Up", "low", true);
                    seriesO3.data = chart.data;
                    seriesO3.dataFields.openValueY = "mid" + i + "Up";
                    seriesO3.fillOpacity = 0.3;
                    // seriesO3.tooltipText = "{name}-{valueY} ";
                    seriesO3.tensionX = 0.9;
                    seriesO3.strokeWidth = 0;
                    seriesO3.defaultState.transitionDuration = 1500;
                    seriesO3.yAxis = yAxis_value;
                    seriesO3.fill = am4core.color(_ColorUp[0]).lighten(0.3);

                    seriesR3.events.on("hidden", function () {
                        seriesC3.hide();
                        seriesO3.hide();
                    });

                    seriesR3.events.on("shown", function () {
                        seriesC3.show();
                        seriesO3.show();
                    });

                }

            }
        }

        { // Add Cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.disabled = true;
            // chart.cursor.xAxis = dateAxis;
        }

        // chart.events.on("up", function () {
        //     if (click && that.Position === 'down') {
        //         min = new Date(dateAxis.minZoomed);
        //         console.log(min);
        //         // console.log(new Date(min.getFullYear,min.getMonth,0));
        //         max = new Date(dateAxis.maxZoomed);
        //     }

        //     click = 1;
        // });

        { // Add Scroller
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            // if (that.Position === 'up') {
            //     chart.scrollbarX.disabled = true;
            //     dateAxis.renderer.labels.template.disabled = true;
            //     dateAxis1.renderer.labels.template.disabled = true;
            //     chart.paddingBottom = 30;
            //     chart.zoomOutButton.disabled = true;

            //     // chart.paddingRight = -10;
            //     // dateAxis.renderer.line.strokeOpacity = 0;
            //     // dateAxis.renderer.line.strokeWidth = 0;
            //     // } else {
            // }

            // chart.zoomOutButton.events.on("Click", function () {
            //     console.log("-----------ABCDE-----------");

            //     min = new Date(dateAxis.minZoomed);
            //     max = new Date(dateAxis.maxZoomed);
            //     console.log("Click :-" + min);
            //     console.log("Click :-" + max);
            // });



            // chart.scrollbarX.events.on("rangechanged", function (ev) {

            //     if (max && min && that.Position === 'up') {
            //         // if(check){
            //         //     chart.scrollbarX.disabled = true;
            //         //     check = 0;
            //         // }
            //         console.log("----------------Rangechanged Start-------------------------");
            //         // console.log(changedProperties.widgetName);
            //         // count++;
            //         // console.log("Click");
            //         // console.log(min);
            //         // console.log(max);
            //         dateAxis.zoomToDates(min, max);
            //         dateAxis1.zoomToDates(min, max);
            //         click = 1;
            //         // count = 0;
            //         console.log("-------------------Rangechanged End----------------------");
            //         // } else {
            //         //     console.log('-------------ABC--------------');
            //         //     console.log("Click");
            //         //     console.log(count);
            //         //     console.log(min);
            //         //     console.log(max);
            //         // count++;
            //     }

            //     if (rng) {
            //         minrng = new Date(dateAxis.minZoomed);
            //         maxrng = new Date(dateAxis.maxZoomed);
            //         rng = 0;
            //     }



            // });

            // chart.zoomOutButton.events.on("up", function () {

            //     min = minrng;
            //     max = maxrng;
            //     console.log("Click :-" + min);
            //     console.log("Click :-" + max);
            //     click = 0;
            // });
        }

        chart.cursor.maxTooltipDistance = 20;

        { // Add legend
            chart.legend = new am4charts.Legend();
            chart.legend.position = "top";
            chart.legend.contentAlign = "right";
            chart.legend.labels.template.fontSize = 13;
            chart.legend.labels.template.fontFamily = "SF UI Text";
            chart.legend.itemContainers.template.clickable = false
            chart.legend.itemContainers.template.focusable = false
            chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
        }

        // console.log(that.height);
    }

})();

// "body": "this.resultset_1 = resultset; this.KFName_1 = KFName; this.Vrname_1 = Vrname; this.YDirection_1 = YDirection; this.S1_1 = S1; this.S2_1 = S2; this.ReplaceNull_1 = ReplaceNull; this.DateAxes_1 = DateAxes; this.Isyear_1 = Isyear;"