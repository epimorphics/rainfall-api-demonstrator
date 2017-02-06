import _ from 'lodash';
import Point from './point.es';

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

  /** @return The label for this station. Since actual station name has now been redacted, we
   *  interpret this to refer to the station ID instead. */
  label() {
    const id = this.stationId();
    return id ? `Station ${id}` : '';
  }

  riverName() {
    return this.get('riverName');
  }

  catchmentName() {
    return this.get('catchmentName');
  }

  notation() {
    return this.json.notation;
  }

  stationId() {
    return this.notation();
  }

  eaRegionName() {
    return this.get('eaRegionName');
  }

  status() {
    const statusURI = this.json.status || null;
    return statusURI &&
      statusURI.replace(/^.*\/status/, '')
      .toLocaleLowerCase();
  }

  get(path) {
    return _.get(this.json, path, defaultLabel());
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
}

export { Station as default };
