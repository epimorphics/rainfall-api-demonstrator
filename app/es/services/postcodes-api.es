/* Simple service object for retrieving contents from Rainfall HTTP API */
import request from "superagent";

const POSTCODE_ENDPOINT = "http://api.postcodes.io/postcodes";

/**
 * @return A promise of the result of looking up a string as a
 * postcode.
 */
export function lookupPostcode( searchStr ) {
  const searchStrNoSpaces = searchStr.replace( /\s/g, "" );

  return getJSON( `${POSTCODE_ENDPOINT}/${searchStrNoSpaces}`, {})
    .then( result => {
      return result.body.result;
    }, () => {
      return null;
    } );
}

/**
 * Perform an HTTP GET on the remote API end-point, and return a
 * promise for the result.
 * @param {String} HTTP API endpoint to call
 * @param {Object} An object encoding the URL parameters of the API call
 */
function getJSON( api, params ) {
  return request
    .get( api )
    .accept("application/json")
    .query( params || {} );
}

