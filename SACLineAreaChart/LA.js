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
    constructor () {

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
      this.render(this._resultSet,this._Vrname,this.KFName,this.YDirection,this._S1,this._S2,this.ReplaceNull,this._DateAxes)

    }
  
    //render() method to plot chart - resultSet1 holds data from SAC table/chart.
    async render (resultSet1,_Vrname,_KFName,_YDirection,_S1,_S2,_ReplaceNull,_DateAxes) {

      await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

      // anychart.onDocumentReady(function () {
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create(this._root, am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      console.log("Resultset :",resultSet1);
      console.log("S1:",_S1);
      console.log("S2:",_S2);
             
      var data = [];

        var len = resultSet1.length;
        console.log("lenght :",len);

        var inc = _S1 + _S2 * 3;

        for (var i = 0; i < len; i = i + inc) {

          var ActualAmount = [null,null,null,null,null,null,null,null];
          var RangeAmount = [null,null,null,null,null,null,null,null,null,null,null,null];

          for(var j = 0; j < _S1 ; j++)
          {
            ActualAmount[j] = resultSet1[i+j]["@MeasureDimension"].rawValue;

            if (ActualAmount[j] == _ReplaceNull) {ActualAmount[j]= null;}
          }

          for(var k = 0; j < inc ; j++,k++)
          {
            RangeAmount[k] = resultSet1[i+j]["@MeasureDimension"].rawValue;

            if (RangeAmount[k] == _ReplaceNull) {RangeAmount[k]= null;}
          }
          
          var a = {
            date: new Date(resultSet1[i]["Year"].description),
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
            low3: RangeAmount[11]           
          }
          
          data.push(a);
        }
 
      
          chart.data = data;
    
      {// Axis
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.startLocation = -0.5;
      dateAxis.endLocation = 1.5;
      // dateAxis.dateFormats.setKey("month", "MMM");
      // dateAxis.dateFormats.setKey("month", "yyyy");
      dateAxis.dateFormats.setKey("month", _DateAxes);
      chart.dateFormatter.dateFormat = "MMM,yyyy";
      // dateAxis.baseInterval = {
      //   "timeUnit": _DateAxes,
      //   "count": 1
      // }

      var valueAxisLeft = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisLeft.renderer.grid.template.disabled = true; 
      
      var valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisRight.renderer.opposite = true;
      valueAxisRight.renderer.grid.template.disabled = true; }

      // Series Style
      {
         var SS = ["1","1,2","3,4","4,2,2","2","2,2","2,4","2,2,3"];
      }

      // Bullets Style
      {
        var BS = [am4core.Rectangle,
                  am4core.Circle,
                  am4core.Triangle,
                  am4core.Circle,
                  am4core.Rectangle,
                  am4core.Circle,
                  am4core.Triangle,
                  am4core.Circle
                ]; 
      }

      console.log('Name: ' + _KFName);
      console.log('Vrname'+ _Vrname);
                 
      //Section1
        {
            for(var i = 0; i < _S1; i++) 
            {
            // Create series for Actuals

            var series0 = chart.series.push(new am4charts.LineSeries());
            series0.data = chart.data;  
            series0.dataFields.valueY = "A"+i ;
            series0.dataFields.dateX = "date";
            series0.name = _KFName[i];
            series0.tooltipText = "[bold] {date}[/] \n"+_Vrname[i]+"\n{name}: {valueY.value} ";
            series0.tensionX = 0.9;
            series0.strokeWidth = 2.5;
            series0.defaultState.transitionDuration = 1500;
            if(_YDirection[i]==='L'){
              series0.yAxis = valueAxisLeft;
            }
            else{
              series0.yAxis = valueAxisRight;
            }
            series0.strokeDasharray = SS[i];
            var bullet = series0.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";            
            }
        }

        //Section 2 
       {
        function createSeries(field, name, hiddenInLegend)
             {
              var series = chart.series.push(new am4charts.LineSeries());
              series.dataFields.valueY = field;
              series.dataFields.dateX = "date";
              series.name = name;
                if (hiddenInLegend)
                {
                  series.hiddenInLegend = true;
                }
                return series;
             } 
     
          for(var i = 0; i < _S2; i++)
           {

            var yAxis_value = valueAxisRight;

            if(_YDirection[_S1+i] === 'L'){
              yAxis_value = valueAxisLeft;
            }
                  
  //Range0
  if(i==0)  {

            // Create series for Mid
            var seriesR0 = createSeries("mid"+i,_KFName[_S1+i], false)
            seriesR0.data = chart.data;            
            seriesR0.dataFields.openValueY = "high"+i;
            seriesR0.dataFields.lowValueY = "low"+i;
            seriesR0.tooltipText = "[bold] {date}[/] \n"+_Vrname[_S1+i]+"\n {name}: {valueY.value} \n High: {openValueY} \n Low: {lowValueY}";
            seriesR0.tensionX = 0.9;
            seriesR0.strokeWidth = 2.5;
            seriesR0.defaultState.transitionDuration = 1500;
            seriesR0.yAxis = yAxis_value;
            var bullet = seriesR0.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(BS[i]);
            square.width = 10;
            square.height = 10;
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";
            
            // Create series for Close
            var seriesC0 = createSeries("high"+i, "high", true);
            seriesC0.data = chart.data;  
            seriesC0.dataFields.openValueY = "mid"+i;
            // seriesC0.tooltipText = "{name}-{valueY.value} ";
            seriesC0.fillOpacity = 0.2;
            seriesC0.tensionX = 0.9;
            seriesC0.strokeWidth = 0;
            seriesC0.defaultState.transitionDuration = 1500;
            seriesC0.yAxis = yAxis_value;
            
            // Create series for open
            var seriesO0 = createSeries("low"+i, "low", true);
            seriesO0.data = chart.data; 
            seriesO0.dataFields.openValueY = "mid"+i;
            seriesO0.fillOpacity = 0.2;
            // seriesO0.tooltipText = "{name}:{valueY.value} ";
            seriesO0.tensionX = 0.9;
            seriesO0.strokeWidth = 0;
            seriesO0.defaultState.transitionDuration = 1500;
            seriesO0.yAxis = yAxis_value;

            seriesR0.events.on("hidden", function() {
              seriesC0.hide();
              seriesO0.hide();
            });
            
            seriesR0.events.on("shown", function() {
              seriesC0.show();
              seriesO0.show();
            });

            }

  //Range1          
  if(i==1) {

          // Create series for Mid
          var seriesR1 = createSeries("mid"+i,_KFName[_S1+i], false)
          seriesR1.data = chart.data;
          seriesR1.dataFields.openValueY = "high"+i;
          seriesR1.dataFields.lowValueY = "low"+i;
          seriesR1.tooltipText = "[bold] {date}[/] \n "+_Vrname[_S1+i]+"\n {name}: {valueY.value} \n High: {openValueY} \n Low: {lowValueY}";
          seriesR1.tensionX = 0.9;
          seriesR1.strokeWidth = 2.5;
          seriesR1.defaultState.transitionDuration = 1500;
          seriesR1.yAxis = yAxis_value;
          var bullet = seriesR1.bullets.push(new am4charts.Bullet());
          var square = bullet.createChild(BS[i]);
          square.width = 10;
          square.height = 10;
          square.horizontalCenter = "middle";
          square.verticalCenter = "middle";
          
          // Create series for Close
          var seriesC1 = createSeries("high"+i, "high", true);
          seriesC1.data = chart.data;  
          seriesC1.dataFields.openValueY = "mid"+i;
          // seriesC1.tooltipText = "{name}-{valueY.value} ";
          seriesC1.fillOpacity = 0.2;
          seriesC1.tensionX = 0.9;
          seriesC1.strokeWidth = 0;
          seriesC1.defaultState.transitionDuration = 1500;
          seriesC1.yAxis = yAxis_value;
          
          // Create series for open
          var seriesO1 = createSeries("low"+i, "low", true);
          seriesO1.data = chart.data; 
          seriesO1.dataFields.openValueY = "mid"+i;
          seriesO1.fillOpacity = 0.2;
          // seriesO1.tooltipText = "{name}-{valueY.value} ";
          seriesO1.tensionX = 0.9;
          seriesO1.strokeWidth = 0;
          seriesO1.defaultState.transitionDuration = 1500;
          seriesO1.yAxis = yAxis_value;

          seriesR1.events.on("hidden", function() {
            seriesC1.hide();
            seriesO1.hide();
          });
          
          seriesR1.events.on("shown", function() {
            seriesC1.show();
            seriesO1.show();
          });

           }   
          
  //Range2         
  if(i==2)  {

    // Create series for Mid
    var seriesR2 = createSeries("mid"+i,_KFName[_S1+i], false)
    seriesR2.data = chart.data;
    seriesR2.dataFields.openValueY = "high"+i;
    seriesR2.dataFields.lowValueY = "low"+i;
    seriesR2.tooltipText = "[bold] {date}[/] \n "+_Vrname[_S1+i]+"\n {name}: {valueY.value} \n High: {openValueY} \n Low: {lowValueY}";
    seriesR2.tensionX = 0.9;
    seriesR2.strokeWidth = 2.5;
    seriesR2.defaultState.transitionDuration = 1500;
    seriesR2.yAxis = yAxis_value;
    var bullet = seriesR2.bullets.push(new am4charts.Bullet());
    var square = bullet.createChild(BS[i]);
    square.width = 10;
    square.height = 10;
    square.horizontalCenter = "middle";
    square.verticalCenter = "middle";
    
    // Create series for Close
    var seriesC2 = createSeries("high"+i, "high", true);
    seriesC2.data = chart.data;  
    seriesC2.dataFields.openValueY = "mid"+i;
    // seriesC2.tooltipText = "{name}-{valueY.value} ";
    seriesC2.fillOpacity = 0.2;
    seriesC2.tensionX = 0.9;
    seriesC2.strokeWidth = 0;
    seriesC2.defaultState.transitionDuration = 1500;
    seriesC2.yAxis = yAxis_value;
    
    // Create series for open
    var seriesO2 = createSeries("low"+i, "low", true);
    seriesO2.data = chart.data; 
    seriesO2.dataFields.openValueY = "mid"+i;
    seriesO2.fillOpacity = 0.2;
    // seriesO2.tooltipText = "{name}-{valueY.value} ";
    seriesO2.tensionX = 0.9;
    seriesO2.strokeWidth = 0;
    seriesO2.defaultState.transitionDuration = 1500;
    seriesO2.yAxis = yAxis_value;

    seriesR2.events.on("hidden", function() {
      seriesC2.hide();
      seriesO2.hide();
    });
    
    seriesR2.events.on("shown", function() {
      seriesC2.show();
      seriesO2.show();
    });

            }           

  //Range3          
  if(i==3) {

    // Create series for Mid
    var seriesR3 = createSeries("mid"+i,_KFName[_S1+i], false)
    seriesR3.data = chart.data;
    seriesR3.dataFields.openValueY = "high"+i;
    seriesR3.dataFields.lowValueY = "low"+i;
    seriesR3.tooltipText = "[bold] {date}[/] \n "+_Vrname[_S1+i]+"\n  {name}: {valueY.value} \n High: {openValueY} \n Low: {lowValueY}";
    seriesR3.tensionX = 0.9;
    seriesR3.strokeWidth = 2.5;
    seriesR3.defaultState.transitionDuration = 1500;
    seriesR3.yAxis = yAxis_value;
    var bullet = seriesR3.bullets.push(new am4charts.Bullet());
    var square = bullet.createChild(BS[i]);
    square.width = 10;
    square.height = 10;
    square.horizontalCenter = "middle";
    square.verticalCenter = "middle";
    
    // Create series for Close
    var seriesC3 = createSeries("high"+i, "high", true);
    seriesC3.data = chart.data;  
    seriesC3.dataFields.openValueY = "mid"+i;
    // seriesC3.tooltipText = "{name}-{valueY.value} ";
    seriesC3.fillOpacity = 0.2;
    seriesC3.tensionX = 0.9;
    seriesC3.strokeWidth = 0;
    seriesC3.defaultState.transitionDuration = 1500;
    seriesC3.yAxis = yAxis_value;
    
    // Create series for open
    var seriesO3 = createSeries("low"+i, "low", true);
    seriesO3.data = chart.data; 
    seriesO3.dataFields.openValueY = "mid"+i;
    seriesO3.fillOpacity = 0.2;
    // seriesO3.tooltipText = "{name}-{valueY.value} ";
    seriesO3.tensionX = 0.9;
    seriesO3.strokeWidth = 0;
    seriesO3.defaultState.transitionDuration = 1500;
    seriesO3.yAxis = yAxis_value;

    seriesR3.events.on("hidden", function() {
      seriesC3.hide();
      seriesO3.hide();
    });
    
    seriesR3.events.on("shown", function() {
      seriesC3.show();
      seriesO3.show();
    });

           }   

          }
      }

      {// Add Cursor
      chart.cursor = new am4charts.XYCursor();
      // chart.cursor.xAxis = dateAxis;
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