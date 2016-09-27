/* Simple service object for retrieving contents from Rainfall HTTP API */
import request from "superagent";
import {_} from "lodash";

import {Station} from "../models/station.es";
import {Reading} from "../models/reading.es";

/** The root of the API URLs */
const API_ROOT = "http://ea-floods-testing.epimorphics.net";

/** API endpoint for retrieving stations */
const STATIONS_ENDPOINT = "/flood-monitoring/id/stations";

/**
 * @return A promise which will resolve to an array of all of the
 * current rainfall stations, with basic metadata. Each element
 * of the array will be a Station value object
 */
export function allStations( options ) {
  const params = _.extend( {parameter: "rainfall", _view: "full"}, options );
  return getJSON( STATIONS_ENDPOINT, params )
    .then( resultItems )
    .then( _.partial( wrapValues, Station ));
}

/**
 * @return A detailed record for the station with the given station ID
 * @param {String} The station ID
 */
export function stationDetails( stationId ) {
  return getJSON( `${STATIONS_ENDPOINT}/${stationId}`, {_view: "full"})
    .then( resultItems, () => {return null;} )
    .then( json => {return json ? new Station( json ) : {}.undefined;} );
}

/**
 * @return A promise of a collection of rainfall readings for a given
 * time period
 * @param {String} The ID of the station for which data is requested
 * @param {Object} Additional parameters, e.g. the limit and time period
 */
export function stationMeasures( stationId, options ) {
  return getJSON( `${STATIONS_ENDPOINT}/${stationId}/readings`, options )
    .then( resultItems )
    .then( _.partial( wrapValues, Reading ));
}

/**
 * Perform an HTTP GET on the remote API end-point, and return a
 * promise for the result.
 * @param apiPath The path segment of the API call, excluding the API_ROOT
 * @param data An object encoding the URL parameters of the API call
 */
function getJSON( apiPath, params ) {
  const api = `${API_ROOT}${apiPath}`;
  return request
    .get( api )
    .accept("application/json")
    .query( params || {} );
}

/**
 * @return The items from a result object
 */
function resultItems( response ) {
  return response.body.items;
}

/**
 * Wrap each item in a list of items using a value-object class
 * @param valueClass A function denoting a JavaScript class
 * @param items An array of items to be wrapped
 * @return A new array in which each element is the corresponding element
 *         of _items_ wrapped as a new _valueClass_ instance
 */
function wrapValues( valueClass, items ) {
  return _.map( items, (item) => {return new valueClass(item);} );
}
