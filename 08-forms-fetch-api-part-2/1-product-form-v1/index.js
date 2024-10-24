import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const CATEGORY_PATH = 'api/rest/categories'
const PRODUCT_PATH = 'api/rest/products'

export default class ProductForm {

  element
  subElements = {}

  constructor (productId) {
    this.productId = productId
    this.element = this.createElement()
    this.selectSubElements()
  }

  async render () {
    await this.fetchCategories()
    if (this.productId) {
      const data = await this.fetchProduct()
      if (data) {
        this.fillFormFields(data)
      }
    }
    this.subElements.productForm.addEventListener('submit', this.handleSubmitButton)

    return this.element
  }

  handleSubmitButton = async (event) => {
    event.preventDefault()
    this.save()
  }

  async save() {
    const url = new URL(PRODUCT_PATH, BACKEND_URL)
    const formData = new FormData(this.subElements.productForm)
    const method = this.productId ? 'PATCH' : 'PUT'

    try {
      await fetchJson(url.toString(), {
        body: formData,
        method: method
      })
    } catch (e) {
      throw e
    }
    
    if (this.productId) {
      this.element.dispatchEvent(new CustomEvent('product-updated'))
    } else {
      this.element.dispatchEvent(new CustomEvent('product-saved'))
    }
  }

  fillFormFields(data) {
    const fieldNames = ['title', 'description', 'quantity', 'subcategory', 'status', 'price', 'discount']
    for (const field of fieldNames) {
      this.subElements.productForm.querySelector(`#${field}`).value = data[field]
    }

    const container = this.subElements.imageListContainer
    container.append(this.createImagesElement(data.images))
  }

  createImagesElement(images) {
    const ul = document.createElement('ul')
    ul.classList.add('sortable-list')

    for (const img of images) {
      const div = document.createElement('div')
      div.innerHTML = this.createImageTemplate(escapeHtml(img.url), escapeHtml(img.source))
      ul.append(div.firstElementChild)
    }
    return ul
  }

  createImageTemplate(url, source) {
    return `
    <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="${source}" src="${url}">
          <span>${source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `
  }

  async fetchCategories() {
    const url = new URL(CATEGORY_PATH, BACKEND_URL)
    url.searchParams.set('_sort', 'weight')
    url.searchParams.set('_refs', 'subcategory')
    let categoryData
    try {
      categoryData = await fetchJson(url.toString())
    } catch (e) {
      categoryData = []
    } finally {
      this.subElements.subcategory.innerHTML = this.createOptionsTemplate(categoryData)
    }
  }

  async fetchProduct() {
    const url = new URL(PRODUCT_PATH, BACKEND_URL)
    url.searchParams.set('id', this.productId)
    let productData
    try {
      productData = await fetchJson(url.toString())
    } catch (e) {
      productData = []
    }

    return productData[0]
  }

  createElement() {
    const element = document.createElement('div')
    element.innerHTML = `
    <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" id="title" value="" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" id="description" value="" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
            </div>
            <button data-element="uploadImage" type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select data-element="subcategory" class="form-control" name="subcategory" id="subcategory" value="">
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" id="price" value="" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" id="discount" value="" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" id="quantity" value="" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status" id="status" value="">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `
    return element.firstElementChild
  }

  createOptionsTemplate(categories) {
    let result = []
    for (let cat of categories) {
      for (let sub of cat.subcategories) {
        const option = `<option value="${escapeHtml(sub.id)}">${escapeHtml(cat.title)} > ${escapeHtml(sub.title)}</option>`
        result.push(option)
      }
    }
    return result.join('')
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  removeListeners() {
    this.subElements.productForm.removeEventListener('submit', this.handleSubmitButton)
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.remove()
    this.removeListeners()
  }
}
