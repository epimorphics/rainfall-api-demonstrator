/** Encapsulates a 2-d point, within a coordinate reference system */
export class Point {
  constructor( x, y, srs ) {
    this.x = x;
    this.y = y;
    this.srs = srs;
  }

  asLatLng() {
    return [this.y, this.x];
  }

  isDefined() {
    return !!(this.x && this.y);
  }
}
