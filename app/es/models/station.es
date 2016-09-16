import {Point} from "./point.es";

/** Encapsulates an immutable value returned from the API representing a station */
export class Station {
  constructor( json ) {
    this.json = json;
  }

  uri() {
    return this.json["@id"];
  }

  label() {
    return this.valueOrDefault( "label" );
  }

  riverName() {
    return this.valueOrDefault( "riverName" );
  }

  catchmentName() {
    return this.valueOrDefault( "catchmentName" );
  }

  location( srs ) {
    switch(srs) {
    case "osgb": return this.locationOsgb();
    case "wgs84": return this.locationWgs84();
    default: throw( "Unknown spatial reference system" );
    }
  }

  locationOsgb() {
    return new Point( this.json.easting, this.json.northing, "osgb" );
  }

  locationWgs84() {
    return new Point( this.json.long, this.json.lat, "wgs84" );
  }

  defaultLabel() {
    return "";
  }

  valueOrDefault( field ) {
    return this.json[field] || this.defaultLabel();
  }
}
