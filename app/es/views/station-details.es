import $ from 'jquery';
import _ from 'lodash';
import { stationWithId } from '../models/stations.es';
import GraphView from './readings-graph.es';

/* Support functions */

function removeStationDetails(station) {
  $(`.c-station-detail[data-station-id='${station.notation()}']`).remove();
}

function stationSummary(station) {
  const buf = [
    "<ul class='c-station-detail--summary-list'>",
  ];

  buf.push(`<li>Station ID: ${station.stationId()}</li>`);

  if (station.status()) {
    buf.push(`<li>Status: ${station.status()}</li>`);
  }

  const location = station.location('wgs84');
  if (location.isDefined()) {
    buf.push(`<li>Lat, long: ${location.y.toFixed(2)}, ${location.x.toFixed(2)}</li>`);
  }

  if (station.get('gridReference')) {
    buf.push(`<li>Grid ref: ${station.get('gridReference')}</li>`);
  }

  if (station.get('eaRegionName')) {
    buf.push(`<li>EA region: ${station.get('eaRegionName')}</li>`);
  }

  buf.push('</ul>');
  return buf.join('\n');
}

function stationLatestReading(station) {
  const idRef = `data-station-id='${station.stationId()}' `;

  const buf = [
    "<h4 class='c-station-latest-reading--heading'>Latest reading</h4>",
    "<ul class='c-station-latest-reading--list'>",
    `<li>date: <span class='js-reading-date' ${idRef}></span></li>`,
    `<li>time: <span class='js-reading-time' ${idRef}></span></li>`,
    `<li>rainfall (mm): <span class='js-reading-value' ${idRef}></span></li>`,
    '</ul>',
  ];

  return buf.join('\n');
}

function stationDescription(station) {
  const dsi = `data-station-id='${station.stationId()}'`;
  const dsn = `data-station-name='${station.label()}'`;

  return [
    "<div class='row'>",
    "  <div class='col-sm-12'>",
    `    <h3 class='c-station-detail--title'>${station.label()}`,
    `      <button type="button" class="c-api-details-btn js-action-show-api-details" ${dsi} ${dsn}>api details</button>`,
    '    </h3>',
    '  </div>',
    "  <div class='col-sm-6'>",
    "    <div class='row'>",
    "      <div class='col-sm-6'>",
    stationSummary(station),
    '      </div>',
    "      <div class='col-sm-6'>",
    stationLatestReading(station),
    '      </div>',
    '    </div>',
    '  </div>',
    "  <div class='col-sm-6'>",
    `    <div class='c-readings-graph ct-chart ct-double-octave' ${dsi}></div>`,
    '  </div>',
    '</div>',
  ].join('\n');
}


function showOrHidePrompt() {
  const hidePrompt = ($('.c-station-detail').length > 0);
  $('.o-station-details--list__default-message').toggleClass('hidden', hidePrompt);
}

/**
 * A view that maintains a list of the selected stations shown with details */
class StationDetailsView {
  constructor() {
    this.initEvents();
  }

  initEvents() {
    $('body').on('map.selected', _.bind(this.onStationSelected, this));
  }

  onStationSelected(event, stationId, selected) {
    stationWithId(stationId).then((station) => {
      if (station && selected) {
        this.showStationDetails(station);
      } else if (station) {
        removeStationDetails(station);
      }

      showOrHidePrompt();
    });
  }

  showStationDetails(station) {
    const stationDesc = stationDescription(station);
    const elem =
      `<li class='c-station-detail' data-station-id='${station.notation()}'>${stationDesc}</li>`;
    this.ui().stationDetailsList.append(elem);

    return new GraphView(station);
  }

  ui() {
    if (!this.uiRef) {
      this.uiRef = {
        stationDetails: $('.o-station-details'),
        stationDetailsHeading: $('.o-station-details--heading'),
        stationDetailsList: $('.o-station-details--list'),
      };
    }

    return this.uiRef;
  }
}

export { StationDetailsView as default };
