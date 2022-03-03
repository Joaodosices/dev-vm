(function () {
  let tmpl = document.createElement("template");
  tmpl.innerHTML = `
    <style>
    @import url("https://sac-dev-cw.novartis.net/cw/dev/segmentedButton/bootstrap.min.css")
   </style>
    <style>
         table {
                    font-size:15px;
                    border: 0px solid black;
                    width: 425px;
                } 

         tr, td {
                    padding: 4px;
                } 
                     
         select,input {
                        width: 150px;
                        margin: 5px;
                        font-size: 15px;
                        width:200px;
                        height:30px;
                        border-radius:1.5px;
                      }

       option , select, input  {
                                 font-weight: bold;
                               }  
    </style>
		<form id="form">
			<fieldset>
				<legend><h3>Hierarchy Drop-down Properties</h3></legend>
				<table>
					<tr>
						<td >Selection Type</td>
						<td><select class="form-control" name="Selection_Type" id="Selection_Type" >
                        <option selected="selected" value="SingleSelectLeft">Single Selection</option>
                        <option value="MultiSelect">Multi Selection</option>
                      </select></td>
					</tr>

                    <tr>
						<td >Display</td>
						<td><select class="form-control" name="Display" id="Display" >
                        <option   value="nodeid">ID</option>
                        <option selected="selected" value="nodedec">Description</option>
                        <option value="nodeIdDec">ID-Description</option>
                      </select></td>
					</tr>

                    <tr>
						<td >Show Display On Widget</td>
						<td><select class="form-control" name="Show_Display" id="Show_Display" >
                        <option value="Yes">Yes</option>
                        <option selected="selected" value="No">No</option>
                      </select></td>
					</tr>

                    <tr>
						<td >Separator</td>
						<td><select class="form-control" name="Separator" id="Separator" >
                        <option value="-">-</option>
                        <option selected="selected" value=" ">Balnk Space</option>
                        <option value="/">/</option>
                        <option value="|">|</option>
                      </select></td>

					</tr>
				</table>
			</fieldset>
    </br>
      <fieldset style="width:100%;">
				<legend><h3>Field Mapping Properties</h3></legend>
				<table >
        
      <tr>
      <td> LEVEL* </td>
      <td style = "padding-left:65px;">
      <input  type="text" id="LL" class="form-control" required/>
      </td>
      </tr>
      <tr>
      <td> PARENTID* </td>
      <td style = "padding-left:65px;">
      <input  type="text" id="PI" class="form-control" required/>
      </td>
      </tr>
      <tr>
      <td> NODEID* </td>
      <td style = "padding-left:65px;">
      <input  type="text" id="NI" class="form-control" required/>
      </td>
      </tr>
      </tr>
      <td> TEXT-ID*</td>
      <td style = "padding-left:65px;">
      <input  type="text" id="TI" class="form-control" required/>
      </td>
      </tr>
      <td>TEXT-DESCRIPTION* </td>
      <td style = "padding-left:65px;">
      <input  type="text" id="TD" class="form-control" required/>
      </td>
      </tr>

      <tr>
        <td> Field-1  </td>
        <td style = "padding-left:65px;">
        <input  type="text" id="FL1" class="form-control" />
        </td>
       </tr>
      <tr>
      <td> Field-2 </td>
       <td style = "padding-left:65px;">
       <input  type="text" id="FL2" class="form-control" />
         </td>
      </tr>

				</table>

			</fieldset>
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

  class MultiInput extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

      this.setChangeEventListeners([
        "Selection_Type",
        "Display",
        "Separator",
        "Show_Display",
        "LL",
        "PI",
        "NI",
        "TI",
        "TD",
        "FL1",
        "FL2"
      ]);

    }

    setChangeEventListeners(propArray) {

      const update = this.updateProp.bind(this);
      propArray.forEach((prop) => {
        this.getId(prop).addEventListener("change", () => update(prop));
      });
    }

    getId(id) {

      return this._shadowRoot.getElementById(`${id}`);
    }

    updateProp(prop) {

      //  console.log(this.Selection_Type);
      //  console.log(this.Display);
      //  console.log(this.Separator);
      //  console.log(this.Show_Display);
      //  console.log(this.FL1);
      //  console.log(this.FL2);

      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              ['Selection_Type']: this['Selection_Type'],
              ['Display']: this['Display'],
              ['Separator']: this['Separator'],
              ['Show_Display']: this['Show_Display'],
              ['LEVEL_col']: this['LEVEL_col'],
              ['PARENTID_col']: this['PARENTID_col'],
              ['NODEID_col']: this['NODEID_col'],
              ['TEXTID_col']: this['TEXTID_col'],
              ['TEXTDEC_col']: this['TEXTDEC_col'],

              ['Field1_Name']: this['Field1_Name'],
              ['Field2_Name']: this['Field2_Name']

            },
          },
        })
      );
    }

    set Selection_Type(newSelection_Type) {
      this._shadowRoot.getElementById("Selection_Type").value = newSelection_Type;
    }
    get Selection_Type() {
      return this._shadowRoot.getElementById("Selection_Type").value;
    }

    set Display(newDisplay) {
      this._shadowRoot.getElementById("Display").value = newDisplay;
    }
    get Display() {
      return this._shadowRoot.getElementById("Display").value;
    }

    set Separator(newSeparator) {
      this._shadowRoot.getElementById("Separator").value = newSeparator;
    }
    get Separator() {
      return this._shadowRoot.getElementById("Separator").value;
    }

    set Show_Display(newShow_Display) {
      this._shadowRoot.getElementById("Show_Display").value = newShow_Display;
    }
    get Show_Display() {
      return this._shadowRoot.getElementById("Show_Display").value;
    }

    set Field1_Name(newFL1) {
      this._shadowRoot.getElementById("FL1").value = newFL1;
    }
    get Field1_Name() {
      return this._shadowRoot.getElementById("FL1").value;
    }

    set Field2_Name(newFL2) {
      this._shadowRoot.getElementById("FL2").value = newFL2;
    }
    get Field2_Name() {
      return this._shadowRoot.getElementById("FL2").value;
    }

    set LEVEL_col(newLL) {
      this._shadowRoot.getElementById("LL").value = newLL;
    }
    get LEVEL_col() {
      return this._shadowRoot.getElementById("LL").value;
    }

    set PARENTID_col(newPI) {
      this._shadowRoot.getElementById("PI").value = newPI;
    }
    get PARENTID_col() {
      return this._shadowRoot.getElementById("PI").value;
    }

    set NODEID_col(newNI) {
      this._shadowRoot.getElementById("NI").value = newNI;
    }
    get NODEID_col() {
      return this._shadowRoot.getElementById("NI").value;
    }

    set TEXTID_col(newTI) {
      this._shadowRoot.getElementById("TI").value = newTI;
    }
    get TEXTID_col() {
      return this._shadowRoot.getElementById("TI").value;
    }

    set TEXTDEC_col(newTD) {
      this._shadowRoot.getElementById("TD").value = newTD;
    }
    get TEXTDEC_col() {
      return this._shadowRoot.getElementById("TD").value;
    }

  }

  customElements.define("com-ds-finalv3-sap-sac-alive-builder", MultiInput);
})();