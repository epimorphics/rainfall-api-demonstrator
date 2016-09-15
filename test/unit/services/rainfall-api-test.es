import {expect} from "chai";
import {describe, it} from "mocha";
import {_} from "lodash";

import {allStations} from "../../../app/es/services/rainfaill-api.js";
import {Station} from "../../../app/es/models/station.js";

describe("rainfall-api", () => {
  it( "returns a promise which resolves to a non-empty array of values", () => {
    return allStations().then( (stations) => {
      expect(stations).to.be.an("array");
      expect(stations.length).to.be.above(0);
    } );
  } );

  it( "ensures that all values from allStations are Station objects", () => {
    return allStations().then( (stations) => {
      _.each( stations, (station) => {
        expect(station).to.be.an.instanceof( Station );
      } );
    } );
  });
});

