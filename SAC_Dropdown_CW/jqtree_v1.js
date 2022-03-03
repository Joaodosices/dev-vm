var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {

    //Chart Block in HTML
    const prepared = document.createElement('template')
    prepared.innerHTML = `
    <head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>ComboTree jQuery Plugin Demos by Erhan FIRAT</title>
	<link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/flatly/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.materialdesignicons.com/5.0.45/css/materialdesignicons.min.css">
<link rel="stylesheet" href="style.css">
<style>
/* body {} */
.container { margin: 150px auto; }
</style>
</head>

    <div>
	<div class="row">

		<div class="col-lg-6">
			<h3>Multi Selection</h3>
			<input type="text" id="justAnInputBox1" placeholder="Select" autocomplete="off"/>
		</div>


		<div class="col-lg-6">
			<h3>Single Selection</h3>
			<input type="text" id="justAnotherInputBox" placeholder="Select" autocomplete="off"/>
		</div>

	</div>
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
        async render() {
            
            await getScriptPromisify('https://code.jquery.com/jquery-1.12.4.min.js');
            await getScriptPromisify('https://code.jquery.com/jquery-3.4.1.min.js');
            await getScriptPromisify('https://sac-dev-cw.novartis.net/cw/dev/SAC_Dropdown_CW/comboTreePlugin.js');

            var SampleJSONData = [
                {
                    id: 0,
                    title: 'Horse'
                }, {
                    id: 1,
                    title: 'Birds',
                    isSelectable: false,
                    subs: [
                        {
                            id: 10,
                            title: 'Pigeon',
                            isSelectable: false
                        }, {
                            id: 11,
                            title: 'Parrot'
                        }, {
                            id: 12,
                            title: 'Owl'
                        }, {
                            id: 13,
                            title: 'Falcon'
                        }
                    ]
                }, {
                    id: 2,
                    title: 'Rabbit'
                }, {
                    id: 3,
                    title: 'Fox'
                }, {
                    id: 5,
                    title: 'Cats',
                    subs: [
                        {
                            id: 50,
                            title: 'Kitty'
                        }, {
                            id: 51,
                            title: 'Bigs',
                            subs: [
                                {
                                    id: 510,
                                    title: 'Cheetah'
                                }, {
                                    id: 511,
                                    title: 'Jaguar'
                                }, {
                                    id: 512,
                                    title: 'Leopard'
                                }
                            ]
                        }
                    ]
                }, {
                    id: 6,
                    title: 'Fish'
                }
            ];
            var SampleJSONData2 = [
                {
                    id: 1,
                    title: 'Four Wheels',
                    subs: [
                        {
                            id: 10,
                            title: 'Car'
                        }, {
                            id: 11,
                            title: 'Truck'
                        }, {
                            id: 12,
                            title: 'Transporter'
                        }, {
                            id: 13,
                            title: 'Dozer'
                        }
                    ]
                }, {
                    id: 2,
                    title: 'Two Wheels',
                    subs: [
                        {
                            id: 20,
                            title: 'Cycle'
                        }, {
                            id: 21,
                            title: 'Motorbike'
                        }, {
                            id: 22,
                            title: 'Scooter'
                        }
                    ]
                }, {
                    id: 2,
                    title: 'Van'
                }, {
                    id: 3,
                    title: 'Bus'
                }
            ];
            
            
            var comboTree3,comboTree2;
            
            jQuery(document).ready(function($) {
                    
                    comboTree3 = jQRY('#justAnInputBox1').comboTree({
                        source : SampleJSONData,
                        isMultiple: true,
                        cascadeSelect: true,
                        collapse: false
                    });
            
                    comboTree3.setSource(SampleJSONData2);
        

                    comboTree2 = jQRY('#justAnotherInputBox').comboTree({
                        source : SampleJSONData,
                        isMultiple: false
                    });
            });

        
        }

    }
    customElements.define('com-ds-dsds-sap-sac-jqtree', SamplePrepared)
})()