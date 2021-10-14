export default class SortableTable {
  element;
  subElements = {};
  headerConfig;
  data;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...Array.isArray(data) ? data : data.data];

    this.render();
  }

  getTableTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        ${this.getHeader()}
        ${this.getBody()}
      </div>S
    `;
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.getHeaderCol(item)).join('')}
      </div>
    `;
  }

  getHeaderCol({ id, title, sortable = false}) {
    const sortArrowTemplate = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${sortable ? sortArrowTemplate : ''}
      </div>
    `;
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getBodyRows()}
      </div>
    `;
  }

  getBodyRows() {
    return this.data.map(item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">${this.getBodyRow(item)}</a>`;
    }).join('');
  }

  getBodyRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTableTemplate();
    this.element = wrapper.firstElementChild;
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

  update(field, order) {
    const headerColumns = this.subElements.header.querySelectorAll('[data-id]');
    headerColumns.forEach(item => {
      item.dataset.order = (item.dataset.id === field) ? order : '';
    });

    this.subElements.body.innerHTML = this.getBodyRows();
  }
   
  sort(field, order = 'asc') {
    const fieldConfig = this.headerConfig.find(item => item.id === field);
    const { sortable, sortType } = fieldConfig;
    const directions = {
      'asc': 1,
      'desc': -1
    };
    const multiplier = directions[order];

    if (sortable && sortType) {

      this.data.sort((a, b) => {
        switch (sortType) {
        case 'number':
          return multiplier * (a[field] - b[field]);
        case 'string':
          return multiplier * a[field].localeCompare(b[field], ['ru', 'en']);
        }
      });

      this.update(field, order);
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