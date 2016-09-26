import _ from "lodash";
import moment from "moment";

export const READINGS_DATE_FORMAT = "D MMM YYYY";

/** Encapsulate a reading from a rainfall station */
export class Reading {
  constructor( json ) {
    this._json = json;
  }

  uri() {
    return this.get( "@id");
  }

  value() {
    return this.get( "value" );
  }

  dateTimeStr() {
    return this.get( "dateTime" );
  }

  dateTime() {
    return moment( this.dateTimeStr() ).utc();
  }

  jsDate() {
    return this.dateTime().toDate();
  }

  formattedTime() {
    return this.dateTime().format( "HH:mm:ss" );
  }

  formattedDate() {
    return this.dateTime().format( READINGS_DATE_FORMAT );
  }

  get( path ) {
    return _.get( this._json, path );
  }
}
