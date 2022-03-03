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
      this.render(this._resulSet)

    }

    //render() method to plot chart - resultSet1 holds data from SAC table/chart.
    async render(resultSet, count) {

      await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create(this._root, am4charts.XYChart);

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "Order";
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.renderer.grid.template.disabled = true;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.calculateTotals = true;
      valueAxis.renderer.labels.template.adapter.add("text", function (text) {
        return text + "%";
      });

      // Single Selection
      {
        console.log("Resultset :", resultSet);
        console.log("Count" + count);
        var data = [];

        var ofd = [];
        for (var j = 1; j < 31; j++) {
          ofd.push(j);
        }
        if (resultSet.length > 0) {
          for (var i = 0, m = 0; i < resultSet.length; i += count, m++) {

            var a = {
              Order: resultSet[i].O.description
            }

            for (var j = 0; j < count; j++) {

              var tooltipdate = new Date(resultSet[i + j].STARTDATE.description);
              tooltipdate.setMonth(tooltipdate.getMonth() + ofd[m]);

              a['C_B' + j] = resultSet[i + j].COUNTRY_BRAND.description;
              a['date' + j] = tooltipdate;
              a['percentage' + j] = resultSet[i + j]["@MeasureDimension"].rawValue * 100;
            }

            console.log(a);

            data.push(a);
          }


          // Add data
          chart.data = data;

          for (var k = 0; k < count; k++) {
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "percentage" + k;
            series.dataFields.categoryX = "Order";
            series.tooltipText = "[bold]{date" + k + "}[/] \n {C_B" + k + "} \n Retention % : {valueY}";
            series.tooltip.pointerOrientation = "down";
            series.strokeWidth = 1;
            series.connect = false;
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.fill = am4core.color("#F8F8F8");
            series.tooltip.autoTextColor = false;
            series.tooltip.label.fill = am4core.color("#000000");
            series.tooltip.label.fontSize = 13;
            series.tooltip.label.fontFamily = "SF UI Text";

          }
        }
      }

      chart.dateFormatter.dateFormat = "MMM-yyyy";
      categoryAxis.cursorTooltipEnabled = false;
      valueAxis.cursorTooltipEnabled = false;
      // Finish up setting chart up
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      // chart.numberFormatter.numberFormat = "##.##";
      // chart.legend.labels.template.fontSize = 13;
      // chart.legend.labels.template.fontFamily = "SF UI Text";
      chart.cursor.lineY.disabled = true;

    }
  }
  customElements.define('com-sap-sample-linearea-prepared', SamplePrepared)
})()