var assert = require("assert");
/* global describe it browser  */

describe("searching stations by name", () => {
  it("does not have a visible list of results initially", () => {
    var client = browser.url("/search-fixture.html");
    assert( !client.isVisible(".o-search-results" ));
  });

  it("does not have a visible list of results when only one letter is typed", () => {
    var client = browser.url("/search-fixture.html");
    client.setValue( "#searchField", "r" );
    assert( !client.isVisible(".o-search-results" ));
  } );

  it("does have a visible list of results when two letters are typed", () => {
    var client = browser.url("/search-fixture.html");
    // client.setValue( "#searchField", "br" );
    client.click("#searchField");
    client.keys( "br");
    // return client.pause( 2000 ).then( () => {
      console.log("in-pause")
    client.pause(2000);
    console.log("post-pause")
    client.saveScreenshot("./screenshot.png");
      assert( client.isVisible(".o-search-results" ));
    // });
  } );

  it("has at least one result element when there are matches", () => {
    var client = browser.url("/search-fixture.html");
    client.setValue( "#searchField", "br" )
          .pause( 2000 );
    assert( client.isVisible("li.o-search-results--result" ));
  } );

});
