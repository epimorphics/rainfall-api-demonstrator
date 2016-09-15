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

  it( "can report the URI of the station", () => {
    let station = new Station( STATION_FIXTURE );
    expect(station.uri()).to.equal("http://environment.data.gov.uk/flood-monitoring/id/stations/E7050");
  } );
});
