import {expect} from "chai";
import {describe, it} from "mocha";
import {UserPreferences} from "../../../app/es/services/user-preferences.es";

import {jsdom} from "jsdom";

global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

describe("UserPreferences", () => {
  it( "should return a singleton instance on demand", () => {
    let userPrefs = UserPreferences.currentPreference();
    expect(userPrefs).to.not.be.null;
  } );
} );
