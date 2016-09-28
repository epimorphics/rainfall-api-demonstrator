import _ from "lodash";
import $ from "jquery";
import moment from "moment";
import {stationMeasures} from "../services/rainfall-api.es";
import {READINGS_DATE_FORMAT} from "../models/reading.es";
const Chartist = require( "chartist" );
window.Chartist = Chartist;
require( "chartist-plugin-axistitle" );

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
      _limit: DEFAULT_LIMIT,
      parameter: "rainfall"
    }).then( _.bind( this.collectMeasures, this ) );
  }

  rainfallDisplayPeriod() {
    return moment
      .utc()
      .subtract( 1, "months" )
      .format();
  }

  collectMeasures( measures) {
    this.displayLatest( this.latest( measures ), this._station.stationId() );
    const totals = this.aggregateMeasures( measures );
    const stationId = this._station.stationId();
    const graphOptions = {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 4,
        labelInterpolationFnc: value => {
          return moment(value).format("D MMM");
        }
      },
      axisY: {
        labelInterpolationFnc: value => {
          return `${value.toFixed(1)}`;
        }
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisY: {
            axisTitle: "Rainfall (mm)",
            axisClass: "ct-axis-title",
            offset: {
              x: 0,
              y: 12
            },
            textAnchor: "middle",
            flipTitle: true
          },
          axisX: {}
        })
      ]
    };
    new Chartist.Bar( `li[data-station-id='${stationId}'] .ct-chart`,
                      {series: this.createSeries( totals )},
                      graphOptions );
  }

  aggregateMeasures( measures ) {
    var agMeasures = _.groupBy( measures, measure => {return measure.formattedDate();} );
    var totals = _.map( agMeasures, (measures, fDate) => {
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
    $(`[data-station-id='${stationId}'].js-reading-value`)
      .text( latest.value() );
    $(`[data-station-id='${stationId}'].js-reading-date`)
      .text( latest.formattedDate() );
    $(`[data-station-id='${stationId}'].js-reading-time`)
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

  /**
   * Transform an array of pairs of data, of the form `[data, value]` into
   * an array of dates and an array of values. This is similar to the Lodash
   * zip function, but we need to use the spread operator to expand the arrays
   */
  createSeries( totals ) {
    return [{
      data: _.map( totals, pair => {
        return {x: pair[0], y: pair[1]};
      })
    }];
  }
}
