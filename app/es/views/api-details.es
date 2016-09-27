const $ = require( "jquery" );
window.jQuery = $;
require( "bootstrap-sass" );
import _ from "lodash";

const CONTENT_TYPES = ["html", "json", "csv"];

// const API_ROOT = "http://environment.data.gov.uk";
const API_ROOT = "http://ea-floods-testing.epimorphics.net";

/**
 * View class that ensures that the modal dialogue that show API details
 * for a given station is populated with the right information.
 */
export class ApiDetailsView {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    $("body").on( "click", ".js-action-show-api-details", e => {
      e.preventDefault();

      const stationId = $(e.target).data( "station-id" );
      const stationName = $(e.target).data( "station-name" );

      this.showApiDetails( stationId, stationName );
    } );
  }

  showApiDetails( stationId, stationName ) {
    this.setDialogStationName( stationName );
    this.setHref( ".js-station-info-link",
                  `/flood-monitoring/id/stations/${stationId}` );
    this.setHref( ".js-station-measures-link",
                  `/flood-monitoring/id/stations/${stationId}/measures` );
    this.setHref( ".js-station-rainfall-readings-link",
                  `/flood-monitoring/id/stations/${stationId}/readings`,
                  "?_limit=100&_sorted&parameter=rainfall" );
    this.setHref( ".js-station-rainfall-readings-today-link",
                  `/flood-monitoring/id/stations/${stationId}/readings`,
                  "?today&_sorted&parameter=rainfall" );

    $("#apiDetailsModal").modal( "show" );
  }

  setDialogStationName( stationName ) {
    $(".js-station-name").text( stationName );
  }

  setHref( selector, hrefRoot, args ) {
    _.each( CONTENT_TYPES, contentType => {
      $(`${selector} a.js-${contentType}`).attr( "href", `${API_ROOT}${hrefRoot}.${contentType}${args || ""}` );
    } );
  }
}
