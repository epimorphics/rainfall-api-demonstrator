import L from "leaflet";
import _ from "lodash";
import $ from "jquery";
import {stationsCollection} from "../models/stations.es";
require( "leaflet.markercluster" );

export class MapView {
  constructor( selectedStations ) {
    this._selectedStations = selectedStations;
    this.initMap();
    this.addStationMarkers();
    this.initEvents();
  }

  initMap() {
    this._map = L.map("map").setView([51.505, -0.09], 13);

    var osmUrl="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var osmAttrib="Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors";
    var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 12, attribution: osmAttrib});

    // start the map in South-East England
    this._map.setView( new L.LatLng(53, -1), 6 );
    this._map.addLayer( osm );

    // marker images path
    L.Icon.Default.imagePath = "images/";
  }

  initEvents() {
    $("body").on( "rainfall-demo.selected", _.bind( this.onStationSelected, this ) );
  }

  addStationMarkers() {
    const createMarkerFn = _.bind( this.createMarkerFor, this );
    const map = this._map;

    stationsCollection().then( stations => {
      let markers = [];

      _.each( stations, station => {
        if (station.locationWgs84().isDefined()) {
          markers.push( createMarkerFn( station ) );
        }
        else {
          // console.log( "No location for station: " + station.notation() );
        }
      } );

      let markersGroup = L.markerClusterGroup();
      markersGroup.addLayers( markers );
      map.addLayer( markersGroup );
    } );

  }

  createMarkerFor( station ) {
    const icon = this.markerIcon( station );
    let marker = L.marker( station.locationWgs84().asLatLng(), {
      icon: icon,
      title: station.label(),
      stationId: station.notation(),
      selected: false
    } );

    marker.on( "click", _.bind( this.onMarkerClick, this ) );
    return marker;
  }

  markerIcon( station ) {
    return this.markerIconForStatus(
      this._selectedStations.isSelected( station )
    );
  }

  markerIconForStatus( selected ) {
    if (selected) {
      return new (this.selectedMarkerIcon())();
    }
    else {
      return new L.Icon.Default();
    }
  }

  selectedMarkerIcon() {
    return L.Icon.Default.extend( {
      options: {
        iconUrl: "marker-icon-selected.png"
      }
    });
  }

  onMarkerClick( e ) {
    const marker = e.target;
    const stationId = marker.options.stationId;
    const nowSelected = !this._selectedStations.isSelected( stationId );
    this._selectedStations.setSelected( stationId, nowSelected );
    this.selectMarker( marker, nowSelected );
  }

  selectMarker( marker, selected, noTrigger ) {
    if (marker.options.selected != selected) {
      marker.options.selected = selected;
      marker.setIcon( this.markerIconForStatus( selected ) );
      if (!noTrigger) {
        this.triggerSelected( marker.options.stationId, selected );
      }
    }
  }

  // events

  /** Notify other components that the selection state has changed */
  triggerSelected( stationId, selected ) {
    $("body").trigger( "rainfall-demo.selected", [stationId, selected] );
  }

  /** Ensure that map marker status stays in sync with selection status from other components */
  onStationSelected( event, stationId, selected ) {
    const selectMarkerFn = _.bind( this.selectMarker, this );

    this._map.eachLayer( layer => {
      if (layer.options.stationId == stationId && layer.options.selected != selected) {
        selectMarkerFn( layer, selected, true );
      }
    } );
  }
}
