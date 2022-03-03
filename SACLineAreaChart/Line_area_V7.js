var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {

    let template = document.createElement("template");
    template.innerHTML = ` 
        <div id="chart_div" style="width: 100%; height: 100%"></div>
     `;

    class amLineChart extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._root = this._shadowRoot.getElementById("chart_div");

            this._props = {};
            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);
            });
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            render(that, this._root, changedProperties);
        }

        _firePropertiesChanged() {
            this.selectedNode = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        selectedNode: this.selectedNode
                    }
                }
            }))
        }
    }
    customElements.define("line-series-chart", amLineChart);

    async function render(that, root1) {


        //<----------------------Data Preparation--------------------------->//

        var sel = that.resultset;
        var range = that.range_1;
        var dimension_name = [];
        dimension_name = that.Dimname_1;

        console.log(dimension_name);

        var data = [];

        var all_arr = [];
        var line_arr = [];

        var all = sel[0]["@MeasureDimension"].description;
        all_arr.push(all);

        for (var i = 1; i < sel.length; i++) {
            if (all !== sel[i]["@MeasureDimension"].description) {
                all_arr.push(sel[i]["@MeasureDimension"].description);
            }
            else {
                break;
            }
        }

        for (var j = 0; j < all_arr.length; j++) {
            if (all_arr[j].charAt(1) === "_") {
                line_arr.push(all_arr[j].slice(1, all_arr[j].length));
            }
        }

        console.log(all_arr);
        console.log(line_arr);


        if (sel[0][dimension_name[0]].id.charAt(4) == '-' && sel[0][dimension_name[0]].id.charAt(7) == '-') {
            var date1 = 1;
        }

        for (var k = 0; k < sel.length; k = k + all_arr.length) {
            var a = {

            };

            if (date1) {
                a[dimension_name[0]] = new Date(sel[k][dimension_name[0]].description);
            }
            else {
                a[dimension_name[0]] = sel[k][dimension_name[0]].description;
            }

            for (var m = 0; m < all_arr.length; m++) {
                if (sel[k + m]["@MeasureDimension"].formattedValue == 0) {
                    a[all_arr[m]] = null;
                }
                else {
                    a[all_arr[m]] = sel[k + m]["@MeasureDimension"].formattedValue;
                }


            }
            data.push(a);
        }
        console.log(data);

        //<------------------------------------------------------------------>//

        //<----------------------Chart Preparation--------------------------->//

        await getScriptPromisify("https://cdn.amcharts.com/lib/4/core.js");
        await getScriptPromisify("https://cdn.amcharts.com/lib/4/charts.js");
        await getScriptPromisify("https://cdn.amcharts.com/lib/4/themes/animated.js");

        am4core.useTheme(am4themes_animated);


        var chart = am4core.create(root1, am4charts.XYChart);

        var title = chart.titles.create();
        title.text = "Line Chart";
        title.fontSize = 25;
        title.marginBottom = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = 20;

        chart.data = data;

        // Add Scroller
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        // Create axes

        if (date1) {
            var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
            categoryAxis.renderer.minGridDistance = 0;
            categoryAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");
            categoryAxis.skipEmptyPeriods = true;
            categoryAxis.title.text = "[bold]Year";
        } else {
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = dimension_name[0];
        }

        var yaxis=chart.yAxes.push(new am4charts.ValueAxis());
        var yaxisright=chart.yAxes.push(new am4charts.ValueAxis());
        var yaxisup=chart.yAxes.push(new am4charts.ValueAxis());
        var yaxisrightup=chart.yAxes.push(new am4charts.ValueAxis());

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "[bold]Values"
        valueAxis1.renderer.maxLabelPosition = 0.95;

        //<------------------------------------------------------------------>//

        //<----------------------Chart Plotting------------------------------>//

        // Create Line
        for (var n = 0; n < line_arr.length; n++) {
            var series0 = chart.series.push(new am4charts.LineSeries());
            series0.data = chart.data;
            series0.dataFields.valueY = 'L' + line_arr[n];


            if (date1) {
                series0.dataFields.dateX = dimension_name[0];
            } else {
                series0.dataFields.categoryX = dimension_name[0];
            }

            series0.name = 'L' + line_arr[n];
            series0.tooltipText = " [bold]{name}[\]:{valueY.value} \n{dateX.formatDate('MMM yyyy')}";
            series0.bullets.push(new am4charts.CircleBullet());
            series0.yAxis = valueAxis1;

            console.log(range);
            // Low
            if (range) {

                if (all_arr.includes('RL' + line_arr[n])) {
                    var series2 = chart.series.push(new am4charts.LineSeries());
                    series2.data = chart.data;
                    series2.dataFields.valueY = "RL" + line_arr[n];
                    if (dimension_name[0] == "Year") {
                        series2.dataFields.dateX = dimension_name[0];
                    }
                    if (dimension_name[0] == "Order") {
                        series2.dataFields.categoryX = dimension_name[0];
                    }
                    series2.dataFields.openValueY = "L" + line_arr[n];
                    series2.fillOpacity = 0.3;
                    series2.tensionX = 0.9;
                    series2.defaultState.transitionDuration = 1500;
                    series2.strokeWidth = 0;
                    series2.name = "RL" + line_arr[n];
                    series2.yAxis = valueAxis1;
                }

                if (all_arr.includes('RH' + line_arr[n])) {
                    //High
                    var series3 = chart.series.push(new am4charts.LineSeries());
                    series3.data = chart.data;
                    series3.dataFields.valueY = "RH" + line_arr[n];
                    if (dimension_name[0] == "Year") {
                        series3.dataFields.dateX = dimension_name[0];
                    }
                    if (dimension_name[0] == "Order") {
                        series3.dataFields.categoryX = dimension_name[0];
                    }
                    series3.dataFields.openValueY = "L" + line_arr[n];
                    series3.fillOpacity = 0.3;
                    series3.tensionX = 0.9;
                    series3.defaultState.transitionDuration = 1500;
                    series3.strokeWidth = 0;
                    series3.name = "RH" + line_arr[n];
                    series3.yAxis = valueAxis1;
                }
            }
        }
    }

})();