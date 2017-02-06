/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { _ } from 'lodash';

import { allStations } from '../../../app/es/services/rainfall-api.es';
import Station from '../../../app/es/models/station.es';

describe('rainfall-api', () => {
  it('returns a promise which resolves to a non-empty array of values', () =>
    allStations().then((stations) => {
      expect(stations).to.be.an('array');
      expect(stations.length).to.be.above(0);
    }),
  );

  it('ensures that all values from allStations are Station objects', () =>
    allStations().then((stations) => {
      _.each(stations, (station) => {
        expect(station).to.be.an.instanceof(Station);
      });
    }),
  );
});

