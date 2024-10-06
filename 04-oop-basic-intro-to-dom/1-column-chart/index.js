export default class ColumnChart {
    chartHeight = 50

    constructor(obj) {
        this.data = obj?.data
        this.label = obj?.label
        this.value = obj?.hasOwnProperty('formatHeading') ? obj.formatHeading(obj.value) : obj?.value
        this.link = obj?.link 
        this.element = this.setElement()
    }

    setLink() {
        if (this.link) {
            return `<a href="${this.link}" class="column-chart__link">View all</a>`
        }
        return ''
    }

    setElement() {
        const currentElement = document.createElement('div')
        currentElement.innerHTML = `
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                ${this.label}
                ${this.setLink()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.setData()}
                </div>
            </div>
        </div>`
        if (this.data === undefined || this.data.length === 0) {
            const firstChild = currentElement.firstElementChild
            firstChild.classList.add('column-chart_loading')
        }
        return currentElement.firstElementChild
    }

    setData() {
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
        this.element.innerHTML = this.setElement()
    }

    remove() {
        this.element.remove()
    }
}
