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
				////console.log('**********cusntructor');
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
				this.initDYear = Math.floor(this.initDYear/10)*10;
				this.yearsToCentury = 0;
				this.initialYear = undefined;
				
				
				this.disabledAll = false; //if set to truth, then calendar is by default disabled
				this.restrictedPeriods = [];
				
				this.setDecadeGrid(true);
			}
			
			setDecadeGrid(init) {
				//console.log('**********setDecadeGrid');
				let drawForYear = 0;
				this.dGridContainer = this.shadowRoot.getElementById("decade-grid-container");
				//drawForYear = selectedYear ? selectedYear : this.initDYear;
				drawForYear = this.currentYear ? this.currentYear : this.initDYear;
				this.yearsToCentury = drawForYear - Math.floor(drawForYear/10)*10;
				let className="year";
				if (init) {
					let string = "";
					for (let i = 0; i < 12; i++) {
						if(this.isYearDisabled(drawForYear - this.yearsToCentury + i)){
							className = 'year disabled';
						} else {
							className = "year";
						}
						string += `<label class="${className}">${drawForYear - this.yearsToCentury + i}</label>`;
					}
					this.dGridContainer.innerHTML = string;
					this.years = Array.from(this.shadowRoot.querySelectorAll(".year"));
				} else {
					this.years.forEach((year, index) => {
						year.innerText = drawForYear - this.yearsToCentury + index;
					});
					for (let i = 0; i < 12; i++) {
						className="year"; 
						if(this.sy==this.years[i].innerText || this.ey==this.years[i].innerText){
							className = className.concat(' start-end-year');
						}
						if(this.sy<parseInt(this.years[i].innerText) && this.ey>parseInt(this.years[i].innerText)){
							className = className.concat(' range-month');
						}
						if(this.isYearDisabled(this.years[i].innerText)){
							className = className.concat(' disabled');
						} 
						this.years[i].className = `${className}`;
					}
				} 

				this.dNext = this.shadowRoot.getElementById("d-next");
				this.dPrev = this.shadowRoot.getElementById("d-prev");
				this.decadeLabel.innerHTML = `${drawForYear - this.yearsToCentury}-${drawForYear + 11 - this.yearsToCentury}`;
		
			}
			monthsEventListeners() {
				//console.log('**********monthsEventListeners');
				const widget = this;
				const months = widget.months;
				months.forEach((month, index) => {
					month.addEventListener("click", function () {
						if (!widget.isDisabled(widget.currentYear, index+1)) {
							if (widget.startMonth == undefined) { //if start month is not yet selected
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
							} else if (widget.startYear > widget.currentYear || (widget.startYear == widget.currentYear && widget.startMonth > index)) { //if end click is before start click
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
						////console.log('month.mouseover');
						if (widget.sm == undefined ) { //if nothing was previously selected
						  //if (widget.startMonth == undefined) { //if nothing is selected yet, just mark the mouseover element and clear others
							//for (let i = 0; i < months.length; i++) {
							//  months[i].className = `month ${i == index ? "range-month" : ""}`;
							//}
						  //} else 
							if (widget.currentYear == widget.startYear) { //if we are within the same year and sth was selected
								if (index > widget.startMonth) { //we are on the right of selection
									for (let i = 0; i < months.length; i++) {
										if (i >= index || i < widget.startMonth) { //clear all others (on the right from cursor or left of start month)
											months[i].className = "month";
										} else if (i != widget.startMonth) { //mark as month range
											months[i].className = "month range-month";
										} 
										if (widget.isDisabled(widget.currentYear, i+1)){
											months[i].className = months[i].className.concat(" disabled");
										}
									}
								} else if (index == widget.startMonth) { //when over startmonth mark others as normal
									for (let i = 0; i < months.length; i++) {
										months[i].className = `month ${i == index ? "start-end-month" : ""}`;
										if (widget.isDisabled(widget.currentYear, i+1)){
											months[i].className = months[i].className.concat(" disabled");
										}
									}
								} else if (index < widget.startMonth) { // mark when cursor is before selected start
									for (let i = 0; i < months.length; i++) {
										if (i <= index || i > widget.startMonth) {
											months[i].className = "month";
										} else if (i != widget.startMonth) {
											months[i].className = "month range-month";
										}
										if (widget.isDisabled(widget.currentYear, i+1)){
											months[i].className = months[i].className.concat(" disabled");
										}
									}
								}
							} else if (widget.currentYear > widget.startYear) { //mark as range everything up to cursor
								for (let i = 0; i < 12; i++) {
									months[i].className = `month ${i < index ? "range-month" : ""}`;
									if (widget.isDisabled(widget.currentYear, i+1)){
										months[i].className = months[i].className.concat(" disabled");
									}
								}
							} else if (widget.currentYear < widget.startYear) {//mark as selected everything from cursor
								for (let i = 0; i < 12; i++) {
									months[i].className = `month ${i > index ? "range-month" : ""}`;
									if (widget.isDisabled(widget.currentYear, i+1)){
										months[i].className = months[i].className.concat(" disabled");
									}
								}
							}
						}
					});
				});
			}
			
			calendarsEventListeners() {
				//console.log('**********calendarsEventListeners');
				const widget = this;
				widget.calendar.addEventListener("mouseleave", function () {
					//console.log('calendar mouseleave');
				});
				widget.calendar.className = "hide"; // why do we have this here? this just hides the calendar.
			}
			
			monthsBtnListeners() {
				  //console.log('**********monthsBtnListeners');
				const widget = this;
				const months = widget.months;

				// year label listener to switch to decade mode
				widget.yearLabel.addEventListener("click", function () {
					//console.log('widget.yearLabel');
					widget.initDYear = widget.sy ? parseInt(widget.sy) : new Date().getFullYear();
					widget.setDecadeGrid();
					widget.calendar.className = "hide";
					widget.dCalendar.className = "";
				});



				widget.next.addEventListener("click", function () {
					++widget.currentYear;
					widget.yearLabel.innerText = widget.currentYear;
					widget.onYearChange();
				});


				widget.prev.addEventListener("click", function () {
				  --widget.currentYear;
				  widget.yearLabel.innerText = widget.currentYear;
				  widget.onYearChange();
				});
			}
		
			documentListeners() {
				//console.log('**********documentListeners');
				const widget = this;
				document.addEventListener("click", function (e) {
				//console.log('**********documentListeners:document.addEventListener');
				if (e.target != widget && widget.isOpen) {
					//console.log('**********documentListeners:document.addEventListener inside');
					widget.allTransparent(); //in my opinion this is not needed.
					widget.closeCalendar();
					widget.startMonth = undefined; 
					widget.startYear = undefined;
				}
				});
			}
			
			yearsEventListeners() { 
				  //console.log('**********yearsEventListeners'); 
				const widget = this;
				let intYear=0;
				widget.years.forEach((year, index) => {
					if(this.calendarType=='month'){
						year.addEventListener("click", function () { //add this if it is a month. otherwise just run onSelectYear.
							widget.openCalendar(parseInt(year.innerText));
						});
					} else { //year selection
						//console.log('adding event liesener '.concat(year.innerText));
						year.addEventListener("click", function () {
							//console.log('year clicked in year mode');
							//console.log(year.innerText);
							if (!widget.isDisabled(year.innerText, '')) {
								if (widget.mode == "single") {
									widget.em = undefined;
									widget.sm = undefined;
									widget.ey = undefined;
									widget.sy = undefined;
									widget.startMonth = 0;
									widget.startYear = parseInt(year.innerText);
									widget.endMonth = 11;
									widget.endYear = parseInt(year.innerText);
									widget.finishSelection();
								} else {
									if(widget.startYear==undefined){
										widget.em = undefined;
										widget.sm = undefined;
										widget.ey = undefined;
										widget.sy = undefined;
										widget.startMonth = 0;
										widget.startYear = parseInt(year.innerText);
										widget.allTransparent();
										year.className="year start-end-year";
										widget.endMonth = undefined;
										widget.endYear = undefined;
									} else if (widget.startYear > parseInt(year.innerText) ) { //if end click is before start click
										widget.endMonth = 11;
										widget.endYear = widget.startYear;
										widget.startMonth = 0;
										widget.startYear = parseInt(year.innerText);
										year.className="year start-end-year";
										widget.finishSelection();
									} else {
										widget.endMonth = 11;
										widget.endYear = parseInt(year.innerText);
										year.className="year start-end-year";
										widget.finishSelection();
									}
								}
							}
						});
						
						year.addEventListener("mouseover", function () {
							if(widget.startYear!==undefined && widget.endYear == undefined){
								widget.allTransparent();
								
								for (let i = 0; i < 12; i++) {
									intYear=parseInt(widget.years[i].innerText);
									if(intYear==widget.startYear){
										widget.years[i].className = 'year start-end-year';
									}
									if(intYear>parseInt(year.innerText) && intYear<widget.startYear || intYear>widget.startYear && intYear<parseInt(year.innerText)){
										widget.years[i].className = 'year range-year';
									}
									if(widget.isYearDisabled(intYear)){
										widget.years[i].className = widget.years[i].className.concat(' disabled');
									}
									//widget.years[i].className = `year ${i == index ? " start-end-year " : ""} ${widget.isYearDisabled(widget.years[i].innerHTML) ? " disabled " : ""}`; 
								}
							}
							
						});
					}
					
					
				});
			}
	  
			yearsBtnListeners() {
				  //console.log('**********yearsBtnListeners');
				const widget = this;
				widget.dNext.addEventListener("click", function () {
					widget.currentYear = widget.currentYear + 10;
					console.log(widget.currentYear);
					widget.setDecadeGrid();
				});
				widget.dPrev.addEventListener("click", function () {
					widget.currentYear = widget.currentYear - 10;
					console.log(widget.currentYear);
					widget.setDecadeGrid();
				});
			}
      //onCustomWidgetResize(width, height) {}
      //Fired when the widget is added to the html DOM of the page
			connectedCallback() {
				  //console.log('**********connectedCallback');
				const widget = this;
				this.yearLabel.innerText = widget.currentYear;
				if (!widget._firstConnection) {
					widget.setExternalLink();
					this.calendarsEventListeners();
					this.documentListeners();
						if(this.calendarType=='month'){ //no need to set it when calendar is in a year-selection mode
							this.monthsEventListeners();
							this.monthsBtnListeners();
						}

					this.yearsEventListeners();
					this.yearsBtnListeners();
				}
				this._firstConnection = true;
			}

			finishSelection() {
				//console.log('**********finishSelection');
				const widget=this;
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
      
		
			getStartDate(format) {
				//console.log('**********getStartDate');
				if(this.sm==undefined || this.sy==undefined){
					return undefined;
				}
				return this.formatDate(this.sm + 1, this.sy.toString(), format);
			}
			getEndDate(format) {
				//console.log('**********getEndDate');
				if(this.em==undefined || this.ey==undefined){
					return undefined;
				}
				return this.formatDate(this.em + 1, this.ey.toString(), format);
			}
			setInitialVisibleYear(initialYear) {
				//console.log('**********setInitialYear'.concat(initialYear));
				this.initialYear = parseInt(initialYear);
				//this.sy = this.initialYear;
			}
			setStartDate(startDateYear, startDateMonth) {
				//console.log('**********setStartDate: '.concat(startDateYear).concat(' ').concat(startDateMonth));
				this.sy = parseInt(startDateYear);
				this.sm = parseInt(startDateMonth)-1;
				let i = 0;
				if (this.mode == "single") { 
					this.ey = parseInt(startDateYear);
					this.em = parseInt(startDateMonth)-1;
				} else {
					if(this.ey!==undefined && this.sy!==undefined){ 
						if(this.sy>this.ey){
							i = this.sy;
							this.sy=this.ey;
							this.ey=i;
						}
					}
				}
				//this.sy = this.initialYear;
			}
			setEndDate(endDateYear, endDateMonth) {
				//console.log('**********setEndDate: '.concat(endDateYear).concat(' ').concat(endDateMonth));
				this.ey = parseInt(endDateYear);
				this.em = parseInt(endDateMonth)-1;
				let i = 0;
				if (this.mode == "single") {
					this.sy = parseInt(endDateYear);
					this.sm = parseInt(endDateMonth)-1;
				} else {
					if(this.ey!==undefined && this.sy!==undefined){
						if(this.sy>this.ey){
							i = this.sy;
							this.sy=this.ey;
							this.ey=i;
						}
					}
				}
				//this.sy = this.initialYear;
			}

			getMonthString(month, lCase) { 
			  //console.log('**********getMonthString');
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
			  //console.log('**********formatDate');
				let returnDate = format ? format : this.dateFormat ? this.dateFormat : "MM;YYYY";
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
			
			setDisabledPeriod(year, month) {
				//console.log('**********setDisabledMonth');
				let disabledPeriod = year.concat(month);
				this.restrictedPeriods["m".concat(disabledPeriod)]=true;

			}
			setEnabledPeriod(year, month) {
				//console.log('**********setDisabledMonth');
				let disabledPeriod = year.concat(month);
				this.restrictedPeriods["m".concat(disabledPeriod)]=false;

			}
		
			disableAll(){
				//console.log('**********diableAll');
				this.disabledAll=true;
				this.restrictedPeriods=[];
			}
			
			enableAll(){
				//console.log('**********enableAll');
				this.disabledAll=false;
				this.restrictedPeriod=[];
			}
			
			isYearDisabled(selectedYear){
				let disabled  = true;
				if(this.calendarType=='month'){ // check all months if this is month calendar`
					for (let i = 1; i <= 12; i++) {
						if(!this.isDisabled(selectedYear, i)){
							disabled = false;
						} 
					}
				} else {
					if(!this.isDisabled(selectedYear, '')){
						disabled = false;
					} 
				}
				
				return disabled;
			}
			
			isDisabled(selectedYear, selectedMonth){
				//console.log('**********isDisabled');

				if(this.restrictedPeriods['m'.concat(selectedYear.toString()).concat(selectedMonth.toString())]===undefined){ //if undefined, then it is not specified
					return this.disabledAll;
				} else {
					return this.restrictedPeriods['m'.concat(selectedYear.toString()).concat(selectedMonth.toString())];
				}
			}
			
			whatClass(selectedYear, selectedMonth){ 
				//console.log(`**********whatClass month ${ selectedMonth } year ${selectedYear}`); 
				let periodNumber = 0;
				let classname = "";
				if(this.calendarType=='month'){
					classname="month ";
					if(selectedMonth!==undefined){ //question is about month
						periodNumber = selectedYear*100+selectedMonth;
						if(periodNumber<this.sy*100+this.sm+1){ //before start month
							//return 'month ';
						} else if(periodNumber===this.sy*100+this.sm+1){ //start month
							classname = classname.concat(" start-month");
							//return 'month start-month ';
						} else if(periodNumber>this.sy*100+this.sm+1 && periodNumber<this.ey*100+this.em+1){ //this is a month between selected months
							classname = classname.concat(" range-month");
							//return 'month range-month';
						} else if(periodNumber===this.ey*100+this.em+1){ //exactly end month 
							classname = classname.concat(" end-month");
							//return 'month end-month';
						} else { //all others, which actually should be  > then end month
							//return 'month ';
						}
					} else { //question is about year within month calendar
						
					}
					if(this.isDisabled(selectedYear, selectedMonth)){
						classname = classname.concat(" disabled");
						//return 'month disabled';
					}  
				} else { //else it's year calendar
					classname ="year";
					if(this.isYearDisabled(selectedYear)){
						classname=classname.concat(' disabled');
					}
				}
				//console.log('returning '.concat(classname));
				return classname;
			}
	  
			openCalendar(currentYear) {
				//console.log('**********openCalendar');
				if(this.sy!==undefined && this.sm!==undefined && this.ey!==undefined && this.em!==undefined){ //check if all values are set, or just part of them. part of them is incorrect setting.
					if(this.sy*100+this.sm>this.ey*100+this.em){ //switch if end date is before start date
						this.tmp_sy = this.sy;
						this.tmp_sm = this.sm;
						this.sy=this.ey;
						this.sm=this.em;
						this.ey=this.tmp_sy;
						this.em=this.tmp_sm;
						this.tmp_sy=undefined; 
						this.tmp_sm=undefined;
					}
				} else { //if part of them like only setStartDate was called, then just clear whetever ws selected.
					this.sy=undefined;
					this.sm=undefined;
					this.ey=undefined; 
					this.em=undefined;
				}
				
				{ //this code is responsible for using initialYear if it was set. And use it only once. 
					if (this.initialYear) {
						this.currentYear = this.initialYear;
						this.initialYear = undefined; 
					} else {
						this.currentYear = currentYear ? currentYear : this.sy ? this.sy : this.currentYear ? this.currentYear : new Date().getFullYear();
					}
				}
				
				if(this.calendarType=='month'){
					this.yearLabel.innerText = this.currentYear;
					
					for (let i = 0; i < 12; i++) {
						////console.log(this.whatClass(this.currentYear, i+1));
						this.months[i].className =this.whatClass(this.currentYear, i+1);
					}
					
					this.calendar.className = "";
					this.dCalendar.className = "hide";
				} else {
					this.initDYear = this.sy ? parseInt(this.sy) : new Date().getFullYear();
					this.setDecadeGrid();
					this.calendar.className = "hide";
					this.dCalendar.className = "";
				}

				this.isOpen = true;
				
				this.setStyle(302, 258);
			}
			
			closeCalendar() {
			  //console.log('**********closeCalendar');
				this.isOpen = false;
				this.calendar.className = "hide";
				this.setStyle(0, 0);
			}

			setStyle(width, height) {
			  //console.log('**********setStyle');
				this.parentNode.parentNode.parentNode.parentNode.style.width = `${width}px`;
				this.parentNode.parentNode.parentNode.parentNode.style.height = `${height}px`;
				this.parentNode.parentNode.parentNode.style.width = `${width}px`;
				this.parentNode.parentNode.parentNode.style.height = `${height}px`;
			}
			onYearChange() {
				//console.log('**********onYearChange');
				const months = this.months;
			
				for (let i = 0; i < 12; i++) {
					////console.log(this.whatClass(this.currentYear, i+1));
					this.months[i].className =this.whatClass(this.currentYear, i+1);
				}
			}

			allTransparent() {
				 //console.log('**********allTransparent');
				if(this.calendarType=='month'){
					for (let i = 0; i < 12; i++) {
						//this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : ""} `; // disabled`; //
						this.months[i].className =this.whatClass(this.currentYear, i+1);
					}
				} else {
					for (let i = 0; i < 12; i++) {
						//this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : ""} `; // disabled`; //
						this.years[i].className =this.whatClass(this.years[i].innerText, undefined);
					}
				}
			}
			
			setExternalLink() {
			  //console.log('**********setExternalLink');
				if(this.defaultCssUrl){ //this function throws an error when you drag and drop widget on canvas during edit. And this if is a protection.
					this.externalLink = document.createElement("link");
					this.externalLink.rel = "stylesheet";
					this.externalLink.href = `${(this.externalCssUrl ? this.externalCssUrl.trim() : this.externalCssUrl) ? this.externalCssUrl : this.defaultCssUrl}`;
					this.shadowRoot.appendChild(this.externalLink);
				}
			}
		  
			//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
			disconnectedCallback() {}

			//When the custom widget is updated, the Custom Widget SDK framework executes this function first
			onCustomWidgetBeforeUpdate(oChangedProperties) {}
			//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
			onCustomWidgetAfterUpdate(oChangedProperties) {
				//console.log('**********onCustomWidgetAfterUpdate');
		  
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
