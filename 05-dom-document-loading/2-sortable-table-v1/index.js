export default class SortableTable {

  element
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data
    this.element = this.createElement()
    this.selectSubElements()
  }

  createElement() {
    const element = document.createElement('div')
    element.innerHTML = `
    <div data-element="productsContainer" class="products-list__container"></div>
    `
    element.firstElementChild.append(this.createTable())
    return element.firstElementChild
  }

  createTable() {
    const elementTable = document.createElement('div')
    elementTable.innerHTML = `
      <div class="sortable-table"></div>
    `
    elementTable.firstElementChild.append(this.createHeader())
    elementTable.firstElementChild.append(this.createBody())
    
    return elementTable.firstElementChild
  }

  createHeader() {
    let htmlCode = ``
    const elementHeader = document.createElement('div')
    elementHeader.innerHTML = `
    <div data-element="header" class="sortable-table__header sortable-table__row"></div>
    `
    
    this.headerConfig.forEach(el => {
      htmlCode += `
        <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}">
          <span>${el.title}</span>
        </div>
      `
    })
    elementHeader.firstElementChild.innerHTML = htmlCode
    return elementHeader.firstElementChild
  }

  createBody(data = this.data) {
    let htmlCode = ``
    const elementBody = document.createElement('div')
    elementBody.innerHTML = `
    <div data-element="body" class="sortable-table__body"></div>
    `
    htmlCode = this.createBodyTemplate(data)
    elementBody.firstElementChild.innerHTML = htmlCode
    return elementBody.firstElementChild
  }

  createBodyTemplate(data) {
    let htmlCode = ``
    data.forEach(el => {
      htmlCode += `<a href="/products/${el.id}" class="sortable-table__row">`
      this.headerConfig.forEach(header => {
        if (header.template) {
          htmlCode += header.template(el[header.id])
        } else {
          htmlCode += `<div class="sortable-table__cell">${el[header.id]}</div>`
        }
      })
      htmlCode += `</a>`
    })
    return htmlCode
  }

  sort(fieldValue, orderValue) {
    const order = orderValue == 'asc' ? 1 : -1;
  
    const sortedData = [...this.data].sort((a, b) => { 
      if (typeof a[fieldValue] === 'number') {
        return order * (a[fieldValue] - b[fieldValue]);
      } else {
        return order * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'])
      }
    });
  
    this.data = sortedData;
  
    const currentBody = this.element.querySelector('[data-element="body"]')
    currentBody.remove()
  
    const newBody = this.createBody(sortedData)

    const table = this.element.querySelector('[class="sortable-table"]')
    table.append(newBody)

    this.selectSubElements()
  }

  destroy() {
    this.element.remove()
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }
}

