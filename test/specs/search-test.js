/* eslint-disable */

var assert = require('assert');
import {expect} from 'chai';
/* global describe it browser  */

describe('searching stations by name', () => {
  it ('does not have a visible list of results initially', () => {
    var client = browser.url('/search-fixture.html');
    assert( !client.isVisible('.o-search-results' ));
  });

  it ('does not have a visible list of results when only one letter is typed', () => {
    var client = browser.url('/search-fixture.html');
    client.setValue( '#searchField', 'r' );
    assert( !client.isVisible('.o-search-results' ));
  } );

  it ('does have a visible list of results when two letters are typed', () => {
    var client = browser.url('/search-fixture.html');
    client.setValue( '#searchField', '99' );
    client.waitForVisible('.o-search-results');
    assert( client.isVisible('.o-search-results' ));
  } );

  it ('has at least one result element when there are matches', () => {
    var client = browser.url('/search-fixture.html');
    client.setValue( '#searchField', '99' );
    client.waitForVisible('.o-search-results');
    assert( client.isVisible('li.o-search-results--result' ));
  } );

  it ('shows an appropriate message if no search terms match', () => {
    var client = browser.url('/search-fixture.html');
    client.setValue( '#searchField', 'zzzzz' );
    client.waitForVisible('.o-search-results');
    expect( client.getText('.o-search-results--summary') ).to.equal('No matches.');
  });
});
