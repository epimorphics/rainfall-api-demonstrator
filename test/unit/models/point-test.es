import {expect} from "chai";
import {describe, it} from "mocha";
import {Point} from "../../../app/es/models/point.es";

describe( "Point", () => {
  it( "should encode a point using a given spatial-reference system", () => {
    const p = new Point( 10, 11, "osgb" );
    expect(p.x).to.equal(10);
    expect(p.y).to.equal(11);
    expect(p.srs).to.equal("osgb");
  } );
} );
