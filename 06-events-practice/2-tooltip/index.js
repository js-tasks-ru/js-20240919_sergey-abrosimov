class Tooltip {

  static #onlyInstance = null;
  element

  constructor() {
    if(!Tooltip.#onlyInstance){
      Tooltip.#onlyInstance = this;
    } else {
      return Tooltip.#onlyInstance;
    }
  }

  createListeners() {
    document.addEventListener('pointerover', this.pointeroverHandler)
    document.addEventListener('pointerout', this.pointeroutHandler)
    document.addEventListener('mousemove', this.mousemoveHandler)
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.pointeroverHandler)
    document.removeEventListener('pointerout', this.pointeroutHandler)
    document.removeEventListener('mousemove', this.mousemoveHandler)
  }

  mousemoveHandler = (event) => {
    if (!event.target.dataset.tooltip) return
    if (this.element) {
      this.element.style.top = (event.clientY + 10) + 'px'
      this.element.style.left = (event.clientX + 10) + 'px'
    }
  }

  pointeroverHandler = (event) => {
    const tooltip = event.target.dataset.tooltip
    if (!tooltip) return

    this.render(tooltip)
  }

  pointeroutHandler = (event) => {
    if (this.element) {
      this.element.remove()
      this.element = null
    }
  }

  render(tooltip) {
    this.element = document.createElement('div')
    this.element.className = 'tooltip'
    this.element.innerHTML = tooltip
    document.body.append(this.element)
  }

  initialize () {
    this.createListeners()
  }

  destroy() {
    this.destroyListeners()
  }
}

export default Tooltip;
