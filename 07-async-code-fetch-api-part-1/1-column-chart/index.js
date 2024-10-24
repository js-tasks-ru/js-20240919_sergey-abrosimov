import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1{

    constructor(obj= {}) {
        super(obj) 
        this.url = obj.url
    }

    async getData(from, to) {
        const url = new URL(this.url, BACKEND_URL)
        url.searchParams.set('from', from)
        url.searchParams.set('to', to)

        return await fetchJson(url)
    }

    async update(from, to) {
        const data = await this.getData(from, to)
        super.update(Object.values(data))
        if (Object.values(data).length > 0) {
            this.element.className = 'column-chart'
        } else {
            this.element,className = 'column-chart_loading'
        }
        return data
    }

}
