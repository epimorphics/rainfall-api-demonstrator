import {expect} from "chai";
import {describe, it} from "mocha";

import {stationsCollection, hasCachedStations,
        stationNames, riverNames,
        catchmentNames} from "../../../app/es/models/stations.es";
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

  it( "should return a promise of all of the names of stations", () => {
    return stationNames().then( (names) => {
      expect(names.length).to.be.above( 0 );
      expect(names).to.include.members(["Crowhurst", "Summergrove"]);
      expect(names).to.not.contain([""]);
    } );
  } );

  it( "should return a promise of all of the names of rivers", () => {
    return riverNames().then( (names) => {
      expect(names.length).to.be.above( 0 );
      expect(names).to.include.members(["Cuckmere", "Day Brook"]);
      expect(names).to.not.contain([""]);
    } );
  } );

  it( "should return a promise of all of the names of catchments", () => {
    return catchmentNames().then( (names) => {
      expect(names.length).to.be.above( 0 );
      expect(names).to.include.members(["Cuckmere and Pevensey Levels"]);
      expect(names).to.not.contain([""]);
    } );
  } );
} );
