/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { jsdom } from 'jsdom';
import { UserPreferences } from '../../../app/es/services/user-preferences.es';


global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

describe('UserPreferences', () => {
  it('should return a singleton instance on demand', () => {
    const userPrefs = UserPreferences.currentPreference();
    expect(userPrefs).to.not.be.null;
  });
});
