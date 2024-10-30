export default class RangePicker {

    element
    subElements = {}

    constructor(obj) {
        const {
            from,
            to
        } = obj

        this.from = from
        this.to = to
        this.isShown = false
        this.leftCalendar =  new Date(this.from)
        this.rightCalendar = new Date(this.from)
        this.rightCalendar.setMonth(this.rightCalendar.getMonth() + 1)

        this.element = this.createElement()
        this.selectSubElements()
        this.createListeners()
    }

    createElement() {
        const element = document.createElement('div')
        element.innerHTML = this.createElementTemplate()
        return element.firstElementChild
    }

    createElementTemplate() {
        return `
        <div class="rangepicker">
        ${this.createRangePickerInput()}
        ${this.createRangePickerSelector()}
        </div>
        `
    }

    createRangePickerInput() {
        return `
        <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.getInputDate(this.from)}</span> -
            <span data-element="to">${this.getInputDate(this.to)}</span>
        </div>
        `
    }

    createRangePickerSelector() {
        return `
        <div class="rangepicker__selector" data-element="selector"></div>
        `
    }

    createRangePickerCalendar(date, side) {
        const monthName = date.toLocaleString('ru', { month: 'long' })
        return `
        <div data-element="${side}" class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
                <time datetime="${monthName}">${monthName}</time>
            </div>
            <div class="rangepicker__day-of-week">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <div class="rangepicker__date-grid">
            ${this.getRangePickerDateGrid(date)}
            </div>     
        </div>
        `
    }

    getRangePickerDateGrid(date) {
        const year = date.getFullYear()
        const month = date.getMonth()
        const lastDay = new Date(year, month + 1, 0).getDate()
        const firstDayDate = new Date(year, month, 1)

        const getDayOfWeek = (year, month) => {
            const day = new Date(year, month, 1).getDay()
            return day == 0 ? 7 : day 
        }

        let htmlTemplate = `
        <button type="button" class="rangepicker__cell" data-value="${firstDayDate.toISOString()}" style="--start-from: ${getDayOfWeek(year, month)}">1</button>
        `

        for (let i = 2; i <= lastDay; i++) {
            const currentDate = new Date(year, month, i)
            htmlTemplate += `
            <button type="button" class="rangepicker__cell" data-value="${currentDate.toISOString()}">${i}</button>
            `
        }

        return htmlTemplate
    }

    getInputDate(date) {
        return date.toLocaleString("ru", { dateStyle: "short" })
    }

    createListeners() {
        this.subElements.input.addEventListener('click', this.handleInputClick)
        this.subElements.selector.addEventListener('click', this.handleSelectorClick)
    }

    removeListeners() {
        this.subElements.input.removeEventListener('click', this.handleInputClick)
        this.subElements.selector.removeEventListener('click', this.handleSelectorClick)
    }

    handleSelectorClick = (event) => {
        if (event.target.classList.contains('rangepicker__selector-control-left')) {
            const right = new Date(this.leftCalendar)
            const left = this.leftCalendar
            left.setMonth(left.getMonth() - 1)
            this.updateCalendars(left, right)
            
        }

        if (event.target.classList.contains('rangepicker__selector-control-right')) {
            const left = new Date(this.rightCalendar)
            const right = this.rightCalendar
            right.setMonth(left.getMonth() + 1)
            this.updateCalendars(left, right)
        }

        if (event.target.classList.contains('rangepicker__cell')) {
            this.removeHighLightCells()
            this.updateDateRange(event.target.dataset.value)
        }

    }

    updateDateRange(value) {
        if (this.from & this.to) {
            this.from = new Date(value)
            this.to = null
        } else if (this.to == null) {
            this.to = new Date(value)
            this.updateInputDates()
        }

        this.highlightCells()
        
    }

    updateInputDates() {
        this.subElements.from.innerHTML = `${this.getInputDate(this.from)}`
        this.subElements.to.innerHTML = `${this.getInputDate(this.to)}`
        this.dispatchEvent()
    }

    updateCalendars(left, right) {
        this.subElements.leftCalendar.remove()
        this.subElements.rightCalendar.remove()

        const newLeftCalendar = document.createElement('div')
        newLeftCalendar.innerHTML = this.createRangePickerCalendar(left, 'leftCalendar')

        const newRightCalendar = document.createElement('div')
        newRightCalendar.innerHTML = this.createRangePickerCalendar(right, 'rightCalendar')
        

        this.subElements.selector.append(newLeftCalendar.firstElementChild)
        this.subElements.selector.append(newRightCalendar.firstElementChild)

        this.selectSubElements()

        this.highlightCells()

        this.leftCalendar = left
        this.rightCalendar = right
    }

    handleInputClick = () => {
        this.element.classList.toggle('rangepicker_open')
        this.renderSelector()
        this.removeHighLightCells()
        this.highlightCells()
    }

    renderSelector() {
        if (!this.isShown) {
            this.subElements.selector.innerHTML = `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.createRangePickerCalendar(this.leftCalendar, 'leftCalendar')}
            ${this.createRangePickerCalendar(this.rightCalendar, 'rightCalendar')}
            `
            this.isShown = true
            this.selectSubElements()
        }
    }

    highlightCells() {
        
        for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
            const selectedDate = cell.dataset.value
            const currentDate = new Date(selectedDate)
            
            if (selectedDate === this.from.toISOString()) {
                cell.classList.add('rangepicker__selected-from')
            } else if (selectedDate === this.to?.toISOString()) {
                cell.classList.add('rangepicker__selected-to')
            } else if (currentDate > this.from && currentDate < this?.to) {
                cell.classList.add('rangepicker__selected-between')
            }
            
        }
    }

    removeHighLightCells() {
        for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
            cell.classList.remove('rangepicker__selected-from')
            cell.classList.remove('rangepicker__selected-between')
            cell.classList.remove('rangepicker__selected-to')
        }
    }

    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
          this.subElements[element.dataset.element] = element
        })
    }

    dispatchEvent = () => {
        const event = new CustomEvent("date-select", 
            {
                bubbles: true, 
                detail: {
                    from: this.from,
                    to: this.to
                }
            }
        );
        this.element.dispatchEvent(event);
      }

    remove() {
        this.element.remove()
    }

    destroy() {
        this.remove()
    }
}
