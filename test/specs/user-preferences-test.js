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
    const riverName = browser.element( "#riverName").getValue();
    assert( riverName == "Brue" );
  });
});
