(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
        :host {
            display: block;
            padding: 27px;
        }
        * {
          box-sizing: border-box;
        }
        fieldset {
          min-width: 0;
          padding: 0;
          margin: 0;
          border: 0;
        }
        legend {
          display: block;
          width: 100%;
          padding: 0;
          margin-bottom: 20px;
          font-size: 21px;
          line-height: inherit;
          color: #333;
          border: 0;
          border-bottom: 1px solid #e5e5e5;
        }
        label {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 5px;
          font-weight: 700;
        }
        input, select {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: inherit;
          font: inherit;
          margin: 0;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .row {
          margin: 0 -15px;
        }
        .row:before, .row:after {
          display: table;
          content: " ";
        }
        .form-control {
          display: block;
          width: 100%;
          height: 34px;
          padding: 6px 12px;
          font-size: 14px;
          line-height: 1.42857143;
          color: #555;
          background-color: #fff;
          background-image: none;
          border: 1px solid #ccc;
          border-radius: 4px;
          -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
          box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
          -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
          -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
          transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        }
        div[class^='col-xs'] {
          float: left;
          position: relative;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px;
        }
        .col-xs-12 {
          width: 100%;
        }
        .col-form-label {
          margin-top: 8px;
        }
		.visivility-hidden{
			visibility: hidden;
			height: 0px;
			padding: 0px;
			border: 0px;
		}
    </style>
    <fieldset>
      <legend>Date Range Picker Properties</legend>
            <div class="form-group col-xs-12">
				<label class="col-form-label">Date Format</label>
				<select class="form-control" id="dateFormatSelect">
					<option value="MM/YYYY" title="02/2021">MM/YYYY</option>
					<option value="MM-YYYY" title="02-2021">MM-YYYY</option>
					<option value="MMYYYY" title="022021 or 122021">MMYYYY</option>
					<option value="MM/YY" title="02/21">MM/YY</option>
					<option value="MM-YY" title="02-21">MM-YY</option>
					<option value="MMYY" title="0221">MMYY</option>
					  
					<option value="M/YYYY" title="2/2021 or 12/2021">M/YYYY</option>
					<option value="M-YYYY" title="2-2021 or 12-2021">M-YYYY</option>
					<option value="MYYYY" title="22021 or 122021">MYYYY</option>
					<option value="M/YY" title="2/21 or 12/21">M/YY</option>
					<option value="M-YY" title="2-21 or 12-21">M-YY</option>
					<option value="MYY" title="221 or 1221">MYY</option>
					  
					<option value="Mon/YYYY" title="Feb/2021">Mon/YYYY</option>
					<option value="Mon-YYYY" title="Feb-2021">Mon-YYYY</option>
					<option value="Mon/YY" title="Feb/21">Mon/YY</option>
					<option value="Mon-YY" title="Feb-21">Mon-YY</option>
					<option value="MON/YYYY" title="FEB/2021">MON/YYYY</option>
					<option value="MON-YYYY" title="FEB-2021">MON-YYYY</option>
					<option value="MON/YY" title="FEB/21">MON/YY</option>
					<option value="MON-YY" title="FEB-21">MON-YY</option>


					<option value="YYYY/MM" title="2021/02">YYYY/MM</option>
					<option value="YYYY-MM" title="2021-02">YYYY-MM</option>
					<option value="YYYYMM" title="202102 or 202112">YYYYMM</option>
					<option value="YYYY/M" title="2021/2 or 2021/12">YYYY/M</option>
					<option value="YYYY-M" title="2021-2 or 2021-12">YYYY-M</option>
					<option value="YYYYM" title="20212 or 202112">YYYYM</option>
					<option value="YYYY/Mon" title="2021/Feb">YYYY/Mon</option>
					<option value="YYYY-Mon" title="2021-Feb">YYYY/Mon</option>
					<option value="YYYY/MON" title="2021/FEB">YYYY/MON</option>
					<option value="YYYY-MON" title="2021-FEB">YYYY-MON</option>
					 
					<option value="YY/MM" title="21/02">YY/MM</option>
					<option value="YY-MM" title="21-02">YY-MM</option>
					<option value="YYMM" title="2102">YYMM</option>
					<option value="YY/M" title="21/2 or 21/12">YY/M</option>
					<option value="YY-M" title="21-2 or 21-12">YY-M</option>
					<option value="YYM" title="212 or 2112">YYM</option>
					<option value="YY/Mon" title="21/Feb">YY/Mon</option>
					<option value="YY-Mon" title="21-Feb">YY-Mon</option>
					<option value="YY/MON" title="21/FEB">YY/MON</option>
					<option value="YY-MON" title="21-FEB">YY-MON</option>
					  
				  
					<option value="custom" title="you specify">Custom</option>
				</select>
				<div class="col-form-label visivility-hidden" id="CustomDateFormat" >Custom: </div><input type="string" class="form-control visivility-hidden" id="dateFormat" />
            </div>
            <div class="form-group col-xs-12">
                <label class="col-form-label">Custom CSS Url</label>
                <input type="string" class="form-control" id="externalCssUrl" />
            </div> <div class="form-group col-xs-12">
            <label class="col-form-label">Selection Mode</label>
            <select class="form-control" id="mode">
              <option value="range">Range</option>
              <option value="single">Single Select</option>
          </select>
        </div>
        </div>  
      </fieldset>
        `;
    customElements.define(
      "com-novartis-js-monthrangepicker-builder-dev",
      class MultiselectBuilder extends HTMLElement {
        constructor() {
          super();
		  console.log('>>>>>>>>>>>>builder:constructor');
          this._shadowRoot = this.attachShadow({ mode: "open" });
          this._shadowRoot.appendChild(template.content.cloneNode(true));
          
          this.setChangeEventListeners([
            "dateFormat",
            "externalCssUrl",
            "mode",
			"dateFormatSelect"
          ]);
		  
  
        }
        setChangeEventListeners(propArray) {
			console.log('>>>>>>>>>>>>builder:setChangeEventListeners');
          const update = this.updateProp.bind(this);
          propArray.forEach((prop) => {
            this.getId(prop).addEventListener("change", () => update(prop));
          });
        }
  
        getId(id) {
			console.log('>>>>>>>>>>>>builder:getId');
          return this._shadowRoot.getElementById(`${id}`);
        }
        updateProp(prop) {
			console.log('>>>>>>>>>>>>builder:updateProp');
			if(prop=='dateFormatSelect'){
				if(this.getId(prop).value!=='custom'){
					this.getId('CustomDateFormat').className='col-form-label visivility-hidden'; //we might move those lines steering visibility to another function as it is the same in setter
					this.getId('dateFormat').className='form-control visivility-hidden';
					this.getId('dateFormat').value=this.getId(prop).value;
				} else {
					this.getId('CustomDateFormat').className='col-form-label visivility-visible';
					this.getId('dateFormat').className='form-control visivility-visible';
				}
				this.dispatchEvent(
					new CustomEvent("propertiesChanged", {
						detail: {
							properties: {
								['dateFormat']: this['dateFormat'],
							},
						},
					})
				);
			}
          this.dispatchEvent(
            new CustomEvent("propertiesChanged", {
              detail: {
                properties: {
                  [prop]: this[prop],
                },
              },
            })
          );
        }
  
  
        // getters and setters
        get dateFormat() {
			console.log('>>>>>>>>>>>>builder:getdateFormat: '.concat(this.getId("dateFormat").value));
          return this.getId("dateFormat").value;
        }
        set dateFormat(value) {
			console.log('>>>>>>>>>>>>builder:setdateFormat: '.concat(value));
          this.getId("dateFormat").value = value;
        }
        get externalCssUrl() {
			console.log('>>>>>>>>>>>>builder:get externalCssUrl: '.concat(this.getId("externalCssUrl").value));
          return this.getId("externalCssUrl").value;
        }
        set externalCssUrl(value) {
			console.log('>>>>>>>>>>>>builder:set externalCssUrl: '.concat(value));
          this.getId("externalCssUrl").value = value;
        }
        get mode() {
			console.log('>>>>>>>>>>>>builder:get mode: '.concat(this.getId("mode").value));
          return this.getId("mode").value;
        }
        set mode(value) {
			console.log('>>>>>>>>>>>>builder:set mode: '.concat(value));
          this.getId("mode").value = value;
        }
		get dateFormatSelect() {
			console.log('>>>>>>>>>>>>builder:get dateFormatSelect: '.concat(this.getId("dateFormatSelect").value));
          return this.getId("dateFormatSelect").value;
        }
        set dateFormatSelect(value) {
			console.log('>>>>>>>>>>>>builder:set dateFormatSelect: '.concat(value));
				if(value!=='custom'){
					this.getId('CustomDateFormat').className='col-form-label visivility-hidden';
					this.getId('dateFormat').className='form-control visivility-hidden';
				} else {
					this.getId('CustomDateFormat').className='col-form-label visivility-visible';
					this.getId('dateFormat').className='form-control visivility-visible';
				}
          this.getId("dateFormatSelect").value = value;
        }
      }
    );
  })();
  