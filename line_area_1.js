var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {

  //Chart Block in HTML
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
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

      //Call render() method to plot chart
      this.render(this._resultSet, this.KFName, this._S1, this._S2, this.ReplaceNull)

    }

    //render() method to plot chart - resultSet1 holds data from SAC table/chart.
    async render(resultSet1, _KFName, _S1, _S2, _ReplaceNull) {

      await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

      // anychart.onDocumentReady(function () {
      am4core.useTheme(am4themes_animated);
      // Themes end

      var chart = am4core.create(this._root, am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      console.log("Resultset :", resultSet1);
      console.log("S1:", _S1);
      console.log("S2:", _S2);

      var data = [];

      var len = resultSet1.length;
      console.log("lenght :", len);

      var inc = _S1 + _S2 * 3;

      for (var i = 0; i < len; i = i + inc) {

        var ActualAmount = [null, null, null, null];
        var RangeAmount = [null, null, null, null, null, null, null, null, null, null, null, null];

        for (var j = 0; j < _S1; j++) {
          ActualAmount[j] = resultSet1[i + j]["@MeasureDimension"].rawValue;

          if (ActualAmount[j] == _ReplaceNull) { ActualAmount[j] = null; }
        }

        for (var k = 0; j < inc; j++, k++) {
          RangeAmount[k] = resultSet1[i + j]["@MeasureDimension"].rawValue;

          if (RangeAmount[k] == _ReplaceNull) { RangeAmount[k] = null; }
        }

        var a = {
          date: new Date(resultSet1[i]["Year"].id),
          A0: ActualAmount[0],
          A1: ActualAmount[1],
          A2: ActualAmount[2],
          A3: ActualAmount[3],
          mid0: RangeAmount[0],
          close0: RangeAmount[1],
          open0: RangeAmount[2],
          mid1: RangeAmount[3],
          close1: RangeAmount[4],
          open1: RangeAmount[5],
          mid2: RangeAmount[6],
          close2: RangeAmount[7],
          open2: RangeAmount[8],
          mid3: RangeAmount[9],
          close3: RangeAmount[10],
          open3: RangeAmount[11]
        }

        data.push(a);
      }

      chart.data = data;
      chart.leftAxesContainer.layout = "vertical";
      chart.rightAxesContainer.layout = "vertical";

      {// Axis

        var interfaceColors = new am4core.InterfaceColorSet();

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.startLocation = -0.5;
        dateAxis.endLocation = 1.5;
        dateAxis.dateFormats.setKey("month", "Qq");

        var valueAxisLTop = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxisLTop.renderer.grid.template.disabled = true;
        valueAxisLTop.marginBottom = 30;
        // valueAxisLTop.renderer.baseGrid.disabled = true;

        var valueAxisLeft = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxisLeft.renderer.grid.template.disabled = true;
        // valueAxisLeft.renderer.baseGrid.disabled = true;

        var valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisRight.renderer.opposite = true;
        valueAxisRight.renderer.grid.template.disabled = true;
        // valueAxisRight.renderer.baseGrid.disabled = true;

        var valueAxisRTop = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisRTop.renderer.opposite = true;
        valueAxisRTop.renderer.grid.template.disabled = true;
        valueAxisRTop.marginBottom = 30;
        // valueAxisRTop.renderer.baseGrid.disabled = true;
      }


      // Series Style
      {
        var SS = ["1,2", "1", "4,1", "6,2,1"];
      }

      // Bullets Style
      {
        var BS = [am4core.Rectangle,
        am4core.Circle,
        am4core.Triangle,
        am4core.Circle];
      }

      console.log('Name: ' + _KFName);

      // Create Shaded ranges & reference line
{
      var ranges1 = dateAxis.axisRanges.create();
      ranges1.date = new Date(2002, 1, 4);
      ranges1.endDate = new Date(2002, 12, 30);
      ranges1.axisFill.fill = am4core.color("#FF0000");
      ranges1.grid.disabled = true;
      ranges1.axisFill.fillOpacity = 0.04;
      ranges1.label.inside = true;
      ranges1.label.text = "[bold]|" + "[normal] Gx Entry-Date : " + "[bold]{date}";
      ranges1.label.dy = -480.86;
      ranges1.label.dx = 94;
      ranges1.label.fill = "#FF0000";

      var ranges1 = dateAxis.axisRanges.create();
      ranges1.date = new Date(2002, 4, 22);
      ranges1.endDate = new Date(2002, 12, 30);
      ranges1.axisFill.fill = am4core.color("#0000FF");
      ranges1.grid.disabled = true;
      ranges1.axisFill.fillOpacity = 0.04;
      ranges1.label.inside = true;
      ranges1.label.text = "[bold]|" + "[normal] Gx Entry-Date : " + "[bold]{date}";
      ranges1.label.dy = -480.86;
      ranges1.label.dx = 94;
      ranges1.label.fill = "#0000FF";

      var ranges1 = dateAxis.axisRanges.create();
      ranges1.date = new Date(2018, 3, 28);
      ranges1.grid.stroke = am4core.color("red");
      ranges1.grid.strokeWidth = 4;
      ranges1.opacity = 1;
      /* ranges1.label.inside = true; */
      var ranges1 = dateAxis.axisRanges.create();
      ranges1.date = new Date(2018, 3, 29);
      ranges1.grid.stroke = am4core.color("green");
      ranges1.grid.strokeWidth = 4;
      ranges1.grid.strokeDasharray = "3,3";
      /* ranges1.opacity = 1; */
      /* ranges1.label.inside = true; */

      dateAxis.cursorTooltipEnabled = false;
      // valueAxis.cursorTooltipEnabled = false;

      chart.cursor = new am4charts.XYCursor();
      chart.dateFormatter.dateFormat = "MMM-yyyy";
}
      //Section1
      {
        for (var i = 0; i < _S1; i++) {
          // Create series for Actuals

          var series0 = chart.series.push(new am4charts.LineSeries());
          series0.data = chart.data;
          series0.dataFields.valueY = "A" + i;
          series0.dataFields.dateX = "date";
          series0.name = _KFName[i];
          series0.tooltipText = " {name}-{valueY.value} ";
          series0.tensionX = 0.9;
          series0.strokeWidth = 2.5;
          series0.defaultState.transitionDuration = 1500;
          series0.yAxis = valueAxisLeft;
          series0.strokeDasharray = SS[i];
          var bullet = series0.bullets.push(new am4charts.Bullet());
          var square = bullet.createChild(BS[i]);
          square.width = 10;
          square.height = 10;
          square.horizontalCenter = "middle";
          square.verticalCenter = "middle";
        }
      }

      //Section1   Top
      {
        for (var i = 0; i < _S1; i++) {
          // Create series for Actuals

          var seriesT0 = chart.series.push(new am4charts.LineSeries());
          seriesT0.data = chart.data;
          seriesT0.dataFields.valueY = "A" + i;
          seriesT0.dataFields.dateX = "date";
          seriesT0.name = "T" + _KFName[i];
          seriesT0.tooltipText = " {name}-{valueY.value} ";
          seriesT0.tensionX = 0.9;
          seriesT0.strokeWidth = 2.5;
          seriesT0.defaultState.transitionDuration = 1500;
          seriesT0.yAxis = valueAxisLTop;
          seriesT0.strokeDasharray = SS[i];
          var bullet = seriesT0.bullets.push(new am4charts.Bullet());
          var square = bullet.createChild(BS[i]);
          square.width = 10;
          square.height = 10;
          square.horizontalCenter = "middle";
          square.verticalCenter = "middle";
        }
      }

      //Section 2 Using For Loop
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

          //Range0
          if (i == 0) {

            // Create series for Mid
            var seriesR0 = createSeries("mid" + i, _KFName[_S1 + i], false)
            seriesR0.data = chart.data;
            seriesR0.tooltipText = " {name}-{valueY.value} ";
            seriesR0.tensionX = 0.9;
            seriesR0.strokeWidth = 2.5;
            seriesR0.defaultState.transitionDuration = 1500;
            seriesR0.yAxis = valueAxisRight;
            var bullet = seriesR0.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC0 = createSeries("close" + i, "close", true);
            seriesC0.data = chart.data;
            seriesC0.dataFields.openValueY = "mid" + i;
            // seriesC0.tooltipText = " {name}-{valueY.value} ";
            seriesC0.fillOpacity = 0.2;
            seriesC0.tensionX = 0.9;
            seriesC0.strokeWidth = 0;
            seriesC0.defaultState.transitionDuration = 1500;
            seriesC0.yAxis = valueAxisRight;

            // Create series for open
            var seriesO0 = createSeries("open" + i, "open", true);
            seriesO0.data = chart.data;
            seriesO0.dataFields.openValueY = "mid" + i;
            seriesO0.fillOpacity = 0.2;
            // seriesO0.tooltipText = " {name}-{valueY.value} ";
            seriesO0.tensionX = 0.9;
            seriesO0.strokeWidth = 0;
            seriesO0.defaultState.transitionDuration = 1500;
            seriesO0.yAxis = valueAxisRight;

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
            seriesR1.tooltipText = " {name}-{valueY.value} ";
            seriesR1.tensionX = 0.9;
            seriesR1.strokeWidth = 2.5;
            seriesR1.defaultState.transitionDuration = 1500;
            seriesR1.yAxis = valueAxisRight;
            var bullet = seriesR1.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC1 = createSeries("close" + i, "close", true);
            seriesC1.data = chart.data;
            seriesC1.dataFields.openValueY = "mid" + i;
            // seriesC1.tooltipText = " {name}-{valueY.value} ";
            seriesC1.fillOpacity = 0.2;
            seriesC1.tensionX = 0.9;
            seriesC1.strokeWidth = 0;
            seriesC1.defaultState.transitionDuration = 1500;
            seriesC1.yAxis = valueAxisRight;

            // Create series for open
            var seriesO1 = createSeries("open" + i, "open", true);
            seriesO1.data = chart.data;
            seriesO1.dataFields.openValueY = "mid" + i;
            seriesO1.fillOpacity = 0.2;
            // seriesO1.tooltipText = " {name}-{valueY.value} ";
            seriesO1.tensionX = 0.9;
            seriesO1.strokeWidth = 0;
            seriesO1.defaultState.transitionDuration = 1500;
            seriesO1.yAxis = valueAxisRight;

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
            seriesR2.tooltipText = " {name}-{valueY.value} ";
            seriesR2.tensionX = 0.9;
            seriesR2.strokeWidth = 2.5;
            seriesR2.defaultState.transitionDuration = 1500;
            seriesR2.yAxis = valueAxisRight;
            var bullet = seriesR2.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC2 = createSeries("close" + i, "close", true);
            seriesC2.data = chart.data;
            seriesC2.dataFields.openValueY = "mid" + i;
            // seriesC2.tooltipText = " {name}-{valueY.value} ";
            seriesC2.fillOpacity = 0.2;
            seriesC2.tensionX = 0.9;
            seriesC2.strokeWidth = 0;
            seriesC2.defaultState.transitionDuration = 1500;
            seriesC2.yAxis = valueAxisRight;

            // Create series for open
            var seriesO2 = createSeries("open" + i, "open", true);
            seriesO2.data = chart.data;
            seriesO2.dataFields.openValueY = "mid" + i;
            seriesO2.fillOpacity = 0.2;
            // seriesO2.tooltipText = " {name}-{valueY.value} ";
            seriesO2.tensionX = 0.9;
            seriesO2.strokeWidth = 0;
            seriesO2.defaultState.transitionDuration = 1500;
            seriesO2.yAxis = valueAxisRight;

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
            seriesR3.tooltipText = " {name}-{valueY.value} ";
            seriesR3.tensionX = 0.9;
            seriesR3.strokeWidth = 2.5;
            seriesR3.defaultState.transitionDuration = 1500;
            seriesR3.yAxis = valueAxisRight;
            var bullet = seriesR3.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC3 = createSeries("close" + i, "close", true);
            seriesC3.data = chart.data;
            seriesC3.dataFields.openValueY = "mid" + i;
            // seriesC3.tooltipText = " {name}-{valueY.value} ";
            seriesC3.fillOpacity = 0.2;
            seriesC3.tensionX = 0.9;
            seriesC3.strokeWidth = 0;
            seriesC3.defaultState.transitionDuration = 1500;
            seriesC3.yAxis = valueAxisRight;

            // Create series for open
            var seriesO3 = createSeries("open" + i, "open", true);
            seriesO3.data = chart.data;
            seriesO3.dataFields.openValueY = "mid" + i;
            seriesO3.fillOpacity = 0.2;
            // seriesO3.tooltipText = " {name}-{valueY.value} ";
            seriesO3.tensionX = 0.9;
            seriesO3.strokeWidth = 0;
            seriesO3.defaultState.transitionDuration = 1500;
            seriesO3.yAxis = valueAxisRight;

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

        for (var i = 0; i < _S2; i++) {

          //Range0
          if (i == 0) {

            // Create series for Mid
            var seriesR0 = createSeries("mid" + i, "T" + _KFName[_S1 + i], false)
            seriesR0.data = chart.data;
            seriesR0.tooltipText = " {name}-{valueY.value} ";
            seriesR0.tensionX = 0.9;
            seriesR0.strokeWidth = 2.5;
            seriesR0.defaultState.transitionDuration = 1500;
            seriesR0.yAxis = valueAxisRTop;
            var bullet = seriesR0.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC0 = createSeries("close" + i, "T" + "close", true);
            seriesC0.data = chart.data;
            seriesC0.dataFields.openValueY = "mid" + i;
            // seriesC0.tooltipText = " {name}-{valueY.value} ";
            seriesC0.fillOpacity = 0.2;
            seriesC0.tensionX = 0.9;
            seriesC0.strokeWidth = 0;
            seriesC0.defaultState.transitionDuration = 1500;
            seriesC0.yAxis = valueAxisRTop;

            // Create series for open
            var seriesO0 = createSeries("open" + i, "T" + "open", true);
            seriesO0.data = chart.data;
            seriesO0.dataFields.openValueY = "mid" + i;
            seriesO0.fillOpacity = 0.2;
            // seriesO0.tooltipText = " {name}-{valueY.value} ";
            seriesO0.tensionX = 0.9;
            seriesO0.strokeWidth = 0;
            seriesO0.defaultState.transitionDuration = 1500;
            seriesO0.yAxis = valueAxisRTop;

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
            var seriesR1 = createSeries("mid" + i, "T" + _KFName[_S1 + i], false)
            seriesR1.data = chart.data;
            seriesR1.tooltipText = " {name}-{valueY.value} ";
            seriesR1.tensionX = 0.9;
            seriesR1.strokeWidth = 2.5;
            seriesR1.defaultState.transitionDuration = 1500;
            seriesR1.yAxis = valueAxisRTop;
            var bullet = seriesR1.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC1 = createSeries("close" + i, "T" + "close", true);
            seriesC1.data = chart.data;
            seriesC1.dataFields.openValueY = "mid" + i;
            // seriesC1.tooltipText = " {name}-{valueY.value} ";
            seriesC1.fillOpacity = 0.2;
            seriesC1.tensionX = 0.9;
            seriesC1.strokeWidth = 0;
            seriesC1.defaultState.transitionDuration = 1500;
            seriesC1.yAxis = valueAxisRTop;

            // Create series for open
            var seriesO1 = createSeries("open" + i, "T" + "open", true);
            seriesO1.data = chart.data;
            seriesO1.dataFields.openValueY = "mid" + i;
            seriesO1.fillOpacity = 0.2;
            // seriesO1.tooltipText = " {name}-{valueY.value} ";
            seriesO1.tensionX = 0.9;
            seriesO1.strokeWidth = 0;
            seriesO1.defaultState.transitionDuration = 1500;
            seriesO1.yAxis = valueAxisRTop;

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
            var seriesR2 = createSeries("mid" + i, "T" + _KFName[_S1 + i], false)
            seriesR2.data = chart.data;
            seriesR2.tooltipText = " {name}-{valueY.value} ";
            seriesR2.tensionX = 0.9;
            seriesR2.strokeWidth = 2.5;
            seriesR2.defaultState.transitionDuration = 1500;
            seriesR2.yAxis = valueAxisRTop;
            var bullet = seriesR2.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC2 = createSeries("close" + i, "T" + "close", true);
            seriesC2.data = chart.data;
            seriesC2.dataFields.openValueY = "mid" + i;
            // seriesC2.tooltipText = " {name}-{valueY.value} ";
            seriesC2.fillOpacity = 0.2;
            seriesC2.tensionX = 0.9;
            seriesC2.strokeWidth = 0;
            seriesC2.defaultState.transitionDuration = 1500;
            seriesC2.yAxis = valueAxisRTop;

            // Create series for open
            var seriesO2 = createSeries("open" + i, "T" + "open", true);
            seriesO2.data = chart.data;
            seriesO2.dataFields.openValueY = "mid" + i;
            seriesO2.fillOpacity = 0.2;
            // seriesO2.tooltipText = " {name}-{valueY.value} ";
            seriesO2.tensionX = 0.9;
            seriesO2.strokeWidth = 0;
            seriesO2.defaultState.transitionDuration = 1500;
            seriesO2.yAxis = valueAxisRTop;

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
            var seriesR3 = createSeries("mid" + i, "T" + _KFName[_S1 + i], false)
            seriesR3.data = chart.data;
            seriesR3.tooltipText = " {name}-{valueY.value} ";
            seriesR3.tensionX = 0.9;
            seriesR3.strokeWidth = 2.5;
            seriesR3.defaultState.transitionDuration = 1500;
            seriesR3.yAxis = valueAxisRTop;
            var bullet = seriesR3.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";

            // Create series for Close
            var seriesC3 = createSeries("close" + i, "T" + "close", true);
            seriesC3.data = chart.data;
            seriesC3.dataFields.openValueY = "mid" + i;
            // seriesC3.tooltipText = " {name}-{valueY.value} ";
            seriesC3.fillOpacity = 0.2;
            seriesC3.tensionX = 0.9;
            seriesC3.strokeWidth = 0;
            seriesC3.defaultState.transitionDuration = 1500;
            seriesC3.yAxis = valueAxisRTop;

            // Create series for open
            var seriesO3 = createSeries("open" + i, "T" + "open", true);
            seriesO3.data = chart.data;
            seriesO3.dataFields.openValueY = "mid" + i;
            seriesO3.fillOpacity = 0.2;
            // seriesO3.tooltipText = " {name}-{valueY.value} ";
            seriesO3.tensionX = 0.9;
            seriesO3.strokeWidth = 0;
            seriesO3.defaultState.transitionDuration = 1500;
            seriesO3.yAxis = valueAxisRTop;

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

      {// Add Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
      }

      {// Add Scroller
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;
      }

      {// Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";
        chart.legend.contentAlign = "center";
      }

    }
  }
  customElements.define('com-sap-sample-linearea-prepared', SamplePrepared)
})()