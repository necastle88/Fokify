import Search from './models/Search';
import { elements, renderLoader, clearSpinner } from './views/base';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/listView';
import * as LikesView from './views/LikesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';

// global state
// -Search obj
// -Current recipe obj
// -Bookmarked recipes
const state = {};

// Search controller
const cntrlSearch = async () => {
  // get the query from the view
    const query = SearchView.getInput(); 
    
    if(query) {
      // new search obj & add it to the state
      state.search = new Search(query);
      // prepare ui results
      SearchView.clearInput();
      SearchView.clearResults();
      renderLoader(elements.searchResult);

      try {
        //search for recipes
        await state.search.getResults();
       
        // render results to UI
        clearSpinner();
        SearchView.renderResults(state.search.result);
      } catch(error) {
        alert('Error while processing you recipe');
        clearSpinner();
      }
    }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  cntrlSearch();
});



elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearResults();
    SearchView.renderResults(state.search.result, goToPage);
  }
  
});

// Recipe controller
const cntrlRecipe = async () => {
  // Get has id from url
  const id = window.location.hash.replace('#', '');
  
  if(id) {
    // prepare ui for update
    RecipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected item
    if(state.search) SearchView.selectedRecipe(id);
    // create new recipe obj
    state.recipe = new Recipe(id);
    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calc serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe
      clearSpinner();
      RecipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );
    } catch(e) {
      alert(e);
    } 
  }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, cntrlRecipe));

// List Controller
const cntrlList = () => {
  // create a new list if there is none
  if(!state.list) state.list = new List();
  // add each ingredient to the list an UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    ListView.renderItem(item);
  });
}

// Handle delte and Update list item events 
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // delete button event
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state and interface
    state.list.deleteItem(id);

    ListView.deleteItem(id)
    // handel count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

// Like Controller

const cntlrLike = () => {
  if(!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;
  
  // user has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
  // add like to the state
    const newLike = state.likes.addfavorite(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    console.log(newLike);
    // toggle like button
    LikesView.toggleLikeBtn(true);
    
    // add like to UI list
    LikesView.renderLike(newLike);
    // user has liked current recipe
  } else {
    // remove like to the state
    state.likes.deleteLike(currentID);
    // toggle like button
    LikesView.toggleLikeBtn(false);
    // remove like to UI list
    LikesView.deleteLike(currentID);
  }
  LikesView.toggleLikeMenu(state.likes.getNumLikes());
} 

// restore liked recipes on load
window.addEventListener('load', () => {
  state.likes = new Likes();
  // restore likes
  state.likes.readStorage();
  // toggle like menu btn
  LikesView.toggleLikeMenu(state.likes.getNumLikes());
  // render the existing likes
  state.likes.likes.forEach(like => LikesView.renderLike(like));
});

// handle recipe button click
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease button clicked
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      RecipeView.updateServingsIngredients(state.recipe);
    }
  } else  if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button clicked
    state.recipe.updateServings('inc');
    RecipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, recipe__btn--add *')) {
    //add ingredients to shopping list
    cntrlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // like controller
    cntlrLike();
  }
});
