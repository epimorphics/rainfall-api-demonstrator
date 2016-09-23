import $ from "jquery";
import _ from "lodash";
import {stationWithId} from "../models/stations.es";

/**
 * A view that maintains a list of the selected stations shown with details */
export class StationDetailsView {
  constructor() {
    this.initEvents();
  }

  initEvents() {
    $("body").on( "rainfall-demo.selected", _.bind( this.onStationSelected, this ) );
  }

  onStationSelected( event, stationId, selected ) {
    stationWithId( stationId ).then( station => {
      if (station && selected) {
        this.showStationDetails( station );
      }
      else if (station) {
        this.removeStationDetails( station );
      }

      this.showOrHidePrompt();
    } );

  }

  showStationDetails( station ) {
    const stationDesc = station.label();
    const elem =
      `<li class='c-station-detail' data-station-id='${station.notation()}'>${stationDesc}</li>`;
    this.ui().stationDetailsList.append( elem );
  }

  removeStationDetails( station ) {
    $(`.c-station-detail[data-station-id='${station.notation()}']`).remove();
  }

  ui() {
    if (!this._ui) {
      this._ui = {
        stationDetails: $(".o-station-details" ),
        stationDetailsHeading: $(".o-station-details--heading" ),
        stationDetailsList: $(".o-station-details--list" )
      };
    }

    return this._ui;
  }

  showOrHidePrompt() {
    const hidePrompt = ($(".c-station-detail").length > 0);
    $(".o-station-details--list__default-message").toggleClass( "hidden", hidePrompt );
  }
}
