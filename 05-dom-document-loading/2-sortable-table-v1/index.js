/**
 * TODO:
 * - сделать проверку на пустые данные
 * - правильно расставить const и let
 * - выбор активного заголовка
 * - фильтрация
 * - скрывать контент при отсутствующих результатах
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


  // get tableTemplate() {
  //   return `<div data-element="productsContainer" class="products-list__container">${[this.headerContentTemplate, this.bodyTemplate].join('')}</div>`;
  // }

  get tableTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div data-element="header" class="sortable-table__header sortable-table__row">${this.headerContentTemplate}</div>
      <div data-element="body" class="sortable-table__body">${this.bodyContentTemplate}</div>
    </div>
    `;
  }

  get headerContentTemplate() {
    const content = [];
    const sortArrowTemplate = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    for (let headingData of this.headerConfig) {
      let { id, title, sortable, order } = headingData;
      let dataOrder = order ? `data-order="${order}"` : '';
      content.push(`
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${dataOrder}>
        <span>${title}</span>
        ${sortable ? sortArrowTemplate : ''}
      </div>
      `);
    }

    return content.join('');
  }

  get bodyContentTemplate() {
    console.log(this.data);


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
  
    return content.join('');
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

  update(data = this.data) {
    this.data = data;

    this.subElements.header.innerHTML = this.headerContentTemplate;
    this.subElements.body.innerHTML = this.bodyContentTemplate;
  }

  sort(field, order = 'asc') {
    const multiplier = {
      'asc': 1,
      'desc': -1
    };

    const fieldConfig = this.headerConfig.find(item => item.id === field);
    const isSortable = fieldConfig?.sortable;
    const sortType = fieldConfig?.sortType;
    console.log(fieldConfig);
    console.log(this.data.sort);

    if (isSortable) {

      fieldConfig.order = order;
      
      if (sortType === 'number') {
        this.data.sort((a, b) => {
          if (a[field] > b[field]) {return multiplier[order] * 1;}
          if (a[field] == b[field]) {return multiplier[order] * 0;}
          if (a[field] < b[field]) {return multiplier[order] * -1;}
        });
      }

      if (sortType === 'string') {
        this.data.sort((a, b) => {
          return multiplier[order] * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
        });
      }

      this.update();
    }
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}