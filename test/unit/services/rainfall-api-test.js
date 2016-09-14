import {expect} from "chai";
import {allStations} from "../../../app/js/services/rainfaill-api.js";

describe("rainfall-api", () => {
  it( "returns a promise which resolves to an array of values", () => {
    return allStations().then( (stations) => {
      expect(stations).to.be.an('array');
    } )
  } );
});
