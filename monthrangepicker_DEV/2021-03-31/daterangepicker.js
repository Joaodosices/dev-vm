(function () {
	let template = document.createElement("template");
	template.innerHTML = `
	 <style>

#calendar-month, #calendar-decade {
  width: 300px;
  border: 1px solid #ababab;
  background: #fff;
}
.hide {
  display: none;
}
.year-container, .decade-container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    padding: 15px 0;
}

.next, .prev {
	color: #023054;
    background:  #deebf7;
    padding: 8px 13px;
    border-radius: 18px;
	font-weight: bold;
}
.next:hover, .prev:hover {
	color: #FFFFFF;
    background: #023054;
}
.next-disabled, .prev-disabled {
    color: #ababab;
    background:  #e5e5e5;
    padding: 8px 13px;
    border-radius: 18px;
	font-weight: bold;
}

#year, #decade, .year-container>div, .decade-container>div {
    text-align: center;
}
.d-next, .d-prev{
	color: #023054;
    background:  #deebf7;
    padding: 8px 13px;
    border-radius: 18px;
	font-weight: bold;
}
.d-next:hover, .d-prev:hover{
	color: #FFFFFF;
    background: #023054;
}
.d-next-disabled, .d-prev-disabled {
    color: #ababab;
    background:  #e5e5e5;
    padding: 8px 13px;
    border-radius: 18px;
	font-weight: bold;
}

.month-grid-container, #decade-grid-container {
    display: grid;
    grid-template-columns: repeat(3, 100px);
}
.month , .year {
    text-align: center;
    padding: 15px 0;
    margin:2px;
    border-radius: 2px;
    background-color: #fff;
    color: #000000;
}
.year:not(.disabled):hover {
    background-color: #deebf7;
	color: #000000;
}
.month:not(.disabled):hover {
    color: #000000;
    background-color: #deebf7;
}
.range-month {
    color: #000000;
    background-color: #deebf7;
}
.range-year {
    color: #000000;
    background-color: #deebf7;
}
.start-end-month {
    color: #FFFFFF;
    background-color: #023054;
}
.start-month {
    color: #FFFFFF;
    background-color: #023054;
}
.end-month {
    color: #FFFFFF;
    background-color: #023054;
}
.start-end-year {
    color: #FFFFFF;
    background-color: #023054;
}
.start-end-year:not(.disabled):hover {
    background-color: #deebf7;
}
.disabled {
    color: #ababab;
}

	</style>
<div id="calendar-month">
    <div class="year-container">
        <div>
            <label id="prev" class="prev">
                < </label>
        </div>
        <div>
            <label id="year" type="number"></label>
        </div>
        <div>
            <label id="next" class="next"> > </label>
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
            <label id="d-prev" class="input-button d-prev">
                < </label>
        </div>
        <div>
            <label id="decade" type="text"></label>
        </div>
        <div>
            <label id="d-next" class="input-button d-next"> > </label>
        </div>
    </div>
    <div id="decade-grid-container">
    
    </div>
</div>
    `;
	customElements.define(
		"com-novartis-js-monthrangepicker-dev",
		class DateRangePicker extends HTMLElement {
			constructor() {
				////console.log('**********cusntructor');
				super();
				// load material css inside shadow DOM
				this._shadowRoot = this.attachShadow({ mode: "open" });
				this._shadowRoot.appendChild(template.content.cloneNode(true));
				
				this.designMode=false;
				this.yearLabel = this.shadowRoot.getElementById("year");
				this.calendar = this.shadowRoot.getElementById("calendar-month");
				this.months = Array.from(this._shadowRoot.querySelectorAll(".month"));
				this.next = this.shadowRoot.getElementById("next");
				this.prev = this.shadowRoot.getElementById("prev");

				this.decadeLabel = this.shadowRoot.getElementById("decade");
				this.dCalendar = this.shadowRoot.getElementById("calendar-decade");
				this.initDYear = new Date().getFullYear(); //variable probably not needed. to check.
				this.initDYear = Math.floor(this.initDYear/10)*10;
				this.yearsToCentury = 0;
				this.initialYear = undefined;
				
				this.visLimitYearFrom = undefined;
				this.visLimitMonthFrom = undefined;
				this.visLimitYearTo = undefined;
				this.visLimitMonthTo = undefined;
				this.visMinYear = '1950';
				this.visMaxYear = '2200';
				
				this.disabledAll = false; //if set to truth, then calendar is by default disabled
				this.restrictedPeriods = [];
				this.width = 302;
				this.height = 258;
				this.rowHeight = this.height/5;
				
				//this.setDecadeGrid(true);
				this.setDecadeGridinit();
			}
			
			setDecadeGridinit() {
				//console.log('**********setDecadeGridinit');
				this.dGridContainer = this.shadowRoot.getElementById("decade-grid-container");
				 {
					let string = "";
					for (let i = 0; i <= 11; i++) {
						string += `<label class="year"></label>`;
					}
					this.dGridContainer.innerHTML = string;
				}  
				this.years = Array.from(this.shadowRoot.querySelectorAll(".year"));
				this.dNext = this.shadowRoot.getElementById("d-next");
				this.dPrev = this.shadowRoot.getElementById("d-prev");
			}
			
			setDecadeGrid(init) { //init not used. to be removed.
				//console.log('**********setDecadeGrid');
				let drawForYear = 0;
				let borderYear = 0;
				let string = "";
				let extraString = "";
				let startString='';
				let endString='';
				let i = 0;
				let noOfYears = 0;
				let minYear = this.visLimitYearFrom!==undefined ? this.visLimitYearFrom : this.visMinYear;
				let maxYear = this.visLimitYearTo!==undefined ? this.visLimitYearTo : this.visMaxYear;
				let minYearInTable = 2300;
				let maxYearInTable = 0;
				
				drawForYear = this.currentYear ;//? this.currentYear : this.initDYear;
				this.yearsToCentury = drawForYear - Math.floor(drawForYear/10)*10;
				
				let startYear = drawForYear - this.yearsToCentury; // this is the beginning of current decade/first year in calendar
				let endYear = startYear+11;
				
				let className="year";

				{
					if(maxYear - minYear>11){ //more then 11 year to be shown --> next prev buttons will work
						for (i = 0; i < 12; i++) { //count how many months will be shown in calendar
							if(!(startYear+i<minYear || startYear+i>maxYear)){
								noOfYears++;
							}
						}
						if(noOfYears!==12 && noOfYears!==3 && noOfYears!==6 && noOfYears!==9){ // if calendar is smaller then 12 years AND total number is not 3,6,9,12 then u need to have "filler"
							for(i=0; i<(3-noOfYears%3); i++){
								extraString += "<label class='year disabled'></label>";
							}
						}
						 
						if(startYear-1>=minYear && startYear-1<=maxYear){ //check if "filler" is on the end of calendar
							endString = extraString;
						}
						if(startYear+12>=minYear && startYear+12<=maxYear){ //check if "filler" is on beginning of calendar
							startString = extraString;
						}
					} else { //all year will fit in one calendar
						noOfYears=maxYear - minYear+1;
						startYear = minYear; //first year in calendar will not be a beginning of decade, but minimal visible year as all visible will fit in
					}
					this.height = noOfYears<=3?this.rowHeight*2:noOfYears<=6?this.rowHeight*3:noOfYears<=9?this.rowHeight*4:this.rowHeight*5;

					for (i = 0; i < 12; i++) {
						if(!(startYear+i<minYear || startYear+i>maxYear)){
							minYearInTable = Math.min(minYearInTable, startYear+i);
							maxYearInTable = Math.max(maxYearInTable, startYear+i);
							className="year"; 
							if(this.sy==startYear+i || this.ey==startYear+i){
								className = className.concat(' start-end-year');
							}
							if(this.sy<startYear+i && this.ey>startYear+i){
								className = className.concat(' range-month');
							}
							if(this.isYearDisabled(startYear+i)){
								console.log(startYear);
								console.log(i);
								className = className.concat(' disabled');
							} 
							string += `<label class="${className}">${startYear+i}</label>`;
						}
					}
					this.dGridContainer.innerHTML = startString+string+endString;
				}
				
				if((maxYear - minYear+1)>12){
					if(startYear-1<minYear){
						this.dPrev.className="input-button d-prev-disabled";
					} else {
						this.dPrev.className="input-button d-prev";
					}
					
					if(startYear+10>maxYear){
						this.dNext.className="input-button d-next-disabled";
					} else {
						this.dNext.className="input-button d-next";
					}
				} else {
					this.dPrev.className="input-button d-prev-disabled";
					this.dNext.className="input-button d-next-disabled";
				}
				

				this.decadeLabel.innerHTML = `${minYearInTable}-${maxYearInTable}`;
				this.years = Array.from(this.shadowRoot.querySelectorAll(".year"));
				this.yearsEventListeners();
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
					widget.setStyle(widget.width, widget.height);
					widget.dCalendar.className = "";
				});

				widget.next.addEventListener("click", function () {
					if(widget.next.className==="next"){
						++widget.currentYear;
						widget.yearLabel.innerText = widget.currentYear;
						widget.onYearChange();
					}
				});

				widget.prev.addEventListener("click", function () {
					if(widget.prev.className==="prev"){
						--widget.currentYear;
						widget.yearLabel.innerText = widget.currentYear;
						widget.onYearChange();
					}
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
							//console.log('aaa');
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
								
								for (let i = 0; i < widget.years.length; i++) {
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
					if(widget.dNext.className==="input-button d-next"){
						widget.currentYear = widget.currentYear + 10;
					}
					widget.setDecadeGrid();
					widget.setStyle(widget.width, widget.height);
				});
				widget.dPrev.addEventListener("click", function () {
					if(widget.dPrev.className==="input-button d-prev"){
						widget.currentYear = widget.currentYear - 10;
					}
					widget.setDecadeGrid();
					widget.setStyle(widget.width, widget.height);
				});
			}
			connectedCallback() {
				console.log('**********connectedCallback');
				const widget = this;
				this.yearLabel.innerText = widget.currentYear;
				this.setStyle(0, 0);
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
				//console.log(this.restrictedPeriods);
				let disabledPeriod = year.concat(month);
				this.restrictedPeriods["m".concat(disabledPeriod)]=true;
				//console.log(this.restrictedPeriods);
			}
			setEnabledPeriod(year, month) {
				//console.log('**********setDisabledMonth');
				let disabledPeriod = year.concat(month);
				this.restrictedPeriods["m".concat(disabledPeriod)]=false;

			}
			setVisibleRange(yearFrom, monthFrom, yearTo, monthTo) {
					//console.log(`showing only: ${yearFrom} ${monthFrom} ${yearTo} ${monthTo}`);
					this.visLimitMonthFrom=undefined;
					this.visLimitMonthTo=undefined;
					this.visLimitYearFrom=undefined;
					this.visLimitYearTo=undefined;
					
					yearFrom= yearFrom==undefined?'':yearFrom;
					monthFrom= monthFrom==undefined?'':monthFrom;
					monthTo= monthTo==undefined?'':monthTo;
					yearTo= yearTo==undefined?'':yearTo;
					
					//validate entry
					if (
						(yearFrom=='' && monthFrom=='' && yearTo=='' && monthTo=='') || 
						(this.calendarType==='month' && (monthFrom=='' && yearFrom!=='' || monthTo=='' && yearTo!==''))
					){
						console.log('Warrning: setVisibleRange - error in params or all values empty');
						return;
					}
					
					
					
					let oldMonthFrom=monthFrom;
					let oldMonthTo=monthTo;
					//fill missing values
					yearFrom = yearFrom==''?this.visMinYear:yearFrom;
					yearTo = yearTo==''?this.visMaxYear:yearTo;
					if(this.calendarType==='month'){
						monthFrom = monthFrom==''?'1':monthFrom;
						monthTo = monthTo==''?'12':monthTo;
					} else {
						monthFrom='1';
						monthTo='12';
					}
					//at this moment, we have all values
					
					//swap if to is before from
					if(parseInt(yearFrom)*100 + parseInt(monthFrom) > parseInt(yearTo)*100 + parseInt(monthTo)){
						let tmpYF = yearFrom;
						let tmpMF = monthFrom;
						monthFrom = monthTo;
						yearFrom = yearTo;
						monthTo = tmpMF;
						yearTo = tmpYF;
						if(this.calendarType!=='month'){
							monthFrom='1';
							monthTo='12';
						}
					}
					
					this.visLimitMonthFrom=parseInt(monthFrom)-1;
					this.visLimitMonthTo=parseInt(monthTo)-1;
					this.visLimitYearFrom=parseInt(yearFrom);
					this.visLimitYearTo=parseInt(yearTo);
					//console.log(`visible range: ${yearFrom} ${monthFrom} ${yearTo} ${monthTo}`);
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
			clearSelection(){
				//console.log('**********enableAll');
				this.sy=undefined;
				this.sm=undefined;
				this.ey=undefined;
				this.em=undefined;
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
			isDisabled(selectedYear, selectedMonth){ //applies only to MONTHS. use isYearDisabled for Years.
				
				if(this.visLimitYearFrom!==undefined){ //if theres a limit, check if it;s ourside the limit
					if(this.calendarType=='month'){
						let selected = selectedYear*100+selectedMonth;
						if(selected > this.visLimitYearTo*100+this.visLimitMonthTo+1 || selected < this.visLimitYearFrom*100+this.visLimitMonthFrom+1){
							return true;
						}
					} else {
						if(selectedYear > this.visLimitYearTo || selectedYear < this.visLimitYearFrom){
							return true;
						}
					}
				}
				
				let selMonth = selectedMonth==''?'':selectedMonth.toString();
				if(this.restrictedPeriods['m'.concat(selectedYear.toString()).concat(selMonth)]===undefined){ //if undefined, then it is not specified
					return this.disabledAll;
				} else {
					return this.restrictedPeriods['m'.concat(selectedYear.toString()).concat(selMonth)];
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
					if (this.initialYear!==undefined) {
						this.currentYear = this.initialYear;
						this.initialYear = undefined; 
					} else {
						this.currentYear = currentYear!==undefined ? currentYear : this.sy!==undefined ? this.sy : this.currentYear!==undefined ? this.currentYear : new Date().getFullYear();
					}
				}
				
				//now we need to calculate current year based on visible years setting
				let borderYear=0;
				if(this.visLimitYearFrom!==undefined){ //meaning - all values are set for vis varaibles
					if(this.visLimitYearFrom==parseInt(this.visMinYear)){ //minimal year was set
						borderYear = this.visLimitYearTo;
					}
					if(this.visLimitYearTo == parseInt(this.visMaxYear)){ //minimal year was set
						borderYear = this.visLimitYearFrom;
					}
					if(this.visLimitYearFrom !== parseInt(this.visMinYear) && this.visLimitYearTo !== parseInt(this.visMaxYear)){ //minimal year was set
						borderYear = Math.abs(this.currentYear-this.visLimitYearFrom)<Math.abs(this.currentYear-this.visLimitYearTo)?this.visLimitYearFrom:this.visLimitYearTo;
					}
					if(this.currentYear<this.visLimitYearFrom || this.currentYear>this.visLimitYearTo){
						this.currentYear=borderYear;
					}
				}
				
				
				if(this.calendarType=='month'){

					this.yearLabel.innerText = this.currentYear;
					 
					for (let i = 0; i < 12; i++) {
						////console.log(this.whatClass(this.currentYear, i+1));
						this.months[i].className =this.whatClass(this.currentYear, i+1);
					}
					if(this.visLimitYearFrom!==undefined){
						if(this.currentYear-1<this.visLimitYearFrom){
							this.prev.className="prev-disabled";
						} else {
							this.prev.className="prev";
						}
						if(this.currentYear+1>this.visLimitYearTo){
							this.next.className="next-disabled";
						} else {
							this.next.className="next";
						}
					}
					 
					this.calendar.className = "";
					this.dCalendar.className = "hide";
					this.setStyle(this.width, this.rowHeight*5);
				} else {
					this.setDecadeGrid();
					this.calendar.className = "hide";
					this.dCalendar.className = "";
					this.setStyle(this.width, this.height);
				} 
				 

				this.isOpen = true;
				
				 
			}
			
			closeCalendar() {
			  //console.log('**********closeCalendar');
				this.isOpen = false;
				this.calendar.className = "hide";
				this.setStyle(0, 0);
			}

			setStyle(width, height) {
			  //console.log('**********setStyle');
				if(!this.designMode){
					//this.parentNode.parentNode.parentNode.parentNode.style.width = `${width}px`;
					//this.parentNode.parentNode.parentNode.parentNode.style.height = `${height}px`;
					this.parentNode.parentNode.parentNode.style.width = `${width}px`;
					this.parentNode.parentNode.parentNode.style.height = `${height}px`;
				}
			}
			onYearChange() {
				//console.log('**********onYearChange');
				const months = this.months;
			
				for (let i = 0; i < 12; i++) {
					////console.log(this.whatClass(this.currentYear, i+1));
					this.months[i].className =this.whatClass(this.currentYear, i+1);
				}
				
				if(this.visLimitYearFrom!==undefined){
					if(this.currentYear-1<this.visLimitYearFrom){
						this.prev.className="prev-disabled";
					} else {
						this.prev.className="prev";
					}
					if(this.currentYear+1>this.visLimitYearTo){
						this.next.className="next-disabled";
					} else {
						this.next.className="next";
					}
				}
			}

			allTransparent() {
				 //console.log('**********allTransparent');
				 //console.log(this.years);
				if(this.calendarType=='month'){
					for (let i = 0; i < 12; i++) {
						//this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : ""} `; // disabled`; //
						this.months[i].className =this.whatClass(this.currentYear, i+1);
					}
				} else {
					for(let i=0; i<this.years.length; i++) {
					//for (let i = 0; i < 12; i++) {
						//this.months[i].className = `month ${this.currentYear == this.disabledYear && i == this.disabledMonth - 1 ? "disabled" : ""} `; // disabled`; //
						this.years[i].className =this.whatClass(this.years[i].innerText, undefined);
					}
				}
			}
			
			setExternalLink() {
				if(this.externalCssUrl){
					this.externalLink = document.createElement("link");
					this.externalLink.rel = "stylesheet";
					this.externalLink.href = this.externalCssUrl;
					//"https://sac-dev-cw.novartis.net/cw/dev/monthrangepicker_DEV/daterangepicke.css";
					this.shadowRoot.appendChild(this.externalLink);
				}
				
			//	console.log('**********setExternalLink');
			//	if(this.defaultCssUrl){ //this function throws an error when you drag and drop widget on canvas during edit. And this if is a protection.
			//		this.externalLink = document.createElement("link");
			//		this.externalLink.rel = "stylesheet";
			//		this.externalLink.href = `${(this.externalCssUrl ? this.externalCssUrl.trim() : this.externalCssUrl) ? this.externalCssUrl : this.defaultCssUrl}`;
			//		this.shadowRoot.appendChild(this.externalLink);
			//	}
			}
		  
			//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
			disconnectedCallback() {}

			//When the custom widget is updated, the Custom Widget SDK framework executes this function first
			onCustomWidgetBeforeUpdate(oChangedProperties) {
				//console.log('onCustomWidgetBeforeUpdate');
				//console.log(oChangedProperties);
				this.designMode=oChangedProperties["designMode"];
				//console.log(this.designMode);
			}
			//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
			onCustomWidgetAfterUpdate(oChangedProperties) {
				//console.log('**********onCustomWidgetAfterUpdate');
		  
				//if (this._firstConnection) {
					
				  //if (oChangedProperties.externalCssUrl != undefined) {
					//this.setExternalLink();
				  //}
				//}
			}

			//When the custom widget is removed from the canvas or the analytic application is closed
			onCustomWidgetDestroy() {}
		}
	);
})();
