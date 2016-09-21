import {SearchView} from "../views/search.es";

/** Simple controller for displaying search/filter results */
export class SearchController {
  constructor() {
    this.views = {
      searchView: new SearchView()
    };
  }
}
