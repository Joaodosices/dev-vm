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
            console.log(resultSet1);
            console.log(DimID1);
            console.log(WF11);
            console.log(WF21);
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
            } if (resultSet1.length >= 12) {
                measure1.push("relative");
                let sum = 0;
                for (var b = 3; b < deltanum.length - 1; b++) {
                    sum += deltanum[b];
                }
                text1.push(sum);
                yy.push(sum);
                xx.push("Other");
            }
            if(resultSet1.length>=6){
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
            
            var data = [
                {
                    name: "2018",
                    type: "waterfall",
                    orientation: "v",
                    measure: measure1,
                    x: xx,
                    textposition: "outside",
                    text: text1,
                    y: yy,
                    increasing: {
                        marker:{
                            color: "rgb(119,211,111)"
                        }
                    },
                    decreasing: {
                        marker:{
                            color: "rgb(242,0,105)"
                        }
                    },
                    totals: {
                        marker:{
                            color: "rgb(15,125,175)"
                        }
                    },
                    connector: {
                      line: {
                        color: "rgb(63, 63, 63)"
                      }
                    },
                }
            ];
            var layout = {
                title: {
                    text: "Profit and loss statement 2018"
                },
                xaxis: {
                    type: "category"
                },
                yaxis: {
                    type: "linear"
                },
                margin: {
                  l: 50,
                  r: 20,
                  t: 80,
                  b: 100,
                },	
                autosize: true,
                showlegend: true
            };
            await getScriptPromisify('https://cdn.plot.ly/plotly-2.9.0.min.js');
            Plotly.newPlot(this._root, data, layout,
                {
                    displayModeBar: false
                }
            );

        }
    }
    customElements.define('com-sap-sample-waterfall-prepared', SamplePrepared)
})()