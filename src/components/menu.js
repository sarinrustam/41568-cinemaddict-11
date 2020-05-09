import AbstractComponent from '@components/abstract-component.js';

const createMenuMarkup = (menu, isChecked) => {
  const {title, value, count} = menu;

  return (
    `<a
      href="#${value}"
      data-menu-type=${value}
      class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">
      ${title}
      <span class="main-navigation__item-count">
      ${count}
     </span>
    </a>`
  );
};

const createTemplate = (data) => {
  const menuesMarkup = data.map((it) => createMenuMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${menuesMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  setMenuTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === !`A`) {
        return;
      }

      const prevActiveElement = this.getElement().querySelector(`.main-navigation__item--active`);

      if (prevActiveElement) {
        prevActiveElement.classList.remove(`main-navigation__item--active`);
      }

      evt.target.classList.add(`main-navigation__item--active`);

      const menuType = evt.target.dataset.menuType;
      handler(menuType);
    });
  }
}
