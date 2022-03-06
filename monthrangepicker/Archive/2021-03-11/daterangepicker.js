(function () {
  let template = document.createElement("template");
  template.innerHTML = `
<div id="calendar-month">
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
<div id="calendar-decade" class="hide">
    <div class="decade-container">
        <div>
            <label id="d-prev" class="prev-btn">
                < </label>
        </div>
        <div>
            <label id="decade" type="text"></label>
        </div>
        <div>
            <label id="d-next" class="input-button"> > </label>
        </div>
    </div>
    <div id="decade-grid-container">
    
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
        this.calendar = this.shadowRoot.getElementById("calendar-month");
        this.months = Array.from(this._shadowRoot.querySelectorAll(".month"));
        this.next = this.shadowRoot.getElementById("next");
        this.prev = this.shadowRoot.getElementById("prev");

        this.decadeLabel = this.shadowRoot.getElementById("decade");
        this.dCalendar = this.shadowRoot.getElementById("calendar-decade");
        this.initDYear = new Date().getFullYear();
        this.setDecadeGrid(true);
      }
      setDecadeGrid(init) {
        this.dGridContainer = this.shadowRoot.getElementById("decade-grid-container");
        if (init) {
          let string = "";
          for (let i = 0; i < 12; i++) {
            string += `<label class="year">${this.initDYear - 4 + i}</label>`;
          }
          this.dGridContainer.innerHTML = string;
          this.years = Array.from(this.shadowRoot.querySelectorAll(".year"));
        } else {
          this.years.forEach((year, index) => {
            year.innerText = this.initDYear - 4 + index;
          });
          for (let i = 0; i < 12; i++) {
            this.years[i].className = `year`;
          }
        }

        this.dNext = this.shadowRoot.getElementById("d-next");
        this.dPrev = this.shadowRoot.getElementById("d-prev");
        this.decadeLabel.innerHTML = `${this.initDYear - 4}-${this.initDYear + 7}`;
      }
      monthsEventListeners() {
        const widget = this;
        const months = widget.months;
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

                if (widget.mode == "single") {
                  widget.endMonth = index;
                  widget.endYear = widget.currentYear;
                  widget.finishSelection();
                }
                months[index].className = "month start-end-month";
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
                  months[i].className = `month ${i == index ? "range-month" : ""}`;
                }
              } else if (widget.currentYear == widget.startYear) {
                if (index > widget.startMonth) {
                  for (let i = 0; i < months.length; i++) {
                    if (i >= index || i < widget.startMonth) {
                      months[i].className = "month";
                    } else if (i != widget.startMonth) {
                      months[i].className = "month range-month";
                    }
                  }
                } else if (index == widget.startMonth) {
                  for (let i = 0; i < months.length; i++) {
                    months[i].className = `month ${i == index ? "start-end-month" : ""}`;
                  }
                } else if (index < widget.startMonth) {
                  for (let i = 0; i < months.length; i++) {
                    if (i <= index || i > widget.startMonth) {
                      months[i].className = "month";
                    } else if (i != widget.startMonth) {
                      months[i].className = "month range-month";
                    }
                  }
                }
              } else if (widget.currentYear > widget.startYear) {
                for (let i = 0; i < 12; i++) {
                  months[i].className = `month ${i < index ? "range-month" : ""}`;
                }
              } else if (widget.currentYear < widget.startYear) {
                for (let i = 0; i < 12; i++) {
                  months[i].className = `month ${i > index ? "range-month" : ""}`;
                }
              }
            }
          });
        });
      }
      calendarsEventListeners() {
        const widget = this;
        widget.calendar.addEventListener("mouseleave", function () {
          if (widget.sm == undefined) {
            for (let i = 0; i < 12; i++) {
              widget.months[i].className = `month ${i == widget.startMonth ? "start-end-month" : ""}`;
            }
          }
        });
        widget.calendar.className = "hide";
      }
      monthsBtnListeners() {
        const widget = this;
        const months = widget.months;

        // year label listener to switch to decade mode
        widget.yearLabel.addEventListener("click", function () {
          widget.initDYear = widget.sy ? parseInt(widget.sy) : new Date().getFullYear();
          widget.setDecadeGrid();
          widget.calendar.className = "hide";
          widget.dCalendar.className = "";
        });

        widget.next.addEventListener("mouseover", function () {
          if (widget.sm == undefined) {
            if (widget.startMonth != undefined) {
              if (widget.startYear == widget.currentYear) {
                for (let i = 0; i < 12; i++) {
                  months[i].className = `month ${i < widget.startMonth ? "" : i == widget.startMonth ? "start-end-month" : "range-month"}`;
                }
              } else {
                for (let i = 0; i < 12; i++) {
                  months[i].className = "month range-month";
                }
              }
            } else {
              for (let i = 0; i < 12; i++) {
                months[i].className = "month";
              }
            }
          }
        });
        widget.next.addEventListener("mouseleave", function () {
          if (widget.sm == undefined) {
            for (let i = 0; i < 12; i++) {
              months[i].className = `month ${i == widget.startMonth ? "start-end-month" : ""}`;
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
                months[i].className = `month ${i < widget.startMonth ? "range-month" : i == widget.startMonth ? "start-end-month" : ""}`;
              }
            } else {
              for (let i = 0; i < 12; i++) {
                months[i].className = `month ${i == widget.startMonth ? "start-end-month" : ""}`;
              }
            }
          }
        });
        widget.prev.addEventListener("click", function () {
          --widget.currentYear;
          widget.yearLabel.innerText = widget.currentYear;
          widget.onYearChange();
        });
      }
      documentListeners() {
        const widget = this;
        document.addEventListener("click", function (e) {
          if (e.target != widget && widget.isOpen) {
            widget.allTransparent();
            widget.closeCalendar();
            widget.startMonth = undefined;
            widget.startYear = undefined;
          }
        });
        // let btn = this.shadowRoot.getElementById("open");
        // btn.addEventListener("click", function () {
        //   widget.openCalendar();
        // });
        // let btn1 = this.shadowRoot.getElementById('get');
        // btn1.addEventListener('click', function() {
        //   console.log(widget.getStartDate(), widget.getEndDate());
        // })
      }
      yearsEventListeners() {
        const widget = this;
        widget.years.forEach((year, index) => {
          year.addEventListener("click", function () {
            widget.openCalendar(parseInt(year.innerText));
          });
          year.addEventListener("mouseover", function () {
            for (let i = 0; i < 12; i++) {
              widget.years[i].className = `year ${i == index ? "start-end-year" : ""}`;
            }
          });
        });
      }
      yearsBtnListeners() {
        const widget = this;
        widget.dNext.addEventListener("click", function () {
          widget.initDYear = widget.initDYear + 12;
          widget.setDecadeGrid();
        });
        widget.dPrev.addEventListener("click", function () {
          widget.initDYear = widget.initDYear - 12;
          widget.setDecadeGrid();
        });
      }
      onCustomWidgetResize(width, height) {}
      //Fired when the widget is added to the html DOM of the page
      connectedCallback() {
        const widget = this;
        this.yearLabel.innerText = widget.currentYear;
        if (!widget._firstConnection) {
          widget.setExternalLink();
          this.calendarsEventListeners();
          this.documentListeners();

          this.monthsEventListeners();
          this.monthsBtnListeners();

          this.yearsEventListeners();
          this.yearsBtnListeners();
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
        this.disabledMonth = month;
        this.disabledYear = year;
      }
      getStartDate(format) {
        return this.formatDate(this.sm + 1, this.sy.toString(), format);
      }
      getEndDate(format) {
        return this.formatDate(this.em + 1, this.ey.toString(), format);
      }

      getMonthString(month, lCase) {
        switch (month) {
          case 1:
            return lCase == "lower" ? "Jan" : "JAN";
          case 2:
            return lCase == "lower" ? "Feb" : "FEB";
          case 3:
            return lCase == "lower" ? "Mar" : "MAR";
          case 4:
            return lCase == "lower" ? "Apr" : "APR";
          case 5:
            return lCase == "lower" ? "May" : "MAY";
          case 6:
            return lCase == "lower" ? "Jun" : "JUN";
          case 7:
            return lCase == "lower" ? "Jul" : "JUL";
          case 8:
            return lCase == "lower" ? "Aug" : "AUG";
          case 9:
            return lCase == "lower" ? "Sep" : "SEP";
          case 10:
            return lCase == "lower" ? "Oct" : "OCT";
          case 11:
            return lCase == "lower" ? "Nov" : "NOV";
          case 12:
            return lCase == "lower" ? "Dec" : "DEC";
        }
      }
      formatDate(month, year, format) {
        let returnDate = format ? format : this.dateFormat ? this.dateFormat : "MM/YYYY";
        if (returnDate.includes("MON")) {
          returnDate = returnDate.replace("MON", this.getMonthString(month, "upper"));
        } else if (returnDate.includes("Mon")) {
          returnDate = returnDate.replace("Mon", this.getMonthString(month, "lower"));
        } else if (returnDate.includes("MM")) {
          returnDate = returnDate.replace("MM", month > 9 ? month.toString() : "0" + month);
        } else if (returnDate.includes("M")) {
          returnDate = returnDate.replace("M", month.toString());
        }

        if (returnDate.includes("YYYY")) {
          returnDate = returnDate.replace("YYYY", year);
        } else if (returnDate.includes("YY")) {
          returnDate = returnDate.replace("YY", year.substring(year.length - 2));
        }
        return returnDate;
      }
      openCalendar(currentYear) {
        this.currentYear = currentYear ? currentYear : this.sy ? this.sy : new Date().getFullYear();
        this.yearLabel.innerText = this.currentYear;
        if (this.em) {
          if (this.currentYear == this.sy || this.currentYear == this.ey) {
            if (this.ey == this.sy) {
              for (let i = 0; i < 12; i++) {
                this.months[i].className = `month ${
                  this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                    ? "disabled"
                    : i > this.sm && i < this.em
                    ? "range-month"
                    : i == this.sm || i == this.em
                    ? "start-end-month"
                    : ""
                }`;
              }
            } else {
              if (this.currentYear == this.sy) {
                for (let i = 0; i < 12; i++) {
                  this.months[i].className = `month ${
                    this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                      ? "disabled"
                      : i > this.sm
                      ? "range-month"
                      : i == this.sm
                      ? "start-end-month"
                      : ""
                  }`;
                }
              } else {
                for (let i = 0; i < 12; i++) {
                  this.months[i].className = `month ${
                    this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                      ? "disabled"
                      : i < this.em
                      ? "range-month"
                      : i == this.em
                      ? "start-end-month"
                      : ""
                  }`;
                }
              }
            }
          } else if (this.currentYear > this.sy && this.currentYear < this.ey) {
            for (let i = 0; i < 12; i++) {
              this.months[i].className = `month ${
                this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : "range-month"
              }`;
            }
          } else {
            this.allTransparent();
          }
        }

        this.isOpen = true;
        this.calendar.className = "";
        this.dCalendar.className = "hide";
        this.setStyle(302, 258);
      }
      closeCalendar() {
        this.isOpen = false;
        this.calendar.className = "hide";
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
              months[i].className = `month ${
                this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                  ? "disabled"
                  : i == this.sm || i == this.em
                  ? "start-end-month"
                  : i > this.sm && i < this.em
                  ? "range-month"
                  : ""
              }`;
            }
          } else {
            this.allTransparent();
          }
        } else {
          if (this.sy == this.currentYear) {
            for (let i = 0; i < 12; i++) {
              months[i].className = `month ${
                this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                  ? "disabled"
                  : i > this.sm
                  ? "range-month"
                  : i == this.sm
                  ? "start-end-month"
                  : ""
              }`;
            }
          } else if (this.ey == this.currentYear) {
            for (let i = 0; i < 12; i++) {
              months[i].className = `month ${
                this.currentYear == this.disabledYear && i == this.disabledMonth - 1
                  ? "disabled"
                  : i < this.em
                  ? "range-month"
                  : i == this.em
                  ? "start-end-month"
                  : ""
              }`;
            }
          } else if (this.currentYear > this.sy && this.currentYear < this.ey) {
            for (let i = 0; i < 12; i++) {
              months[i].className = "month range-month";
            }
          } else {
            this.allTransparent();
          }
        }
      }

      allTransparent() {
        for (let i = 0; i < 12; i++) {
          this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : ""} `;
        }
      }
      setExternalLink() {
        this.externalLink = document.createElement("link");
        this.externalLink.rel = "stylesheet";
        this.externalLink.href = `${this.externalCssUrl.trim() ? this.externalCssUrl : this.defaultCssUrl}`;
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
