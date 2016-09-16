import {expect} from "chai";
import {describe, it} from "mocha";

import {stationsCollection, hasCachedStations} from "../../../app/es/models/stations.es";
import {Station} from "../../../app/es/models/station.es";

describe( "stations model", () => {
  it( "should provide a promise of a collection of stations", () => {
    expect(hasCachedStations()).to.equal(false);

    return stationsCollection().then( (stations) => {
      expect(stations.length).to.be.above(0);
      expect(stations[0]).to.be.instanceof(Station);
      expect(hasCachedStations()).to.equal(true);
    } );
  } );
} );
