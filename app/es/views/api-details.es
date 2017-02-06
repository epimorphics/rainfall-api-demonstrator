import _ from 'lodash';

const $ = require('jquery');

window.jQuery = $;
require('bootstrap-sass');

const CONTENT_TYPES = ['html', 'json', 'csv'];

// const API_ROOT = 'http://environment.data.gov.uk';
const API_ROOT = 'http://ea-floods-testing.epimorphics.net';

/* Support functions */

function setDialogStationName(stationName) {
  $('.js-station-name').text(stationName);
}

function setHref(selector, hrefRoot, args) {
  _.each(CONTENT_TYPES, (contentType) => {
    $(`${selector} a.js-${contentType}`).attr('href', `${API_ROOT}${hrefRoot}.${contentType}${args || ''}`);
  });
}

function showApiDetails(stationId, stationName) {
  setDialogStationName(stationName);
  setHref('.js-station-info-link',
               `/flood-monitoring/id/stations/${stationId}`);
  setHref('.js-station-measures-link',
               `/flood-monitoring/id/stations/${stationId}/measures`);
  setHref('.js-station-rainfall-readings-link',
               `/flood-monitoring/id/stations/${stationId}/readings`,
               '?_limit=100&_sorted&parameter=rainfall');
  setHref('.js-station-rainfall-readings-today-link',
               `/flood-monitoring/id/stations/${stationId}/readings`,
               '?today&_sorted&parameter=rainfall');

  $('#apiDetailsModal').modal('show');
}

function bindEvents() {
  $('body').on('click', '.js-action-show-api-details', (e) => {
    e.preventDefault();

    const stationId = $(e.target).data('station-id');
    const stationName = $(e.target).data('station-name');

    showApiDetails(stationId, stationName);
  });
}

/**
 * View class that ensures that the modal dialogue that show API details
 * for a given station is populated with the right information.
 */
class ApiDetailsView {
  constructor() {
    bindEvents();
  }
}

export { ApiDetailsView as default };
