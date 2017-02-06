/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Station } from '../../../app/es/models/station.es';

const STATION_FIXTURE = {
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050',
  RLOIid: '1166',
  catchmentName: 'Cuckmere and Pevensey Levels',
  dateOpened: '2007-07-01',
  eaAreaName: 'Southern - Solent and South Downs',
  eaRegionName: 'Southern',
  easting: 575978,
  label: 'Crowhurst',
  lat: 50.878052,
  long: 0.500069,
  measures: [{
    '@id': 'http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-level-stage-i-15_min-mAOD',
    datumType: 'http://environment.data.gov.uk/flood-monitoring/def/core/datumAOD',
    label: 'CROWHURST RL - level-stage-i-15_min-mAOD',
    latestReading: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-level-stage-i-15_min-mAOD/2017-02-06T04-30-00Z',
      date: '2017-02-06',
      dateTime: '2017-02-06T04:30:00Z',
      measure: 'http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-level-stage-i-15_min-mAOD',
      value: 4.984,
    },
    notation: 'E7050-level-stage-i-15_min-mAOD',
    parameter: 'level',
    parameterName: 'Water Level',
    period: 900,
    qualifier: 'Stage',
    station: 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050',
    stationReference: 'E7050',
    type: ['http://environment.data.gov.uk/flood-monitoring/def/core/Measure', 'http://environment.data.gov.uk/flood-monitoring/def/core/WaterLevel'],
    unit: 'http://qudt.org/1.1/vocab/unit#Meter',
    unitName: 'mAOD',
    valueType: 'instantaneous',
  },
  {
    '@id': 'http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm',
    label: 'rainfall-tipping_bucket_raingauge-t-15_min-mm',
    latestReading: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm/2017-02-06T08-15-00Z',
      date: '2017-02-06',
      dateTime: '2017-02-06T08:15:00Z',
      measure: 'http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm',
      value: 0.0,
    },
    notation: 'E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm',
    parameter: 'rainfall',
    parameterName: 'Rainfall',
    period: 900,
    qualifier: 'Tipping Bucket Raingauge',
    station: 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050',
    stationReference: 'E7050',
    type: ['http://environment.data.gov.uk/flood-monitoring/def/core/Measure', 'http://environment.data.gov.uk/flood-monitoring/def/core/Rainfall'],
    unit: 'http://qudt.org/1.1/vocab/unit#Millimeter',
    unitName: 'mm',
    valueType: 'total',
  }],
  northing: 111706,
  notation: 'E7050',
  riverName: 'Cuckmere',
  stageScale: {
    '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050/stageScale',
    datum: 4.9,
    highestRecent: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050/stageScale/highestRecent',
      dateTime: '2010-02-22T13:45:00',
      value: 6.669,
    },
    maxOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050/stageScale/maxOnRecord',
      dateTime: '2010-02-22T13:45:00',
      value: 6.669,
    },
    minOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/E7050/stageScale/minOnRecord',
      dateTime: '2012-07-13T16:15:00',
      value: 4.986,
    },
    scaleMax: 7,
    typicalRangeHigh: 5.6,
    typicalRangeLow: 5.05,
  },
  stationReference: 'E7050',
  status: 'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive',
  town: 'Crowhurst',
  type: ['http://environment.data.gov.uk/flood-monitoring/def/core/SingleLevel', 'http://environment.data.gov.uk/flood-monitoring/def/core/Station'],
  wiskiID: '371112001',
};

describe('Station', () => {
  it('can be created with a JSON object', () => {
    const station = new Station({});
    expect(station).to.not.be.null;
  });

  it('can return the URI of the station', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.uri()).to.equal('http://environment.data.gov.uk/flood-monitoring/id/stations/E7050');
  });

  it('can return the location of the station given a spatial reference system', () => {
    const station = new Station(STATION_FIXTURE);

    const eastingNorthing = station.location('osgb');
    expect(eastingNorthing.x).to.equal(575978);
    expect(eastingNorthing.y).to.equal(111706);
    expect(eastingNorthing.srs).to.equal('osgb');

    const longLat = station.location('wgs84');
    expect(longLat.x).to.be.closeTo(0.500069, 0.001);
    expect(longLat.y).to.be.closeTo(50.87805, 0.0001);
    expect(longLat.srs).to.equal('wgs84');
  });

  it('should return the label if defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.label()).to.equal('Crowhurst');
  });

  it('should return an empty string if the label is not defined', () => {
    const station = new Station({});
    expect(station.label()).to.equal('');
  });

  it('should return the river name if defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.riverName()).to.equal('Cuckmere');
  });

  it('should return an empty string if the river name is not defined', () => {
    const station = new Station({});
    expect(station.riverName()).to.equal('');
  });

  it('should return the catchment name if defined', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.catchmentName()).to.equal('Cuckmere and Pevensey Levels');
  });

  it('should return an empty string if the catchment name is not defined', () => {
    const station = new Station({});
    expect(station.catchmentName()).to.equal('');
  });

  it('should return the station ID via the notation method', () => {
    const station = new Station({ notation: 'E1234' });
    expect(station.notation()).to.equal('E1234');
  });

  it('should return the status of the station', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.status()).to.equal('active');
  });

  it('should return null if the status of the station is not known', () => {
    const station = new Station({});
    expect(station.status()).to.be.null;
  });

  it('should allow json paths to be evaluated', () => {
    const station = new Station(STATION_FIXTURE);
    expect(station.get('measures[0].period')).to.equal(900);
  });
});
