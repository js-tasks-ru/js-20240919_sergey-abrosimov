export default class ColumnChart {

    chartHeight = 50
    subElements = {}

    constructor(props = {}) {
        const {
            data = [],
            label = '',
            value = 0,
            link = '',
            formatHeading = (value) => value,
        } = props
      
        this.data = data
        this.label = label
        this.value = value
        this.link = link
        this.formatHeading = formatHeading
        
        this.element = this.createElement()
        this.selectSubElements()
    }
    
    selectSubElements() {
        const dataElements = this.element.querySelectorAll('[data-element]')
        dataElements.forEach(item => {
          this.subElements[item.dataset.element] = item
        })
    }

    setLink() {
        if (this.link) {
            return `<a href="${this.link}" class="column-chart__link">View all</a>`
        }
        return ''
    }

    createElement() {
        const currentElement = document.createElement('div')
        currentElement.innerHTML = this.createElementTemplate()

        const firstChild = currentElement.firstElementChild

        if (this.data === undefined || this.data.length === 0) {
            firstChild.classList.add('column-chart_loading')
        }
        return firstChild
    }

    createElementTemplate() {
        return `
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                ${this.label}
                ${this.setLink()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.createDataTemplate()}
                </div>
            </div>
        </div>`
    }

    createDataTemplate() {
        let resultData = ''
        if (this.data === undefined) return
        const max = Math.max(...this.data)
        this.data.forEach(el => {
            const val = (el / max * 100).toFixed(0)
            const elVal = Math.floor(this.chartHeight * el / max)
            resultData += `<div style="--value: ${elVal}" data-tooltip="${val}%"></div>`
        })
        return resultData
    }

    destroy() {
        this.remove()
    }

    update(data) {
        this.data = data
        
        this.value = data.reduce((a, b)=>a + b, 0);
    
        this.subElements.header.innerHTML = this.formatHeading(this.value);
        this.subElements.body.innerHTML = this.createDataTemplate()
    }

    remove() {
        this.element.remove()
    }
}
