import assert from "assert";
// import {describe, it} from "mocha";
// import {browser} from "webdriverio";

describe("user preferences", () => {
  it("does not set the river name if no parameter is given", () => {
    browser.url("/user-preferences-fixture.html");
    const riverName = browser.element( "#riverName").getValue();
    assert( riverName == "" || riverName == null );
  });

  it("sets the river name if given", () => {
    browser.url("/user-preferences-fixture.html?riverName=Brue");
    const name = browser.element( "#riverName").getValue();
    assert( name == "Brue" );
  });

  it("sets the catchment name if given", () => {
    browser.url("/user-preferences-fixture.html?catchmentName=Brue");
    const name = browser.element( "#catchmentName").getValue();
    assert( name == "Brue" );
  });

  it("sets the station name if given", () => {
    browser.url("/user-preferences-fixture.html?stationName=Brue");
    const name = browser.element( "#stationName").getValue();
    assert( name == "Brue" );
  });

  it("sets the latitude if given", () => {
    browser.url("/user-preferences-fixture.html?lat=1234");
    const name = browser.element( "#lat").getValue();
    assert( name == "1234" );
  });

  it("sets the longitude if given", () => {
    browser.url("/user-preferences-fixture.html?long=1234");
    const name = browser.element( "#long").getValue();
    assert( name == "1234" );
  });

  it("sets the radius if given", () => {
    browser.url("/user-preferences-fixture.html?dist=1234.5");
    const name = browser.element( "#dist").getValue();
    assert( name == "1234.5" );
  });
});
