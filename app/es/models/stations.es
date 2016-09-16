import {_} from "lodash";
import {allStations} from "../services/rainfall-api.es";

/** Cached array of rainfall stations */
let stations;

/** @return A promise of an array of all of the rainfall stations */
export function stationsCollection() {
  if (!stations) {
    return retrieveStations();
  }
  else {
    return Promise.resolve( stations );
  }
}

/** @return True if there are cached stations */
export function hasCachedStations() {
  return !!stations;
}

/** @return A promise of the names of all of the stations */
export function stationNames() {
  return stationsCollection()
    .then( (stations) => {
      return _.map( stations, station => {return station.label();} );
    } );
}

/** @return A promise of the names of all of the river names */
export function riverNames() {
  return stationsCollection()
    .then( (stations) => {
      return compactify( stations, "riverName" );
    } );
}

/** @return a promise of stations retrieved via tha API */
function retrieveStations() {
  return allStations()
    .then( (stns) => {
      stations = stns;
      return stns;
    } );
}

/** @return A compacted, uniqified array of the values of `fieldFn` */
function compactify( arr, fieldFn ) {
  return _.uniq(
    _.reject(
      _.map( arr, (value) => {return value.call( null, fieldFn );} ),
      _.isEmpty
    )
  );
}
