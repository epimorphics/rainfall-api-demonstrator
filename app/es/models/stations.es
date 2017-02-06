import { _ } from 'lodash';
import { allStations, stationDetails } from '../services/rainfall-api.es';

/** Cached array of rainfall stations */
let stations;
let stationsPromise;

/** @return True if the station matches the given pattern */
function matchStation(station, pattern) {
  return _.reduce(pattern, (acc, value, key) => acc && value.test(station[key]()), true);
}

/** @return a promise of stations retrieved via tha API */
function retrieveStations() {
  stationsPromise = allStations()
    .then((stns) => {
      stations = stns;
      stationsPromise = null;
      return stns;
    });
  return stationsPromise;
}

/** @return A compacted, uniqified array of the values of `fieldFn` */
function compactify(arr, fieldFn) {
  return _.uniq(
    _.reject(
      _.map(arr, value => value[fieldFn].call(value)),
      _.isEmpty,
   ));
}

/** @return A promise of an array of all of the rainfall stations */
export function stationsCollection() {
  if (stations) {
    return Promise.resolve(stations);
  } else if (stationsPromise) {
    return stationsPromise;
  }

  return retrieveStations();
}

/** @return True if there are cached stations */
export function hasCachedStations() {
  return !!stations;
}

/** @return A promise of the names of all of the stations */
export function stationNames() {
  return stationsCollection()
    .then(stns => _.map(stns, station => station.label()));
}

/** @return A promise of the names of all of the unique river names */
export function riverNames() {
  return stationsCollection()
    .then(stns => compactify(stns, 'riverName'));
}

/** @return A promise of the names of all of the unique catchment names */
export function catchmentNames() {
  return stationsCollection()
    .then(stns => compactify(stns, 'catchmentName'));
}

/**
 * @param conditions A object denoting the criteria to search by, with
 *                   keys that match fields in the station object
 * @return A promise of station objects that match a given input string
 */
export function matchStations(conditions) {
  const pattern = _.mapValues(conditions, searchStr => new RegExp(searchStr, 'ig'));

  return stationsCollection()
    .then(stns => _.filter(stns, station => matchStation(station, pattern)));
}

/**
 * @param {String} A station ID
 * @return A promise that resolves to the station with that
 *         ID as a Station object, or undefined.
 */
export function stationWithId(stationId) {
  return stationDetails(stationId);
}

