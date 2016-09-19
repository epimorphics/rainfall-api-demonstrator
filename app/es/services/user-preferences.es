import queryString from "query-string";
import $ from "jquery";
import _ from "lodash";

/** The singleton instance of the preference model */
var currentPreferenceModel = null;

/** Table of mappings between input fields and model values */
const MODEL_FIELDS = [
  {param: "riverName", fieldId: "river-name"}
];

/** Encapsulates the user's current search prefernce, which can also be
 *  instantiated from URL parameters
 */
export class UserPreferences {
  /** @return The current user preferences singleton. If not yet initialised,
   *  create a new one with the optional parameters.
   *  @param params Optional parameters to instantiate user preferences
   */
  static currentPreference( params ) {
    if (!currentPreferenceModel) {
      currentPreferenceModel = new UserPreferences( params );
    }
    return currentPreferenceModel;
  }

  /**
   * @param params If defined, use the `.location.search` property as the source
   * to parse the current state. If not defined, use `window.location.search`.
   */
  constructor( params ) {
    this.preferences = queryString.parse( (params || window).location.search );
    this.initialiseValues();
    this.bindEvents();
  }

  /**
   * Listen to changes in the fields representing model values
   */
  bindEvents() {

  }

  /**
   * Set initial field values based on the model contents
   */
  initialiseValues() {
    _.forEach( this.preferences, (value, key) => {
      if (value && value !== "") {
        $(`[name=${key}]`).val( value );
      }
    } );
  }
}
