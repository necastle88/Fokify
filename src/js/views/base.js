export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResultList: document.querySelector('.results__list'),
  searchResult: document.querySelector('.results'),
  searchResultPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likeMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

export const stringElements = {
  spinner: 'loader'
};

export const renderLoader = parent => {
  const spinner = `
    <div class="${stringElements.spinner}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', spinner);
};

export const clearSpinner = () => {
  const spinner = document.querySelector(`.${stringElements.spinner}`);
  if (spinner) spinner.parentElement.removeChild(spinner);
};