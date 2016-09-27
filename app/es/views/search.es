const $ = require("jquery");
const _ = require("lodash");
import {matchStations} from "../models/stations.es";

/** Minimum number of characters in a search string */
const MIN_SEARCH_LENGTH = 2;

/** Maximum number of results to show by default */
const MAX_RESULTS = 20;

/**
 * A view which listens to user inputs, and matches stations by name or
 * by location (expressed as a postcode)
 */
export class SearchView {

  constructor( selectedStations ) {
    this._selectedStations = selectedStations;
    this.initEvents();
  }

  /**
   * Bind UI affordances to actions in this view
   */
  initEvents() {
    const onSearchBound = _.bind( this.onSearch, this );
    const onChangeSelected = _.bind( this.onChangeSelected, this );

    this.ui().searchField.on( "keyup", onSearchBound );
    this.ui().searchActionButton.on( "click", e => {
      e.preventDefault();
      onSearchBound();
    } );
    this.ui().searchResults.on( "change", ".o-search-results--result input", onChangeSelected );
    this.ui().searchResults.on( "click", ".js-action-show-all", e => {
      e.preventDefault();
      onSearchBound( e, true );
    } );

    $("body").on( "rainfall-demo.selected", _.bind( this.onStationSelected, this ) );
  }

  /**
   * User has typed into search box
   */
  onSearch( e, all ) {
    const searchStr = this.ui().searchField.val();
    this.searchBy( searchStr, all );
  }

  /**
   * User has changed the selected status of a station
   */
  onChangeSelected( e ) {
    const elem = $(e.currentTarget);
    const stationId = String( elem.parents( "[data-notation]" ).data( "notation" ) );
    const selected = elem.is( ":checked" );

    this._selectedStations.setSelected( stationId, selected );
    this.triggerSelected( stationId, selected );
  }

  /**
   * Search for a term against station names first, then
   * as a postcode.
   * @param {String} The search string to match against
   * @param {Boolean} If true, show all results
   */
  searchBy( searchStr, all ) {
    if (searchStr !== "" && searchStr.length >= MIN_SEARCH_LENGTH) {
      matchStations( {label: searchStr} ).then( results => {
        this.clearCurrentSearchResults();
        this.summariseSearchResults( results );
        this.showCurrentSearchResults( results, all );
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
  showCurrentSearchResults( results, all ) {
    const list = this.ui().searchResultsList;
    const formatResult = _.bind( this.presentResult, this );
    const limit = all ? results.length : MAX_RESULTS;
    const sortedResults = _.sortBy( results, result => {
      return result.label();
    } );
    const displayedResults = _.slice( sortedResults, 0, limit );
    const remainder = results.length - displayedResults.length;

    _.each( displayedResults, result => {
      list.append( formatResult( result ));
    } );

    if (remainder > 0) {
      list.append( `<li class='o-search-results--expand'>${remainder} more ... <a href='#' class='js-action-show-all'>show all</a></li>` );
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
    const selected = this.presentSelectedStatus( result );
    return `<li class='o-search-results--result' data-notation='${result.notation()}'>` +
           `<label>${selected} ${result.label()}</label></li>\n`;
  }

  /** @return Markup to show if an item is selected */
  presentSelectedStatus( result ) {
    const stationId = result.notation();
    const isChecked = this._selectedStations.isSelected( stationId ) ? "checked" : "";

    return `<input class='js-action-selected' ${isChecked} type='checkbox' name='${stationId}'></input>`;
  }

  /**
   * Lazily initialise and return an object containing the UI elements
   * for this view
   * @return An object with a member for each UI element
   */
  ui() {
    if (!this._ui) {
      this._ui = {
        searchField: $("#searchField"),
        searchResults: $(".o-search-results"),
        searchResultsHeading: $(".o-search-results--heading"),
        searchResultsList: $(".o-search-results--list"),
        searchResultsSummary: $(".o-search-results--summary"),
        searchActionButton: $(".js-action-search")
      };
    }

    return this._ui;
  }

  // events

  /** Notify other components that the selection state has changed */
  triggerSelected( stationId, selected ) {
    $("body").trigger( "rainfall-demo.selected", [stationId, selected] );
  }

  /** Ensure that checkbox state stays in sync with changes to selected state */
  onStationSelected( event, stationId, selected ) {
    this._selectedStations.setSelected( stationId, selected );
    $(`[data-notation=${stationId}] input`).prop( "checked", selected );
  }
}
