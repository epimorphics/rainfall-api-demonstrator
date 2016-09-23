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
    const stationDesc = this.stationDescription( station );
    const elem =
      `<li class='c-station-detail' data-station-id='${station.notation()}'>${stationDesc}</li>`;
    this.ui().stationDetailsList.append( elem );
  }

  removeStationDetails( station ) {
    $(`.c-station-detail[data-station-id='${station.notation()}']`).remove();
  }

  stationDescription( station ) {
    return [
      "<div class='xrow'>",
      `  <h3 class='c-station-detail--title'>${station.label()}</h3>`,
      "  <div class='col-sm-6'>",
      this.stationSummary( station ),
      "  </div>",
      "  <div class='col-sm-6'>",
      this.stationLatestReading( station ),
      "  </div>",
      "</div>"
    ].join("\n");
  }

  stationSummary( station ) {
    let buf = [
      "<ul class='c-station-detail--summary-list'>"
    ];

    if (station.status()) {
      buf.push( `<li>Status: ${station.status()}</li>` );
    }

    const location = station.location( "wgs84");
    if (location.isDefined() ) {
      buf.push( `<li>Lat, long: ${location.y.toFixed(2)}, ${location.x.toFixed(2)}</li>` );
    }

    if (station.get( "gridReference")) {
      buf.push( `<li>Grid ref: ${station.get("gridReference")}</li>` );
    }

    if (station.get( "eaRegionName")) {
      buf.push( `<li>EA region: ${station.get("eaRegionName")}</li>` );
    }

    buf.push( "</ul>" );
    return buf.join("\n");
  }

  stationLatestReading( station ) {
    return "";
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
