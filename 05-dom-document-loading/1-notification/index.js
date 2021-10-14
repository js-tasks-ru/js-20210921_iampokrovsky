export default class NotificationMessage {
  static activeNotification;
  static types = ['success', 'error'];
  type;
  message;
  duration;
  element;
  timer;

  constructor(message = '', {
    duration = 2000,
    type = 'success'
  } = {}) {
    this.message = message;
    this.duration = duration;

    if (NotificationMessage.types.includes(type)) {
      this.type = type;
    }

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
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

  show(parent = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    parent.append(this.element);

    this.timer = setTimeout(() => this.remove(), this.duration);

    NotificationMessage.activeNotification = this;
  }

  remove() {
    clearTimeout(this.timer);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }
}
