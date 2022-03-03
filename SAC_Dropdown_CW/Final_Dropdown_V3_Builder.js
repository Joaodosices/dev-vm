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
                    border-radius: 3.5px;
                }
       option , select  {
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
                        <option  value="nodeid">ID</option>
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
                    <tr>
						<td >Retrun Parameter Column</td>
						<td><select class="form-control" name="RPC" id="RPC" >
                        <option selected="selected" value="DESCRIPTION">DESCRIPTION</option>
                        <option value="NODENAME">NODENAME</option>
                      </select></td>
					</tr>

            <tr>
						<td >Retrun Parameter Values</td>
						<td><select class="form-control" name="RPV" id="RPV" >
                        <option value="SV">Selected Node Values</option>
                        <option selected="selected" value="SCV">Selected Child Values</option>
                      </select></td>
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
                "Show_Display"
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

                   console.log(this.Selection_Type);
                   console.log(this.Display);
                   console.log(this.Separator);
                   console.log(this.Show_Display);

                      this.dispatchEvent(
                        new CustomEvent("propertiesChanged", {
                          detail: {
                            properties: {
                              ['Selection_Type']: this['Selection_Type'],
                              ['Display']: this['Display'],
                              ['Separator']: this['Separator'],
                              ['Show_Display']: this['Show_Display']
                              
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

    }

    customElements.define("com-ds-finalv3-sap-sac-alive-builder", MultiInput);
})();