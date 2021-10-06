class DefaultComponent {
  constructor() {
    this.render();
    this.initEventListeners();
  }

  getTemplate() {
    return `
      <div class="wrapper">
        <h1>Hello, Component!</h1>
      </div>
    `
  }

  render() {
    const element = document.createElement('div'); // (*)

    element.innerHTML = this.getTemplate();

    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
