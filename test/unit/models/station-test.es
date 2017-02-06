/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import Station from '../../../app/es/models/station.es';

const STATION_FIXTURE = {
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/49172',
  eaRegionName: 'South West',
  easting: 199750,
  gridReference: 'SW997804',
  label: 'Rainfall station',
  lat: 50.58935060776287,
  long: -4.830394991377174,
  measures: 'http://environment.data.gov.uk/flood-monitoring/id/measures/49172-rainfall-tipping_bucket_raingauge-t-15_min-mm',
  northing: 80450,
  notation: '49172',
  stationReference: '49172',
  type: 'http://environment.data.gov.uk/flood-monitoring/def/core/Station',
};

describe('Station', () => {
  it('can be created with a JSON object', () => {
    const station = new Station({});
    expect(station).to.not.be.null;
  });

  it('can return the URI of the station', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.uri()).to.equal('http://environment.data.gov.uk/flood-monitoring/id/stations/49172');
  });

  it('can return the location of the station given a spatial reference system', () => {
    const station = new Station(STATION_FIXTURE);

    const eastingNorthing = station.location('osgb');
    expect(eastingNorthing.x).to.equal(199750);
    expect(eastingNorthing.y).to.equal(80450);
    expect(eastingNorthing.srs).to.equal('osgb');

    const longLat = station.location('wgs84');
    expect(longLat.x).to.be.closeTo(-4.830394991377174, 0.001);
    expect(longLat.y).to.be.closeTo(50.58935060776287, 0.0001);
    expect(longLat.srs).to.equal('wgs84');
  });

  it('should return the label if defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.label()).to.equal('Station 49172');
  });

  it('should return an empty string if the label is not defined', () => {
    const station = new Station({});
    expect(station.label()).to.equal('');
  });

  it('should return the river name if defined', () => {
    const station = new Station({ riverName: 'Cuckmere' });
    expect(station.riverName()).to.equal('Cuckmere');
  });

  it('should return an empty string if the river name is not defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.riverName()).to.equal('');
  });

  it('should return the catchment name if defined', () => {
    const station = new Station({ catchmentName: 'Cuckmere and Pevensey Levels' });
    expect(station.catchmentName()).to.equal('Cuckmere and Pevensey Levels');
  });

  it('should return an empty string if the catchment name is not defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.catchmentName()).to.equal('');
  });

  it('should return the station ID via the notation method', () => {
    const station = new Station({ notation: 'E1234' });
    expect(station.notation()).to.equal('E1234');
  });

  it('should return the status of the station', () => {
    const station = new Station({ status: 'active' });
    expect(station.status()).to.equal('active');
  });

  it('should return null if the status of the station is not known', () => {
    const station = new Station({});
    expect(station.status()).to.be.null;
  });

  it('should allow json paths to be evaluated', () => {
    const station = new Station({ measures: [{ period: 900 }] });
    expect(station.get('measures[0].period')).to.equal(900);
  });
});
