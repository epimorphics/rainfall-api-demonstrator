/* Simple service object for retrieving contents from Rainfall HTTP API */

import {$} from 'jquery';

/** The root of the API URLs */
const API_ROOT = "http://ea-floods-testing.epimorphics.net";

/**
 * @return A promise which will resolve to an array of all of the
 * current rainfall stations, with basic metadata. Each element
 * of the array will be a Station value object
 */
export function allStations() {
  let promise = new Promise();
  promise.resolve([]);
  return promise;
  // return getJSON("/flood-monitoring/id/stations", {parameter: "rainfall"});
}

/**
 * Perform an HTTP GET on the remote API end-point, and return a
 * promise for the result.
 * @param apiPath The path segment of the API call, excluding the API_ROOT
 * @param data An object encoding the URL parameters of the API call
 */
function getJSON( apiPath, params ) {
  let api = "${API_ROOT}${apiPath}";
  let deferred = $.getJSON( api, params );
  return asPromise(deferred);
}

/**
 * Wrap a jQuery deferred object as an ES2015 Promise
 */
function asPromise(deferred) {
  return new Promise(function (resolve, reject) {
    deferred.then(resolve, reject);
  });
}
