import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/receipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';

// import paginationview from './views/paginationview.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1)Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //2) Loading recipe
    await model.loadRecipe(id);
    // console.log(recipe);
    //3)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) Getting search query
    const query = searchView.getQuery();
    if (!query) return;
    //2)Loading search query
    await model.loadSearchResult(query);
    //3)Rendering search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4)Render initial pagination button
    PaginationView.render(model.state.search);
    // paginationview._generateMarkup();
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //Rendering new search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //Render new pagination button
  PaginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update recipe servings (in state)
  console.log(newServings);
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmarks = function () {
  //1) Add / remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2)Update recipe view
  recipeView.update(model.state.recipe);
  //3)Render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();
    //Upload recipe
    await model.uploadRecipe(newRecipe);
    //Success message
    addRecipeView.renderMessage(addRecipeView._message);
    //Close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Render bookmark
    bookmarksView.render(model.state.bookmarks);
    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log(model.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
