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

  it( "should return true when asked if locations are undefined", () => {
    const p0 = new Point( null, 10, "osgb" );
    const p1 = new Point( 10, null, "osgb" );
    const p2 = new Point( null, null, "osgb" );
    expect( p0.isDefined() ).to.equal( false );
    expect( p1.isDefined() ).to.equal( false );
    expect( p2.isDefined() ).to.equal( false );
  } );

  it( "should return a latlong object on request", () => {
    const p = new Point( 1, 1, "wgs84" );
    expect( p.asLatLng() ).to.not.be.null;
    expect( p.asLatLng().length ).to.equal( 2 );
  } );
} );
