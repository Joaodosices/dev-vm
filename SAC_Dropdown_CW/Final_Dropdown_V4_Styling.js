(function () {
  let tmpl = document.createElement("template");
  tmpl.innerHTML = `
     <style>
    </style>
     <style>
          table {
                     font-size:15px;
                     border: 0px solid black;
                     width: 390px;
                     margin-bottom:50px;
                     
                 }                      
          td {
                    padding-bottom: 4px;
          }
                  
          select,input {
                         
                         font-size: 15px;
                         height:30px;
                         border-radius: 1.5px;
                         border-color:lightgray;
                       }
 
        option , select, input  {
                                  font-weight: normal;
                                }  
     </style>
             <table>
                <tr>
                   <td>Font</td>
                   <td>Size</td>
                   <td>Style</td>
                   <td>Color</td>
                </tr>
 
                     <tr>
                   
                     <td><select style="width:155px;"  class="form-control" name="fstyle" id="fstyle" >
                         <option value="72-Web">72-Web</option>
                         <option selected="selected"  value="Arial">Arial</option>
                         <option value="Bai Jamjuree">Bai Jamjuree</option>
                         <option value="Besley">Besley</option>
                         <option value="Chakra Petch">Chakra Petch</option>
                         <option value="Changa">Changa</option>
                         <option value="Courier">Courier</option>
                         <option value="EL Messiri">EL Messiri</option>
                         <option value="Georgia">Georgia</option>
                         <option value="Jura">Jura</option>
                         <option value="Lato">Lato</option>
                         <option value="Marcellus">Marcellus</option>
                         <option value="Montserrat Alternates">Montserrat Alternates</option>
                         <option value="Old Standard TT">Old Standard TT</option>
                         <option value="Philosopher">Philosopher</option>
                         <option value="Prata">Prata</option>
                         <option value="Roboto">Roboto</option>
                         <option value="Saira">Saira</option>
                         <option value="Times New Roman">Times New Roman</option>
                         <option value="Trebuchet MS">Trebuchet MS</option>
                         <option value="Verdana">Verdana</option>
                         <option value="Vidaloka">Vidaloka</option>
                       </select></td>

                   <td><select  style="width:50px;  margin-right:10px;"  class="form-control" name="fsize" id="fsize" >
                         <option selected="selected" value="10">10</option>
                         <option value="12">12</option>
                         <option value="14">14</option>
                         <option value="16">16</option>
                         <option value="20">20</option>
                         <option value="22">22</option>
                         <option value="24">24</option>
                         <option value="32">32</option>
                         <option value="48">48</option>
                       </select></td>

                       <td><select  style="width:75px; margin-right:10px;" class="form-control" name="fbi" id="fbi" >
                       <option selected="selected" value="normal">Normal</option>
                       <option value="bold">Bold</option>
                       <option value="italic">Italic</option>                       
                     </select></td>

                       <td>
                       <input style="width:45px" type="color" class="form-control" name="fcolor" id="fcolor" >
                       </input>
                       </td>
                </tr>
 
             </table>
          <style>
       :host {
          display: block;
       }
       </style>
    `;

  class MultiInput extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

      this.setChangeEventListeners([
        "fstyle",
        "fsize",
        "fbi",
        "fcolor"

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

      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              ['fstyle']: this['fstyle'],
              ['fsize']: this['fsize'],
              ['fbi']: this['fbi'],
              ['fcolor']: this['fcolor']


            },
          },
        })
      );
    }

    set fstyle(newfstyle) {
      this._shadowRoot.getElementById("fstyle").value = newfstyle;
    }
    get fstyle() {
      return this._shadowRoot.getElementById("fstyle").value;
    }

    set fsize(newfsize) {
      this._shadowRoot.getElementById("fsize").value = newfsize;
    }
    get fsize() {
      return this._shadowRoot.getElementById("fsize").value;
    }

    set fbi(newfbi) {
      this._shadowRoot.getElementById("fbi").value = newfbi;
    }
    get fbi() {
      return this._shadowRoot.getElementById("fbi").value;
    }

    set fcolor(newfcolor) {
      this._shadowRoot.getElementById("fcolor").value = newfcolor;
    }
    get fcolor() {
      return this._shadowRoot.getElementById("fcolor").value;
    }


  }

  customElements.define("com-ds-finalv4-sap-sac-alive-styling", MultiInput);
})();