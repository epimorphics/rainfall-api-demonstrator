import _ from 'lodash';
import { Point } from './point.es';

/* Support functions */

function defaultLabel() {
  return '';
}


/** Encapsulates an immutable value returned from the API representing a station */
class Station {
  constructor(json) {
    this.json = json;
  }

  uri() {
    return this.json['@id'];
  }

  label() {
    return this.valueOrDefault('label');
  }

  riverName() {
    return this.valueOrDefault('riverName');
  }

  catchmentName() {
    return this.valueOrDefault('catchmentName');
  }

  notation() {
    return this.json.notation;
  }

  stationId() {
    return this.notation();
  }

  status() {
    const statusURI = this.json.status || null;
    return statusURI &&
      statusURI.replace(/^.*\/status/, '')
      .toLocaleLowerCase();
  }

  get(path) {
    return _.get(this.json, path);
  }

  location(srs) {
    switch (srs) {
      case 'osgb': return this.locationOsgb();
      case 'wgs84': return this.locationWgs84();
      default: throw new Error('Unknown spatial reference system');
    }
  }

  locationOsgb() {
    return new Point(this.json.easting, this.json.northing, 'osgb');
  }

  locationWgs84() {
    return new Point(this.json.long, this.json.lat, 'wgs84');
  }

  valueOrDefault(field) {
    return this.json[field] || defaultLabel();
  }
}

export { Station as default };
