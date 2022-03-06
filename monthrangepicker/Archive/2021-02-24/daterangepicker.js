(function () {
  let template = document.createElement("template");
  template.innerHTML = `
<div id="calendar">
    <div class="year-container">
        <div>
            <label id="prev" class="prev-btn">
                < </label>
        </div>
        <div>
            <label id="year" type="number"></label>
        </div>
        <div>
            <label id="next" class="input-button"> > </label>
        </div>
    </div>
    <div class="month-grid-container">
        <label class="month">Jan</label>
        <label class="month">Feb</label>
        <label class="month">Mar</label>
        <label class="month">Apr</label>
        <label class="month">May</label>
        <label class="month">Jun</label>
        <label class="month">Jul</label>
        <label class="month">Aug</label>
        <label class="month">Sep</label>
        <label class="month">Oct</label>
        <label class="month">Nov</label>
        <label class="month">Dec</label>
    </div>
</div>
    `;
  customElements.define(
    "com-saccustomwidgets-js-monthrangepicker",
    class DateRangePicker extends HTMLElement {
      constructor() {
        super();
        // load material css inside shadow DOM
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.yearLabel = this.shadowRoot.getElementById("year");
        this.calendar = this.shadowRoot.getElementById("calendar");
        this.months = Array.from(this._shadowRoot.querySelectorAll(".month"));
        this.next = this.shadowRoot.getElementById("next");
        this.prev = this.shadowRoot.getElementById("prev");
      }

      onCustomWidgetResize(width, height) {}
      //Fired when the widget is added to the html DOM of the page
      connectedCallback() {
        const widget = this;
        const months = widget.months;
        this.yearLabel.innerText = widget.currentYear;
        if (!widget._firstConnection) {
          widget.setExternalLink();
          months.forEach((month, index) => {
            month.addEventListener("click", function () {
              if (index != widget.disabledMonth - 1 || widget.currentYear != widget.disabledYear) {
                if (widget.startMonth == undefined) {
                  widget.startMonth = index;
                  widget.startYear = widget.currentYear;
                  if (widget.em) {
                    widget.em = undefined;
                    widget.sm = undefined;
                    widget.ey = undefined;
                    widget.sy = undefined;
                    widget.allTransparent();
                  }

                  if (widget.mode == 'single') {
                    widget.endMonth = index;
                    widget.endYear = widget.currentYear;
                    widget.finishSelection();
                  }
                  months[index].className = 'month start-end-month';
                } else if (widget.startYear > widget.currentYear || (widget.startYear == widget.currentYear && widget.startMonth > index)) {
                  widget.endMonth = widget.startMonth;
                  widget.endYear = widget.startYear;
                  widget.startMonth = index;
                  widget.startYear = widget.currentYear;
                  widget.finishSelection();
                } else {
                  widget.endMonth = index;
                  widget.endYear = widget.currentYear;

                  widget.finishSelection();
                }
              }
            });
            month.addEventListener("mouseover", function () {
              if (widget.sm == undefined && (index != widget.disabledMonth - 1 || widget.currentYear != widget.disabledYear)) {
                if (widget.startMonth == undefined) {
                  for (let i = 0; i < months.length; i++) {
                    months[i].className = `month ${i==index ? 'range-month' : ''}`;
                  }
                } else if (widget.currentYear == widget.startYear) {
                  if (index > widget.startMonth) {
                    for (let i = 0; i < months.length; i++) {
                      if (i > index || i < widget.startMonth) {
                        months[i].className = "month";
                      } else if (i != widget.startMonth) {
                        months[i].className = 'month range-month';
                      }
                    }
                  } else if (index == widget.startMonth) {
                    for (let i = 0; i < months.length; i++) {
                      months[i].className = `month ${i==index ? 'start-end-month' : ''}`;
                    }
                  } else if (index < widget.startMonth) {
                    for (let i = 0; i < months.length; i++) {
                      if (i < index || i > widget.startMonth) {
                        months[i].className = 'month';
                      } else if (i != widget.startMonth) {
                        months[i].className = 'month range-month';
                      }
                    }
                  }
                } else if (widget.currentYear > widget.startYear) {
                  for (let i = 0; i < 12; i++) {
                    months[i].className = `month ${i<=index ? 'range-month' : ''}`;
                  }
                } else if (widget.currentYear < widget.startYear) {
                  for (let i = 0; i<12; i++){
                    months[i].className = `month ${i>=index ? 'range-color' : ''}`;
                  }
                }
              }
            });
            month.addEventListener('mouseleave', function() {
              if (widget.sm == undefined) {
                
              }
            })
          });

          widget.calendar.addEventListener("mouseleave", function () {
            if (widget.sm == undefined) {
              for (let i = 0; i < 12; i++) {
                months[i].className = `month ${i==widget.startMonth ? 'start-end-month' : ''}`;
              }
            }
          });

          widget.next.addEventListener("mouseover", function () {
            if (widget.sm == undefined) {
              if (widget.startMonth != undefined) {
                if (widget.startYear == widget.currentYear) {
                  for (let i = widget.startMonth; i < 12; i++) {
                    months[i].className = `month ${i==widget.startMonth ? 'start-end-month' : 'range-month'}`;
                  }
                } else {
                  for (let i = 0; i < 12; i++) {
                    months[i].className = 'month range-month';
                  }
                }
              } else {
                for (let i = 0; i < 12; i++) {
                  months[i].className = 'month';
                }
              }
            }
          });
          widget.next.addEventListener("mouseleave", function () {
            if (widget.sm == undefined) {
              for (let i = 0; i < 12; i++) {
                months[i].className = `month ${i==widget.startMonth ? 'start-end-month' : ''}`;
              }
            }
          });
          widget.next.addEventListener("click", function () {
            ++widget.currentYear;
            widget.yearLabel.innerText = widget.currentYear;
            widget.onYearChange();
          });

          widget.prev.addEventListener("mouseover", function () {
            if (widget.sm == undefined) {
              if (widget.startMonth != undefined) {
                for (let i = 0; i < 12; i++) {
                  months[i].className = `month ${i<widget.startMonth ? 'range-month' : i==widget.startMonth ? 'start-end-month' : ''}`;
                }
              } else {
                for (let i = 0; i < 12; i++) {
                  months[i].className = `month ${i==widget.startMonth ? 'start-end-month' : ''}`;
                }
              }
            }
          });
          widget.prev.addEventListener("click", function () {
            --widget.currentYear;
            widget.yearLabel.innerText = widget.currentYear;
            widget.onYearChange();
          });

          widget.calendar.style.display = "none";

          document.addEventListener("click", function (e) {
            if (e.target != widget && widget.isOpen) {
              widget.closeCalendar();
              widget.startMonth = undefined;
              widget.startYear = undefined;
            }
          });
        }
        this._firstConnection = true;
      }

      finishSelection() {
        this.em = this.endMonth;
        this.sm = this.startMonth;
        this.ey = this.endYear;
        this.sy = this.startYear;

        this.endMonth = undefined;
        this.startMonth = undefined;
        this.endYear = undefined;
        this.startYear = undefined;

        this.closeCalendar();

        this.dispatchEvent(new Event("onChange"));
      }
      setDisabledMonth(month, year) {
        
      }
      getStartDate() {
        return this.formatDate(this.sm + 1, this.sy.toString());
      }
      getEndDate() {
        return this.formatDate(this.em + 1, this.ey.toString());
      }

      formatDate(month, year) {
        let returnDate = this.dateFormat;
        if (returnDate.includes('MM')) {
          returnDate = returnDate.replace('MM', month > 9 ? month.toString() : '0'+month);
        } else if (returnDate.includes('M')) {
          returnDate = returnDate.replace('M', month.toString());
        }

        if (returnDate.includes('YYYY')) {
          returnDate = returnDate.replace('YYYY', year);
        } else if (returnDate.includes('YY')) {
          returnDate = returnDate.replace('YY', year.substring(year.length -2));
        }
        return returnDate;
      }
      openCalendar() {
        if (this.em) {
          this.currentYear = this.sy;
          this.yearLabel.innerText = this.currentYear;
          if (this.ey == this.sy) {
            for (let i = 0; i < 12; i++) {
              this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : i > this.sm && i < this.em ? 'range-month' : i == this.sm || i == this.em ? 'start-end-month' : ''}`;
              
            }
          } else {
            for (let i = 0; i < 12; i++) {
              this.months[i].className = 
              this.months[i].style.color = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : i > this.sm ? 'range-month' : i == this.sm ? 'start-end-month' : ''}`;
            }
          }
        } else {
          this.currentYear = new Date().getFullYear();
          this.yearLabel.innerText = this.currentYear;
        }

        this.isOpen = true;
        this.calendar.style.display = "block";
        this.setStyle(302, 258);
      }
      closeCalendar() {
        this.isOpen = false;
        this.calendar.style.display = "none";
        this.setStyle(0, 0);
      }

      setStyle(width, height) {
        this.parentNode.parentNode.parentNode.parentNode.style.width = `${width}px`;
        this.parentNode.parentNode.parentNode.parentNode.style.height = `${height}px`;
        this.parentNode.parentNode.parentNode.style.width = `${width}px`;
        this.parentNode.parentNode.parentNode.style.height = `${height}px`;
      }
      onYearChange() {
        const months = this.months;
        if (this.sm == undefined) {
          this.allTransparent();
        } else if (this.sy == this.ey) {
          if (this.sy == this.currentYear) {
            for (let i = 0; i < 12; i++) {
              this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : i==this.sm || i==this.em ? 'start-end-month' : i > this.sm && i < this.em ? 'range-month' : ''}`;
            }
          } else {
            this.allTransparent();
          }
        } else {
          if (this.sy == this.currentYear) {
            for (let i = 0; i < 12; i++) {
              this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : i > this.sm  ? 'range-color' : i == this.sm ? 'start-end-month' : ''}`;
           }
          } else if (this.ey == this.currentYear) {
            for (let i = 0; i < 12; i++) { 
              this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : i < this.em  ? 'range-color' : i == this.em ? 'start-end-month' : ''}`;
          }
          } else if (this.currentYear > this.sy && this.currentYear < this.ey) {
            for (let i=0;i<12;i++) {
              months[i].className = 'month range-month';
            }
          } else {
            this.allTransparent();
          }
        }
      }

      allTransparent() {
        for (let i = 0; i < 12; i++) {
          this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? 'disabled' : ''} `;
        }
      }
      setExternalLink() {
        this.externalLink = document.createElement("link");
        this.externalLink.rel = "stylesheet";
        this.externalLink.href = `${this.externalCssUrl.trim() ?  this.externalCssUrl : this.defaultCssUrl}`;
        this.shadowRoot.appendChild(this.externalLink);
      }
      //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
      disconnectedCallback() {}

      //When the custom widget is updated, the Custom Widget SDK framework executes this function first
      onCustomWidgetBeforeUpdate(oChangedProperties) {}
      //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
      onCustomWidgetAfterUpdate(oChangedProperties) {
        if (this._firstConnection) {
          if (oChangedProperties.externalCssUrl != undefined) {
            this.setExternalLink();
          }
        }
      }

      //When the custom widget is removed from the canvas or the analytic application is closed
      onCustomWidgetDestroy() {}
    }
  );
})();
