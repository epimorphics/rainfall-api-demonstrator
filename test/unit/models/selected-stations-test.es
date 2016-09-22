import {expect} from "chai";
import {describe, it} from "mocha";
import {SelectedStations} from "../../../app/es/models/selected-stations.es";

describe( "SelectedStations", () => {
  it( "should show that a station is not selected initially", () => {
    let selStations = new SelectedStations();
    expect(selStations.isSelected( "E1234") ).to.equal( false );
  } );

  it( "should allow the selected status to be set", () => {
    let selStations = new SelectedStations();
    selStations.setSelected( "E1234", true );
    expect(selStations.isSelected( "E1234") ).to.equal( true );
  } );

  it( "should allow the selected status to be reset", () => {
    let selStations = new SelectedStations();
    selStations.setSelected( "E1234", true );
    selStations.setSelected( "E1234", false );
    expect(selStations.isSelected( "E1234") ).to.equal( false );
  } );
} );
