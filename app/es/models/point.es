/** Encapsulates a 2-d point, within a coordinate reference system */
export class Point {
  constructor( x, y, srs ) {
    this.x = x;
    this.y = y;
    this.srs = srs;
  }
}
