import {expect} from "chai";
import {describe, it} from "mocha";
import {Station} from "../../../app/es/models/station.es";

const STATION_FIXTURE ={
  "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/E7050" ,
  "RLOIid" : "1166" ,
  "catchmentName" : "Cuckmere and Pevensey Levels" ,
  "dateOpened" : "2007-07-01" ,
  "easting" : 575978 ,
  "label" : "Crowhurst" ,
  "lat" : 50.878052 ,
  "long" : 0.500069 ,
  "measures" : [ {
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm" ,
    "parameter" : "rainfall" ,
    "parameterName" : "Rainfall" ,
    "period" : 900 ,
    "qualifier" : "Tipping Bucket Raingauge" ,
    "unitName" : "mm"
  }] ,
  "northing" : 111706 ,
  "notation" : "E7050" ,
  "riverName" : "Cuckmere" ,
  "stageScale" : "http://environment.data.gov.uk/flood-monitoring/id/stations/E7050/stageScale" ,
  "stationReference" : "E7050" ,
  "status" : "http://environment.data.gov.uk/flood-monitoring/def/core/statusActive" ,
  "town" : "Crowhurst" ,
  "wiskiID" : "371112001"
};

describe("Station", () => {
  it( "can be created with a JSON object", () => {
    let station = new Station( {} );
    expect(station).to.not.be.null;
  } );

  it( "can return the URI of the station", () => {
    let station = new Station( STATION_FIXTURE );
    expect(station.uri()).to.equal("http://environment.data.gov.uk/flood-monitoring/id/stations/E7050");
  } );

  it( "can return the location of the station given a spatial reference system", () => {
    const station = new Station( STATION_FIXTURE );

    const eastingNorthing = station.location("osgb");
    expect(eastingNorthing.x).to.equal( 575978 );
    expect(eastingNorthing.y).to.equal( 111706 );
    expect(eastingNorthing.srs).to.equal( "osgb" );

    const longLat = station.location("wgs84");
    expect(longLat.x).to.be.closeTo( 0.500069, 0.001 );
    expect(longLat.y).to.be.closeTo( 50.87805, 0.0001 );
    expect(longLat.srs).to.equal( "wgs84" );
  } );

  it( "should return the label if defined", () => {
    const station = new Station( STATION_FIXTURE );
    expect(station.label()).to.equal( "Crowhurst" );
  } );

  it( "should return an empty string if the label is not defined", () => {
    const station = new Station( {} );
    expect( station.label() ).to.equal( "" );
  } );

  it( "should return the river name if defined", () => {
    const station = new Station( STATION_FIXTURE );
    expect(station.riverName()).to.equal( "Cuckmere" );
  } );

  it( "should return an empty string if the river name is not defined", () => {
    const station = new Station( {} );
    expect( station.riverName() ).to.equal( "" );
  } );

  it( "should return the catchment name if defined", () => {
    const station = new Station( STATION_FIXTURE );
    expect(station.catchmentName()).to.equal( "Cuckmere and Pevensey Levels" );
  } );

  it( "should return an empty string if the catchment name is not defined", () => {
    const station = new Station( {} );
    expect( station.catchmentName() ).to.equal( "" );
  } );

  it( "should return the station ID via the notation method", () => {
    const station = new Station( {notation: "E1234"} );
    expect( station.notation() ).to.equal( "E1234" );
  } );

  it( "should return the status of the station", () => {
    const station = new Station( STATION_FIXTURE );
    expect( station.status() ).to.equal( "active" );
  } );
});
