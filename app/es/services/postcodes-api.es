/* Simple service object for retrieving contents from the HTTP API */
import request from 'superagent';

const POSTCODE_ENDPOINT = '//api.postcodes.io/postcodes';

/**
 * Perform an HTTP GET on the remote API end-point, and return a
 * promise for the result.
 * @param {String} HTTP API endpoint to call
 * @param {Object} An object encoding the URL parameters of the API call
 */
function getJSON(api, params) {
  return request
    .get(api)
    .accept('application/json')
    .query(params || {});
}

/**
 * @return A promise of the result of looking up a string as a
 * postcode.
 */
function lookupPostcode(searchStr) {
  const searchStrNoSpaces = searchStr.replace(/\s/g, '');

  return getJSON(`${POSTCODE_ENDPOINT}/${searchStrNoSpaces}`, {})
    .then(result => result.body.result,
          () => null);
}

export { lookupPostcode as default };
