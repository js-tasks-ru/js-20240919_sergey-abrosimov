import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    
    element
    subElements = {}

    constructor() {
        this.element = this.createElement()
        this.createComponents()
        this.selectSubElements()
        this.createListeners()
    }

    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
          this.subElements[element.dataset.element] = element
        })
    }

    createElement() {
        const element = document.createElement('div')
        element.innerHTML = `
        <div class="dashboard">
            <div class="content__top-panel">
                <h2 class="page-title">Dashboard</h2>
                <div data-element="rangePicker"></div>
            </div>
            <div data-element="chartsRoot" class="dashboard__charts">
                <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                <div data-element="salesChart" class="dashboard__chart_sales"></div>
                <div data-element="customersChart" class="dashboard__chart_customers"></div>
            </div>
            <h3 class="block-title">Best sellers</h3>
            <div data-element="sortableTable"></div>
        </div>
        `
        return element.firstElementChild
    }

    createComponents() {
        const from = new Date()
        from.setMonth(from.getMonth() - 1)
        const to = new Date()

        this.components = {
            rangePicker: new RangePicker({from, to}),
            ordersChart: new ColumnChart({
                url: 'api/dashboard/orders',
                range: {
                    from,
                    to
                },
                label: 'orders',
                link: '#'
            }),
            salesChart: new ColumnChart({
                url: 'api/dashboard/sales',
                range: {
                    from,
                    to
                },
                label: 'sales',
                formatHeading: data => `$${data}`
            }),
            customersChart: new ColumnChart({
                url: 'api/dashboard/customers',
                range: {
                    from,
                    to
                },
                label: 'customers'
            }),
            sortableTable:  new SortableTable(
                header, 
                {
                    url: "api/dashboard/bestsellers"
                }
            )
        }   
    }

    async render() {
        for (const [name, component] of Object.entries(this.components)) {
            this.subElements[name].append(component.element)
        }
        return this.element
    }

    async updateComponentData(from, to) {
        try {
            const data = await this.fetchBestSellerData(from, to)
            this.components.sortableTable.renderRows(data)
            this.components.ordersChart.update(from, to)
            this.components.salesChart.update(from, to)
            this.components.customersChart.update(from, to)
        } catch (ex) {
            throw new Error(ex)
        }
    }

    async fetchBestSellerData(from, to) {
        const url = this.components.sortableTable.url
        url.searchParams.set('_start', 1)
        url.searchParams.set('_end', 20)
        url.searchParams.set('from', from)
        url.searchParams.set('to', to)
        const response = await fetchJson(url)
        return response
    }

    handleDateSelectEvent = async (event) => {
        const { 
            from, 
            to
        } = event.detail
        await this.updateComponentData(from, to)
    }

    createListeners() {
        document.addEventListener('date-select', this.handleDateSelectEvent)
    }
    
    removeListeners() {
        document.removeEventListener('date-select', this.handleDateSelectEvent)
    }
    
    remove() {
        this.element.remove()
        this.subElements = {}
    }

    destroy() {
        this.remove()
        this.removeListeners()
    }
}
