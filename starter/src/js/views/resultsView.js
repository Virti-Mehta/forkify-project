import overallView from './overallView.js';
import previewView from './previewView.js';

class resultsView extends overallView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results found for your query. Please try again.';
  _message = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
