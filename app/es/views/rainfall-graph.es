import _ from "lodash";
import $ from "jquery";
import moment from "moment";
import {stationMeasures} from "../services/rainfall-api.es";
import {READINGS_DATE_FORMAT} from "../models/reading.es";

const DEFAULT_LIMIT = 2000;

/**
 * View class that manages collecting a one-month window of rainfall data for a
 * given station and displaying that as a graph
 */
export class RainfallGraphView {
  constructor( station ) {
    this._station = station;
    stationMeasures( station.stationId(), {
      since: this.rainfallDisplayPeriod(),
      _limit: DEFAULT_LIMIT
    }).then( _.bind( this.collectMeasures, this ) );
  }

  rainfallDisplayPeriod() {
    return moment
      .utc()
      .subtract( 1, "months" )
      .format();
  }

  collectMeasures( measures) {
    // const totals = this.aggregateMeasures( measures );
    this.displayLatest( this.latest( measures ), this._station.stationId() );
  }

  aggregateMeasures( measures ) {
    var agMeasures = _.groupBy( measures, measure => {measure.formattedDate();} );
    var totals = _.map( agMeasures, (fDate, measures) => {
      const total = _.sum(
        _.map( measures, measure => {return measure.value();} )
      );
      const date = moment( fDate, READINGS_DATE_FORMAT ).toDate();

      return [date, total];
    } );

    return totals.sort( (d0, d1) => {
      return d1[0].getTime() - d0[0].getTime();
    } );
  }

  displayLatest( latest, stationId ) {
    $(`[data-station-id=${stationId}].js-reading-value`)
      .text( latest.value() );
    $(`[data-station-id=${stationId}].js-reading-date`)
      .text( latest.formattedDate() );
    $(`[data-station-id=${stationId}].js-reading-time`)
      .text( latest.formattedTime() );
  }

  latest( measures ) {
    var latest = null;
    _.each( measures, measure => {
      if (!latest || measure.jsDate() > latest.jsDate()) {
        latest = measure;
      }
    } );

    return latest;
  }
}
