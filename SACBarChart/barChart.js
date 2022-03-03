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
            // this.render(this.resultSet, this.TopN)
        }

        onCustomWidgetAfterUpdate() {
            // this.render(this.resultSet, this.TopN);
        }

        //render() method to plot chart - resultSet1 holds data from SAC table/chart.
        async render(resultSet1, TopN) {

            var dim1 = [];
            var dimid = [];
            var measure1 = [];
            var topValue = 0;
            var len = resultSet1.length;
            for (var i = 0; i < TopN; i++) {
                var w1 = Math.round(resultSet1[i]["@MeasureDimension"].rawValue);
                measure1.push(w1);
                // dim1.push(WF11);
                var WF11 = resultSet1[i]["0COSTELMNT__CH_FNREP"].description;
                dimid.push(WF11);
            }
            for (var j = TopN; j < len - 1; j++) {
                var w2 = Math.round(resultSet1[j]["@MeasureDimension"].rawValue);
                topValue = topValue + w2;
                // dim1.push(WF11);

            }
            
            measure1.push(topValue);
            dimid.push("Other");

            console.log(resultSet1);
            console.log(measure1);
            console.log(dim1);
            console.log(topValue);


            await getScriptPromisify('https://cdn.plot.ly/plotly-2.3.0.min.js');

            Plotly.newPlot(this._root,
                [
                    {
                        name: "",
                        type: "bar",
                        // measure: valuetype,
                        x: dimid,
                        // textposition: "outside",
                        // text: measure1,
                        y: measure1,
                    }
                ],
                {
                    title:  "Bar Chart With Top N",
                    xaxis: {
                        title: 'Cost Element',
                        automargin: true,
                        tickangle: 45
                    },
                    yaxis: {
                        title: 'MTD',
                        automargin: true,
                        tickangle: 45
                    },
                    margin: {
                          l: 20,
                          r: 20,
                          t: 80,
                        b: 110
                    }
                },
                {
                    displayModeBar: false
                }
            );

        }
    }
    customElements.define('com-sap-sample-barchart-prepared', SamplePrepared)
})()