import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
export default class SortableTable extends SortableTableV1{
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data)
    const { 
      id = headersConfig.find(item => item.sortable).id, 
      order = 'asc'
    } = sorted
    this.id = id;
    this.order = order
    this.arrowElement = this.createArrowElement()
    this.isSortLocally = true
    
    this.createListeners()

    if (id) {
      this.defaultSorting(id, order)
    }
  }

  defaultSorting(id, order) {
    const tableCell = this.subElements.header.querySelector(`[data-id=${id}]`)
    this.order = order
    this.sort(id, order)
    tableCell.append(this.arrowElement)
    tableCell.dataset.order = this.order
  }

  createArrowElement() {
    const element = document.createElement('div')
    element.innerHTML = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
    `
    return element.firstElementChild
  }

  headerHandler = (event) => {
    const currentElement = event.target.closest(".sortable-table__cell")
    if (!currentElement || currentElement.dataset.sortable === 'false') {
      return
    }
    currentElement.append(this.arrowElement)

    if (this.selectedElement === currentElement) {
      this.order = this.order == 'asc' ? 'desc' : 'asc'
    } else {
      this.order = 'desc'
    }

    const currentId = currentElement.dataset.id
    
    currentElement.dataset.order = this.order
    this.sort(currentId, this.order)

    this.selectedElement = currentElement
  }

  createListeners() {
    this.subElements.header.addEventListener("pointerdown", this.headerHandler)
  }

  destroyListeners() {
    this.subElements.header.removeEventListener("pointerdown", this.headerHandler)
  }

  sort(fieldValue, orderValue) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue)
    } else {
      this.sortOnServer(fieldValue, orderValue)
    }
  }

  sortOnClient(fieldValue, orderValue) {
    super.sort(fieldValue, orderValue)
  }

  destroy() {
    super.destroy()
    this.destroyListeners()
  }
}
