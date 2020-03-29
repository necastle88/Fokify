import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultPages.innerHTML = '';
};

export const selectedRecipe = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

export const limitTitle = (title, limit = 17) =>{
  const newTitle = [];
  if(title.length > limit) {
    title.split(' ').reduce((acc, cur) =>{
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')}...`;
  }
    return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
          <div class="results__data">
            <h4 class="results__name">${limitTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
           </div>
      </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type prev or next
const createBtn = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`; 

const renderBtns = (page, numResuts, resultsPerPage) =>{
  const pages = Math.ceil(numResuts / resultsPerPage);
  let btn;
  if (page === 1 && pages > 1) {
    // render btn to next page
    btn = createBtn(page, 'next');
  } else if (page < pages) {
    // render two butons
    btn = `
      ${createBtn(page, 'prev')}
      ${createBtn(page, 'next')}
    `;
  } else if (page === pages) {
    // render on prev btn
    btn = createBtn(page, 'prev');
  }
  elements.searchResultPages.insertAdjacentHTML('afterbegin', btn);
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  // render pagination buttons
  renderBtns(page, recipes.length, resultPerPage);
};