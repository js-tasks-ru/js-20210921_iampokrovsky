/**
 * TODO:
 * - сделать проверку на пустые данные
 * - правильно расставить const и let
 * - выбор активного заголовка
 * - фильтрация
 */

export default class SortableTable {
  element; // Элемент всей таблицы
  subElements = {};
  headerConfig;
  data;


  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  // 1. Построить шапку таблицы


  get tableTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">${[this.headerTemplate, this.bodyTemplate].join('')}</div>`;
  }

  get headerTemplate() {
    let content = [];

    for (let headingData of this.headerConfig) {
      let {id, title, sortable} = headingData;
      content.push(`
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
      `);
    }

    return `<div data-element="header" class="sortable-table__header sortable-table__row">${content.join('')}</div>`;
  }

  get bodyTemplate() {
    let content = [];

    let props = this.headerConfig.map((item => {
      return item.id;
    }));

    for (let item of this.data) {
      let itemContent = [];

      for (let prop of props) {
        let template = this.headerConfig.filter(item => item.id === prop)[0].template;

        if (template) {
          itemContent.push(template(item[prop]));
        } else {
          itemContent.push(`<div class="sortable-table__cell">${item[prop]}</div>`);
        }
      }
  
      content.push(`<a href="/products/${item.id}" class="sortable-table__row">${itemContent.join('')}</a>`);
    }
  
    return `<div data-element="body" class="sortable-table__body">${content.join('')}</div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.tableTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sort(field, order = 'asc') {
    const multiplier = (order === 'asc') ? 1 : -1;

    let sortable = this.headerConfig.filter(item => item.id === field)[0].sortable;
    let sortType = this.headerConfig.filter(item => item.id === field)[0].sortType;

    if (sortable) {
      if (sortType === 'number') {
        this.data.sort((a, b) => {
          if (a[field] > b[field]) {return multiplier * 1;}
          if (a[field] == b[field]) {return multiplier * 0;}
          if (a[field] < b[field]) {return multiplier * -1;}
        });
      }

      if (sortType === 'string') {
        this.data.sort((a, b) => {
          return multiplier * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
        });
      }
      this.subElements.body.innerHTML = this.bodyTemplate;
      console.log(this.data);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    // NOTE: удаляем обработчики событий, если они есть
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
