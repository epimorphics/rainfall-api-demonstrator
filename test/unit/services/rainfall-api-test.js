import {expect} from "chai";
import {describe, it} from "mocha";
import {allStations} from "../../../app/es/services/rainfaill-api.js";

describe("rainfall-api", () => {
  it( "returns a promise which resolves to an array of values", () => {
    return allStations().then( (stations) => {
      expect(stations).to.be.an("array");
    } );
  } );
});

