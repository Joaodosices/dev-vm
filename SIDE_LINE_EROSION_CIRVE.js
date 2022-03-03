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
    async render(resultSet) {

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
      // valueAxis.max = 100;
      // valueAxis.min = 0;

      valueAxis.calculateTotals = true;
      valueAxis.renderer.labels.template.adapter.add("text", function (text) {
        return text + "%";
      });

      // Single Selection
{      console.log("Resultset :", resultSet);

      var data = [];

      var ofd = [];
      for (var j = 1; j < 31; j++) {
        ofd.push(j);
      }
      
      for (var i = 0; i < resultSet.length; i++) {

          var tooltipdate = new Date(resultSet[i].STARTDATE.description);
          tooltipdate.setMonth(tooltipdate.getMonth() + ofd[i]);

          var a = {

            date: tooltipdate,
            C_B: resultSet[i].COUNTRY_BRAND.description,
            Order: resultSet[i].O.description,
            percentage: resultSet[i]["@MeasureDimension"].rawValue * 100,
            percentage1: resultSet[i]["@MeasureDimension"].rawValue * 100 * 1.5

          }

          data.push(a);
        }
   

      // Add data
      chart.data = data;

      var series = chart.series.push(new am4charts.LineSeries());
      // series.data = chart.data;
      
      series.dataFields.valueY = "percentage";
      series.dataFields.categoryX = "Order";
      series.tooltipText = "{date} \n {C_B} : {valueY}%";
      series.tooltip.pointerOrientation = "down";
      series.strokeWidth = 2;
      series.connect = false;

      var series1 = chart.series.push(new am4charts.LineSeries());
      // series.data = chart.data;
      
      series1.dataFields.valueY = "percentage1";
      series1.dataFields.categoryX = "Order";
      series1.tooltipText = "{date} \n {C_B} : {valueY}%";
      series1.tooltip.pointerOrientation = "down";
      series1.strokeWidth = 2;
      series1.connect = false;
    }

        // Multi Selection
        {
          
        }

      // Create series

      chart.dateFormatter.dateFormat = "MMM-yyyy";
      categoryAxis.cursorTooltipEnabled = false;
      valueAxis.cursorTooltipEnabled = false;
      // Finish up setting chart up
      chart.cursor = new am4charts.XYCursor();

    }
  }
  customElements.define('com-sap-sample-linearea-prepared', SamplePrepared)
})()