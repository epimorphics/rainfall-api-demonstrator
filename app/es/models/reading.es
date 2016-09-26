import _ from "lodash";
import moment from "moment";

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
    return this.dateTime().format( "D MMM YYYY" );
  }

  get( path ) {
    return _.get( this._json, path );
  }
}
