import $ from "jquery";
import _ from "lodash";
import {stationWithId} from "../models/stations.es";
import {RainfallGraphView} from "./rainfall-graph.es";

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

    new RainfallGraphView( station );
  }

  removeStationDetails( station ) {
    $(`.c-station-detail[data-station-id='${station.notation()}']`).remove();
  }

  stationDescription( station ) {
    const dsi = `data-station-id='${station.stationId()}'`;
    const dsn = `data-station-name='${station.label()}'`;

    return [
      "<div class='row'>",
      "  <div class='col-sm-12'>",
      `    <h3 class='c-station-detail--title'>${station.label()}`,
      `      <button type="button" class="c-api-details-btn js-action-show-api-details" ${dsi} ${dsn}>api details</button>`,
      "    </h3>",
      "  </div>",
      "  <div class='col-sm-6'>",
      "    <div class='row'>",
      "      <div class='col-sm-6'>",
      this.stationSummary( station ),
      "      </div>",
      "      <div class='col-sm-6'>",
      this.stationLatestReading( station ),
      "      </div>",
      "    </div>",
      "  </div>",
      "  <div class='col-sm-6'>",
      `    <div class='c-rainfall-graph ct-chart ct-double-octave' ${dsi}></div>`,
      "  </div>",
      "</div>"
    ].join("\n");
  }

  stationSummary( station ) {
    let buf = [
      "<ul class='c-station-detail--summary-list'>"
    ];

    buf.push( `<li>Station ID: ${station.stationId()}</li>` );

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
    const idRef = `data-station-id='${station.stationId()}' `;

    let buf = [
      "<h4 class='c-station-latest-reading--heading'>Latest reading</h4>",
      "<ul class='c-station-latest-reading--list'>",
      `<li>date: <span class='js-reading-date' ${idRef}></span></li>`,
      `<li>time: <span class='js-reading-time' ${idRef}></span></li>`,
      `<li>rainfall (mm): <span class='js-reading-value' ${idRef}></span></li>`,
      "</ul>"
    ];

    return buf.join("\n");
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
