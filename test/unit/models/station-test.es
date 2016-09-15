import {expect} from "chai";
import {describe, it} from "mocha";
import {Station} from "../../../app/es/models/station.js";

describe("Station", () => {
  it( "can be created with a JSON object", () => {
    let station = new Station( {} );
    expect(station).to.not.be.null;
  } );
});
