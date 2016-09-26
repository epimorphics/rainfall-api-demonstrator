import {expect} from "chai";
import {describe, it} from "mocha";
import {Reading} from "../../../app/es/models/reading.es";

const READING_FIXTURE = {
  "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/253861TP-rainfall-tipping_bucket_raingauge-t-15_min-mm/2016-09-25T03-30-00Z",
  dateTime: "2016-09-25T03:30:00Z",
  measure: "http://environment.data.gov.uk/flood-monitoring/id/measures/253861TP-rainfall-tipping_bucket_raingauge-t-15_min-mm",
  value: 0.4
};

describe( "Reading", () => {
  it( "should return the URI of the measurement", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.uri() ).to.equal( "http://environment.data.gov.uk/flood-monitoring/data/readings/253861TP-rainfall-tipping_bucket_raingauge-t-15_min-mm/2016-09-25T03-30-00Z");
  } );

  it( "should return the value of the reading", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.value() ).to.equal( 0.4 );
  });

  it( "should return the raw datetime string", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.dateTimeStr() ).to.equal( "2016-09-25T03:30:00Z" );
  } );

  it( "should return a JavaScript date", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.jsDate() ).to.deep.equal( new Date( Date.UTC( 2016, 8, 25, 3, 30, 0 ) )  );
  } );

  it( "should return a formatted time", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.formattedTime() ).to.equal( "03:30:00" );
  } );

  it( "should return a formatted date", () => {
    const reading = new Reading( READING_FIXTURE );
    expect( reading.formattedDate() ).to.equal( "25 Sep 2016" );
  } );
} );
