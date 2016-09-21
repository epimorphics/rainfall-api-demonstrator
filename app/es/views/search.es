const $ = require("jquery");
const _ = require("lodash");
import {searchStationNames} from "../models/stations.es";

/** Minimum number of characters in a search string */
const MIN_SEARCH_LENGTH = 2;

/** Maximum number of results to show by default */
const MAX_RESULTS = 20;

/**
 * A view which listens to user inputs, and matches stations by name or
 * by location (expressed as a postcode)
 */
export class SearchView {

  constructor() {
    this.initEvents();
  }

  /**
   * Bind UI affordances to actions in this view
   */
  initEvents() {
    this.ui().search.on( "keyup", _.bind( this.onKeyUp, this ) );
  }

  /**
   * User has typed into search box
   */
  onKeyUp( event ) {
    const searchStr = $(event.currentTarget).val();
    this.clearCurrentSearchResults();
    this.searchBy( searchStr );
  }

  /**
   * Search for a term against station names first, then
   * as a postcode.
   */
  searchBy( searchStr ) {
    if (searchStr !== "" && searchStr.length >= MIN_SEARCH_LENGTH) {
      searchStationNames( searchStr ).then( results => {
        this.summariseSearchResults( results );
        this.showCurrentSearchResults( results );
      });
    }
  }

  /**
   * Remove all of the current search results
   */
  clearCurrentSearchResults() {
    this.ui().searchResults.addClass("hidden");
    this.ui().searchResultsList.empty();
  }

  /**
   * Display a list of current search results
   */
  showCurrentSearchResults( results ) {
    const list = this.ui().searchResultsList;
    const formatResult = this.presentResult;
    const displayedResults = _.slice( results.sort(), 0, MAX_RESULTS );
    const remainder = results.length - displayedResults.length;

    _.each( displayedResults, result => {
      list.append( formatResult( result ));
    } );

    if (remainder > 0) {
      list.append( `<li class='o-search-results--expand'>${remainder} more ... <a href='#' class=''>show all</a></li>` );
    }

    this.ui().searchResults.removeClass("hidden");
  }

  /**
   * Summarise the number of results found
   */
  summariseSearchResults( results ) {
    const summary = this.ui().searchResultsSummary;

    switch( results.length ) {
    case 0:
      summary.html("No matches.");
      break;
    case 1:
      summary.html("Found one match.");
      break;
    default:
      summary.html(`Found ${results.length} matches`);
    }
  }

  /** @return A formatted search result */
  presentResult( result ) {
    return `<li class='o-search-results--result'>${result}</li>\n`;
  }

  /**
   * Lazily initialise and return an object containing the UI elements
   * for this view
   * @return An object with a member for each UI element
   */
  ui() {
    if (!this._ui) {
      this._ui = {
        search: $("#searchField"),
        searchResults: $(".o-search-results"),
        searchResultsHeading: $(".o-search-results--heading"),
        searchResultsList: $(".o-search-results--list"),
        searchResultsSummary: $(".o-search-results--summary")
      };
    }

    return this._ui;
  }
}
