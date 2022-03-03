var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------  Start: Template Creation  ------------------------------------- */

    //Chart Block in HTML
    const prepared = document.createElement('template')
    prepared.innerHTML = `
    <div id="root" style="width: 100%; height: 100%;">
    </div>
  `

    /*--------------------------  End: Template Creation  ------------------------------------- */
    /*--------------------------------------------------------------------------------------------------------------- */


    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------Start: Main Class  ------------------------------------- */

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

            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);
                // console.log('click');

            });

            //Call render() method to plot chart
            // this.render(this._resultSet, this._Vrname, this.KFName, this.YDirection, this._S1, this._S2, this.ReplaceNull, this._DateAxes, this._Isyear,1)
        }


        onCustomWidgetAfterUpdate(changedProperties) {
            // var that = this;
            render(changedProperties);
            // render(this._resultSet, this._Vrname, this.KFName, this.YDirection, this._S1, this._S2, this.ReplaceNull, this._DateAxes, this._Isyear,that, changedProperties);
        }

        _firePropertiesChanged() {
            this.selectedNode = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        selectedNode: this.selectedNode
                    }
                }
            }));
        }
    }

    /*--------------------------------------------------------------------------------------------------------------- */
    /*--------------------------End: Main Class ------------------------------------- */

    customElements.define('com-sap-sample-linearea-prepared', SamplePrepared);


    // function render(resultSet1, _Vrname, _KFName, _YDirection, _S1, _S2, _ReplaceNull, _DateAxes, _Isyear, that, changedProperties) {

    async function render(changedProperties) {
        console.log(changedProperties);
        console.log("ChnageProperties Width :- " + changedProperties.width);
        console.log("ChnageProperties Height :- " + changedProperties.height);
    }
    // "return (this.width=Width>100 ? this.width=Width : 100);"

})();

// "body": "this.resultset_1 = resultset; this.KFName_1 = KFName; this.Vrname_1 = Vrname; this.YDirection_1 = YDirection; this.S1_1 = S1; this.S2_1 = S2; this.ReplaceNull_1 = ReplaceNull; this.DateAxes_1 = DateAxes; this.Isyear_1 = Isyear;"