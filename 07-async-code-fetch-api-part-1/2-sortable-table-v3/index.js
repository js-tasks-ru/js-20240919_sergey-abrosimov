import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js'

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {

  chunckSize = 30

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, { data, sorted, isSortLocally})
    this.url = new URL(url, BACKEND_URL)
    this.start = 0
    this.end = this.chunckSize
    this.isSortLocally = isSortLocally
    this.render()
    this.createListenerScroll()
  }

  async render() {
    let data
    data = await this.fetchData(this.id, this.order, 0, this.end)
    this.data = data
    this.updateBodyElement()
  }

  async fetchData(id, order, start, end) {
    this.url.searchParams.set('_embed', 'subcategory.category')
    this.url.searchParams.set('_sort', id)
    this.url.searchParams.set('_order', order)
    this.url.searchParams.set('_start', start)
    this.url.searchParams.set('_end', end)
    const response = await fetchJson(this.url)
    return response
  }

  addLoading() {
    this.element.classList.add("sortable-table_loading")
  }

  addLoadingElement() {
    const loadingElement = document.createElement('div')
    loadingElement.innerHTML = `
    <div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `
    this.element.firstElementChild.append(loadingElement.firstElementChild)
  }

  removeLoading() {
    this.element.classList.remove("sortable-table_loading")
  }

  createListenerScroll() {
    window.addEventListener('scroll', this.handleScroll)
  }

  removeListenerScroll() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = async () => {
    if (this.isLoading) { 
      return 
    }
    const windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom
    if (windowRelativeBottom > document.documentElement.clientHeight + 100) {
        return
    }
    this.isLoading = true
    this.start = this.end
    this.end += this.chunckSize

    let data
    data = await this.fetchData(this.id, this.order, this.start, this.end)
    if (data.length > 0) {
      this.data = data
      this.updateBodyElement()
      this.isLoading = false
    } else {
      this.addLoadingElement()
      this.isLoading = true
    }
  }

  sortOnClient (id, order) {
    super.sortOnClient(id, order)
  }

  sortOnServer (id, order) {
    this.id = id
    this.order = order
    this.data = []
    this.addLoading()
    this.fetchData(id, order, 0, this.end).then(
      (data) => {
        this.data = data
        this.updateBodyElement()
        this.removeLoading()
      }
    )

  }

  updateBodyElement(data = this.data) {
    const bodyElement = this.element.querySelector('.sortable-table__body')
    bodyElement.innerHTML = this.createBodyTemplate(data)
  }

  destroy() {
    super.destroy()
    this.removeListenerScroll()
  }
}
