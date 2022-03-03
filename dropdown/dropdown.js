	var getScriptPromisify = (src) => {
    return new Promise(resolve => {
      $.getScript(src, resolve)
    })
  }
  
  (function () {
				  
																													 
													
					   
					   
															
														 
															 
															
														   

    //Chart Block in HTML
    const prepared = document.createElement('template')
    prepared.innerHTML = `
        <div class="bs-example" style="width:300px;">
    <div class="accordion" id="accordionExample">
        <div class="card">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <button type="button" class="btn btn-link" data-toggle="collapse" data-target="#collapseOne"><i class="fa fa-plus"></i>countrys</button>									
                </h2>
            </div>
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body dropdownlist">
                    <p>
                  <ul >
                    <li> <img src="dot-icon.png"> India</li>
                    <li><img src="dot-icon.png"> UAE</li>
                    <li><img src="dot-icon.png"> America</li>
                    <li><img src="dot-icon.png"> London</li>
                    <li><img src="dot-icon.png"> China</li>

                  </ul>
                  </p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingTwo">
                <h2 class="mb-0">
                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo"><i class="fa fa-plus"></i> What is Bootstrap?</button>
                </h2>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                <div class="card-body">
                    <p>Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development. It is a collection of CSS and HTML conventions. <a href="https://urldefense.com/v3/__https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/__;!!N3hqHg43uw!6EDT4ohKCFrUNl83x2nRPyB7_RGfy9AuK8OTkFkAOFIm4lIDRD-j9SRSTXJ22t_xj3kGzqHa2Q$" target="_blank">Learn more.</a></p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingThree">
                <h2 class="mb-0">
                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree"><i class="fa fa-plus"></i> What is CSS?</button>                     
                </h2>
            </div>
            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                <div class="card-body">
                    <p>CSS stands for Cascading Style Sheet. CSS allows you to specify various style properties for a given HTML element such as colors, backgrounds, fonts etc. <a href="https://urldefense.com/v3/__https://www.tutorialrepublic.com/css-tutorial/__;!!N3hqHg43uw!6EDT4ohKCFrUNl83x2nRPyB7_RGfy9AuK8OTkFkAOFIm4lIDRD-j9SRSTXJ22t_xj3n0HOX-6Q$" target="_blank">Learn more.</a></p>
                </div>
            </div>
        </div>
    </div>
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
	  
					
   

        this.addEventListener("click", event => {
          var event = new Event("onClick");
          this.dispatchEvent(event);
          
        });
  
        //_props object is used to hold properties information
        this._props = {}
        
        //Call render() method to plot chart
        this.render(this.resultSet, this.DimID, this.WF1, this.WF2)
      }

   /*   onCustomWidgetAfterUpdate() {
        this.render(this.resultSet, this.DimID, this.WF1, this.WF2);
      }
      
      //render() method to plot chart - resultSet1 holds data from SAC table/chart.
      async render (resultSet1,DimID1,WF11,WF21) {

        var dim1 = [];
		var dimid = [];
        var measure1 = [];
		var valuetype = [];
        var w1 = 0;
        var w2 = 0;
        var m = 0;
		var name = '';
		var namelen = 0;
		var btm = 70;

        var total = 0;
		
        var recordCount = resultSet1.length;
		
		if(recordCount >= 6){
        w1 = Math.round(resultSet1[recordCount-3]["@MeasureDimension"].rawValue);
        measure1.push(w1);
        dim1.push(WF11);
		dimid.push(WF11);
        total = total + w1;

        w2 = Math.round(resultSet1[recordCount-2]["@MeasureDimension"].rawValue);

        m = Math.round(resultSet1[2]["@MeasureDimension"].rawValue);
        measure1.push(m);
        total = total + m;
		
		name = resultSet1[2][DimID1].description;
		namelen = name.length;
        dim1.push(name);
		dimid.push(resultSet1[2][DimID1].id);
		valuetype.push("absolute");
		valuetype.push("relative");
		}
		
		if(recordCount >= 9){
        m = Math.round(resultSet1[5]["@MeasureDimension"].rawValue);
        measure1.push(m);
        total = total + m;
		
		name = resultSet1[5][DimID1].description;
		if(namelen < name.length){
		namelen = name.length;
		}
        dim1.push(name);
		dimid.push(resultSet1[5][DimID1].id);
		valuetype.push("relative");
		}
		
		if(recordCount >= 12){	
        m = Math.round(resultSet1[8]["@MeasureDimension"].rawValue);
        measure1.push(m);
        total = total + m;
		
		name = resultSet1[8][DimID1].description;
		if(namelen < name.length){
		namelen = name.length;
		}
        dim1.push(name);
		dimid.push(resultSet1[8][DimID1].id);
		valuetype.push("relative");
		}
		
		if(recordCount >= 15){
        m = Math.round(resultSet1[11]["@MeasureDimension"].rawValue);
        measure1.push(m);
        total = total + m;
		
		name = resultSet1[11][DimID1].description;
		if(namelen < name.length){
		namelen = name.length;
		}
        dim1.push(name);
		dimid.push(resultSet1[11][DimID1].id);
		valuetype.push("relative");
		}
		
		if(recordCount > 15){
		total = w2 - total;
        measure1.push(total);
        dim1.push('Other');		
		dimid.push('Other');
		valuetype.push("relative");
	    }

		if(recordCount >= 6){
                
        measure1.push(w2);
        dim1.push(WF21);
		dimid.push(WF21);
		valuetype.push("total");
	
		}
		
		console.log(resultSet1);
        console.log(measure1);
        console.log(dim1);
		console.log(namelen);
		
		if(namelen >= 20){
			btm = 100;
		}




        await getScriptPromisify('https://cdn.plot.ly/plotly-2.3.0.min.js');

        Plotly.newPlot(this._root, 
        [
            {
                name: "",
                type: "waterfall",
                orientation: "v",
                measure: valuetype,
                x: dimid,
                textposition: "outside",
                text: measure1,          
                y: measure1,
				increasing: {
					marker:{
						color: "rgb(242,0,105)"
					}
				},
				decreasing: {
					marker:{
						color: "rgb(119,211,111)"
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
        ],  
		{
            title: {
                text: ""
            },
            xaxis: {
                type: "category",
                fixedrange: true,
				tickmode: 'array',
				ticktext: dim1,
				tickvals: dimid
            },
            yaxis: {
                type: "linear",
                showgrid: false,
                fixedrange: true,
                tickfont: {
					color: 'white'
                }
            },
            margin: {
              l: 20,
              r: 20,
              t: 80,
			  b: btm
            },	
        },
        {
           displayModeBar: false
        }
        );
        
      }
    }
    customElements.define('com-sap-sample-waterfall-prepared', SamplePrepared)
  })()	  
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}
			if ("opacity" in changedProperties) {
				this.style["opacity"] = changedProperties["opacity"];
			}
		}
	}*/

	customElements.define("com-sap-sample-coloredbox", ColoredBox);
})();