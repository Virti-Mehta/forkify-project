import overallView from './overallView';
import icons from 'url:../../img/icons.svg';

class PaginationView extends overallView {
  // currPage = this._data.page;

  _parentElement = document.querySelector('.pagination');
  _generateMarkupButtonPrev(page) {
    return `
      <button data-goto = "${
        page - 1
      }"class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>`;
  }
  _generateMarkupButtonForw(page) {
    return `
    <button data-goto = "${page + 1}"class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // // Page1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButtonForw(currPage);
    }
    //Last page
    else if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(currPage);
    }
    //Other page
    else if (currPage < numPages) {
      return (
        this._generateMarkupButtonPrev(currPage) +
        this._generateMarkupButtonForw(currPage)
      );
    }
    //Page1 and there are no other pages
    else return '';
  }
}
export default new PaginationView();
