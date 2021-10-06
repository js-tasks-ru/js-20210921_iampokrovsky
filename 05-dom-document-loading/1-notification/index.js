export default class NotificationMessage {
  static currentInstance;
  static types = ['success', 'error'];
  type;
  message;
  duration;
  element;
  timer;

  constructor(
    message = '', {
      duration = 2000,
      type = 'success'
    } = {}) {
    this.message = message;
    this.duration = duration;

    if (NotificationMessage.types.includes(type)) {
      this.type = type;
    }

    if (NotificationMessage.currentInstance) {
      NotificationMessage.currentInstance.destroy();
    }

    NotificationMessage.currentInstance = this;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(targetElement = document.body) {
    targetElement.append(this.element);
    this.initCountdown();
  }

  initCountdown() {
    this.timer = setTimeout(() => this.destroy(), this.duration);
  }

  remove() {
    clearTimeout(this.timer);
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.currentInstance = null;
  }
}
