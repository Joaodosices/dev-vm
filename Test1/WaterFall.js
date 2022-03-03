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

      this.addEventListener("click", event => {
        var event = new Event("onClick");
        this.dispatchEvent(event);

      });

      //_props object is used to hold properties information
      this._props = {}

      //Call render() method to plot chart
      this.render(this.resultSet, this.DimID, this.WF1, this.WF2)
    }

    onCustomWidgetAfterUpdate() {
      this.render(this.resultSet, this.DimID, this.WF1, this.WF2);
    }

    //render() method to plot chart - resultSet1 holds data from SAC table/chart.
    async render(resultSet1, DimID1, WF11, WF21) {

      await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
      var y1 = [];
      var y6 = [];
      var delta = [];
      var deltanum = [];
      let sum = 0;
      var measure1 = [];
      var xx = [];
      var text1 = [];
      var yy = [];

      if (resultSet1.length >= 3) {
        measure1.push("absolute");
        measure1.push("relative");
        for (var i = 0; i < resultSet1.length; i = i + 3) {
          y1.push(resultSet1[i]["@MeasureDimension"].rawValue);
        }
        var y1last = y1.splice(-1);
        var y1int = parseInt(y1last[0]);
        text1.push(y1int);
        yy.push(y1int);
        for (var k = 2; k < resultSet1.length; k = k + 3) {
          delta.push(resultSet1[k]["@MeasureDimension"].rawValue);
        }
        for (var a = 0; a < delta.length; a++) {
          deltanum.push(parseInt(delta[a]));
        }
        console.log("math");
        console.log(deltanum);
        var y2int = deltanum[0];
        text1.push(y2int);
        yy.push(y2int);
        xx.push(WF11);
        var x2 = DimID1[0];
        xx.push(x2);
      }
      
      if (resultSet1.length >= 6) {
        measure1.push("relative");
        var y3int = deltanum[1];
        text1.push(y3int);
        yy.push(y3int);
        var x3 = DimID1[1];
        xx.push(x3)
      }

      if (resultSet1.length >= 9) {
        measure1.push("relative");
        var y4int = deltanum[2];
        text1.push(y4int);
        yy.push(y4int);
        var x4 = DimID1[2];
        xx.push(x4);
      } 
      
      if (resultSet1.length >= 12) {
        measure1.push("relative");
        let sum = 0;
        for (var b = 3; b < deltanum.length - 1; b++) {
          sum += deltanum[b];
        }
        text1.push(sum);
        yy.push(sum);
        xx.push("Other");
      }

      if (resultSet1.length >= 6) {
        measure1.push("total");
        for (var j = 1; j < resultSet1.length; j = j + 3) {
          y6.push(resultSet1[j]["@MeasureDimension"].rawValue);
        }
        var y6last = y6.splice(-1);
        var y6int = parseInt(y6last[0]);
        text1.push(y6int);
        yy.push(y6int);
        xx.push(WF21);
      }


      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      var chart = am4core.create(this._root, am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      var a = [];
      // using math in the data instead of final values just to illustrate the idea of Waterfall chart
      // a separate data field for step series is added because we don't need last step (notice, the last data item doesn't have stepValue)
      chart.data = [{
        category: xx[0],
        value: yy[0],
        open: 0,
        stepValue: yy[0],
        color: chart.colors.getIndex(1),
        displayValue: text1[0]
      }, {
        category: xx[1],
        value: yy[1] + yy[0],
        open: yy[0],
        stepValue: yy[1] + yy[0],
        // color: chart.colors.getIndex( 8 ),
        displayValue: text1[1]
      }, {
        category: xx[2],
        value: yy[2] + yy[1] + yy[0],
        open: yy[1] + yy[0],
        stepValue: yy[2] + yy[1] + yy[0],
        // color: chart.colors.getIndex( 9 ),
        displayValue: text1[2]
      }, {
        category: xx[3],
        value: yy[3] + yy[2] + yy[1] + yy[0],
        open: yy[2] + yy[1] + yy[0],
        stepValue: yy[3] + yy[2] + yy[1] + yy[0],
        // color: chart.colors.getIndex( 10 ),
        displayValue: text1[3]
      }, {
        category: xx[4],
        value: yy[4] + yy[3] + yy[2] + yy[1] + yy[0],
        open: yy[3] + yy[2] + yy[1] + yy[0],
        stepValue: yy[4] + yy[3] + yy[2] + yy[1] + yy[0],
        // color: chart.colors.getIndex( 16 ),
        displayValue: text1[4]
      }, {
        category: xx[5],
        value: yy[5],
        open: 0,
        color: chart.colors.getIndex(1),
        displayValue: text1[5]
      }];
      console.log("check");
      console.log(xx);
      console.log(yy);
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.renderer.labels.template.rotation = -45;
      categoryAxis.renderer.labels.template.verticalCenter = "left";
      categoryAxis.renderer.labels.template.dx = -10;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      chart.paddingTop = 0;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;

      var columnSeries = chart.series.push(new am4charts.ColumnSeries());
      columnSeries.dataFields.categoryX = "category";
      columnSeries.dataFields.valueY = "value";
      columnSeries.dataFields.openValueY = "open";
      columnSeries.fillOpacity = 0.8;
      columnSeries.sequencedInterpolation = true;
      columnSeries.interpolationDuration = 1500;

      var columnTemplate = columnSeries.columns.template;
      columnTemplate.strokeOpacity = 0;
      columnTemplate.propertyFields.fill = "color";

      var label = columnTemplate.createChild(am4core.Label);
      label.text = "{displayValue.formatNumber('#,## ')}";
      label.align = "center";
      label.verticalCenter = "bottom";

      var stepSeries = chart.series.push(new am4charts.StepLineSeries());
      stepSeries.dataFields.categoryX = "category";
      stepSeries.dataFields.valueY = "stepValue";
      stepSeries.noRisers = true;
      stepSeries.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
      stepSeries.strokeDasharray = "3,3";
      stepSeries.interpolationDuration = 2000;
      stepSeries.sequencedInterpolation = true;

      // because column width is 80%, we modify start/end locations so that step would start with column and end with next column
      stepSeries.startLocation = 0.1;
      stepSeries.endLocation = 1.1;

      categoryAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.grid.template.disabled = true;
      // valueAxis.labels.disabled = true;
      columnTemplate.fill = am4core.color("#5a5");

      columnTemplate.adapter.add("fill", function (fill, target) {
        if (target.dataItem && (target.dataItem.valueY < 0)) {
          return am4core.color("#a55");
        }
        else {
          return fill;
        }
      });

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "none";

    }
  }
  customElements.define('com-sap-sample-waterfall-prepared', SamplePrepared)
})()