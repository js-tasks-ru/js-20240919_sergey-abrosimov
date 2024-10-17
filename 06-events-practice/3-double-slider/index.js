export default class DoubleSlider {

    element
    dataElements = []

    constructor(params = {
        min: 100,
        max: 200,
        formatValue: value => '$' + value,
        selected: {
            from: 120,
            to: 150
        }}
    ) {
        this.min = params.min
        this.max = params.max
        this.formatValue = params.formatValue
        this.from = params.selected?.from
        this.to = params.selected?.to
        this.element = this.createElement()
        this.setSubElements()
        this.selectDataElements()
        if (this.from && this.to) {
            this.setSelectedRange(this.from, this.to)
        }
        this.createListeners()
    }

    setSubElements() {
        this.leftPoint = this.element.querySelector('.range-slider__thumb-left')
        this.righPoint = this.element.querySelector('.range-slider__thumb-right')
        this.progress = this.element.querySelector('.range-slider__progress')
        this.inner = this.element.querySelector('.range-slider__inner')
    }

    createListeners() {
        this.leftPoint.addEventListener('pointerdown', this.pointerdownHandler)
        this.righPoint.addEventListener('pointerdown', this.pointerdownHandler)
    }

    destroyListeners() {
        this.leftPoint.removeEventListener('pointerdown', this.pointerdownHandler)
        this.righPoint.removeEventListener('pointerdown', this.pointerdownHandler)
    }

    pointerdownHandler = (event) => {
        if (event.target === this.leftPoint) {
            this.leftPoint.classList.add('range-slider_dragging')
            this.currentPoint = 'left'
        }

        if (event.target === this.righPoint) {
            this.righPoint.classList.add('range-slider_dragging')
            this.currentPoint = 'right'
        }
        
        document.addEventListener('pointerup', this.pointerupHandler)
        document.addEventListener('pointermove', this.pointermoveHandler)
    }

    pointerupHandler = (event) => {
        this.element.dispatchEvent(new CustomEvent("range-select", {detail: { from: this.from, to: this.to }}))
        this.leftPoint.classList.remove('range-slider_dragging')
        this.righPoint.classList.remove('range-slider_dragging')
        document.removeEventListener('pointermove', this.pointermoveHandler)
        document.removeEventListener('pointerup', this.pointerupHandler)
    }

    pointermoveHandler = (event) => {
        const {left, right} = this.inner.getBoundingClientRect() // left , right
        const deltaX = this.getValue(left, right, event.clientX)
        const newPercent = (deltaX - left) / (right - left) * 100
        if (this.currentPoint === 'left') {
            this.from = this.min + (this.getValue(0, this.rightPercent, newPercent) * (this.max - this.min)) / 100
            this.setSelectedRange(this.from, this.to)
            this.dataElements.from.textContent = this.formatValue(Math.round(this.from))
        } else if (this.currentPoint === 'right'){
            this.to = this.min + (this.getValue(this.leftPercent, 100, newPercent) * (this.max - this.min)) / 100
            this.setSelectedRange(this.from, this.to)
            this.dataElements.to.textContent = this.formatValue(Math.round(this.to))
        }
    }

    createElement() {
        const newElement = document.createElement('div')
        newElement.innerHTML = this.createElementTemplate()
        return newElement.firstElementChild
    }

    createElementTemplate() {
        this.minValueCurrent = this.from ? this.formatValue(this.from) : this.formatValue(this.min)
        this.maxValueCurrent = this.to ? this.formatValue(this.to) : this.formatValue(this.max)
        return `
        <div class="range-slider">
            <span data-element="from">${this.minValueCurrent}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress"></span>
                <span class="range-slider__thumb-left"></span>
                <span class="range-slider__thumb-right"></span>
            </div>
            <span data-element="to">${this.maxValueCurrent}</span>
        </div>
        `
    }

    selectDataElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
            this.dataElements[element.dataset.element] = element
        })
    }

    getValue(min, max, value) {
        if (value < min) return min
        if (value > max) return max
        return value
    }

    renderLeftPoint(percent) {
        this.leftPoint.style.left = percent
        this.progress.style.left = percent
    }

    renderRightPoint(percent) {
        this.righPoint.style.left = percent
        this.progress.style.right = percent
    }

    setSelectedRange(from = this.min, to = this.max) {
        this.leftPercent = (from - this.min) / (this.max - this.min) * 100
        this.rightPercent = (to - this.min) / (this.max - this.min) * 100
        this.leftPoint.style.left = this.leftPercent  + '%'
        this.righPoint.style.left = this.rightPercent  + '%'
        this.progress.style.left = this.leftPercent  + '%'
        this.progress.style.right = (100 - this.rightPercent)  + '%'
    }

    destroy() {
        this.element.remove()
        this.destroyListeners()
    }

}
