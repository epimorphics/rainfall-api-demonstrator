import assert from "assert";
import {allStations} from "services/rainfall-api";

describe("rainfall-api", () => {
  it( "returns an array of values", () => {
    return allStations().then( (stations) => {
      expect(stations)
    } )
  } );
});
