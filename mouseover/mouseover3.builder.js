(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import url("https://sac-dev-cw.novartis.net/cw/dev/mouseover/bootstrap.min.css")
    </style>
   
    <h2 class="col-xs-12">General Properties</h2>
    <div class="col-xs-6">
        <label for="initState">Show Hand on Mouseover</label>
        <select class="form-control" id="showHand">
            <option value="true">On</option>
            <option value="false">Off</option>
        </select>
    </div>
    <div class="col-xs-6">
        <label >Show Active Part of Widget</label>
        <select class="form-control" id="showActive">
            <option value="true">On</option>
            <option value="false">Off</option>
        </select>
    </div>
    <div class="form-group col-xs-6">
        <label class="col-form-label">Height</label>
        <input class="form-control" id="hgt" type="number" min=1 />
    </div> 
    <div class="form-group col-xs-6">
        <label class="col-form-label">Width</label>
        <input class="form-control" id="wdh" type="number" min=1 />
    </div> 
    <div class="form-group col-xs-6">
        <label class="col-form-label">Left(X)</label>
        <input class="form-control" id="left" type="number" min=0 />
    </div> 
    <div class="form-group col-xs-6">
        <label class="col-form-label">Top(Y)</label>
        <input class="form-control" id="top" type="number" min=0  />
    </div> 
        `;
  customElements.define(
    'com-novartis-utils-mouseover-builder',
    class MouseOver3Builder extends HTMLElement {
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.setChangeEventListeners([
          'hgt',
          'wdh', 
          'left', 
          'top',
          'showHand', 
          'showActive'
        ]);
      }

      setChangeEventListeners(propArray) {
        const update = this.updateProp.bind(this);
        propArray.forEach((prop) => {
          this.getId(prop).addEventListener('change', () => update(prop));
        });
      }
      updateProp(prop) {
        this.dispatchEvent(
          new CustomEvent('propertiesChanged', {
            detail: {
              properties: {
                [prop]: this[prop],
              },
            },
          })
        );
      }

      getId(id) {
        return this._shadowRoot.getElementById(`${id}`);
      }

      get hgt() {
        return this.getId('hgt').valueAsNumber;
      }
      set hgt(height) {
        this.getId('hgt').value = height;
      }
      get wdh() {
        return this.getId('wdh').valueAsNumber;
      }
      set wdh(width) {
        this.getId('wdh').value = width;
      }
      get left() {
        return this.getId('left').valueAsNumber;
      }
      set left(value) {
        this.getId('left').value = value;
      }
      get top() {
        return this.getId('top').valueAsNumber;
      }
      set top(value) {
        this.getId('top').value = value;
      }
      get showHand() {
        return this.getId('showHand').value === 'true' ? true : false;
      }
      set showHand(bool) {
        this.getId('showHand').value = bool;
      }
      get showActive() {
        return this.getId('showActive').value === 'true' ? true : false;
      }
      set showActive(bool) {
        this.getId('showActive').value = bool;
      }
    }
  );
})();
