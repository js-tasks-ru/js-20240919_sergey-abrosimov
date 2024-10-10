export default class NotificationMessage {

    element
    static lastShownElement

    constructor(msg = '', options = {}){
        this.msg = msg
        const {
            duration = 2000,
            type = 'success'
        } = options
        this.duration = duration
        this.type = type
        this.element = this.createMessage()
    }

    createMessage() {
        const msgElement = document.createElement('div')
        msgElement.innerHTML = `
            <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                    ${this.msg}
                    </div>
                </div>
            </div>
        `
        return msgElement.firstElementChild
    }

    show(targetElement = document.body) {
        targetElement.append(this.element)
        
        if (NotificationMessage.lastShownElement) {
            NotificationMessage.lastShownElement.destroy()
        }

        NotificationMessage.lastShownElement = this

        let timer = setTimeout(() => this.destroy(), this.duration)
    }

    destroy() {
        clearTimeout(this.timer)
        this.remove()
    }

    remove() {
        this.element.remove()
    }

}
