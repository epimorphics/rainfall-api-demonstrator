import L from "leaflet";
import _ from "lodash";
import {stationsCollection} from "../models/stations.es";

export class MapView {
  constructor( selectedStations ) {
    this._selectedStations = selectedStations;
    this.initMap();
    this.addStationMarkers();
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
    L.Icon.Default.imagePath = "images";
  }

  addStationMarkers() {
    let map = this._map;
    const addMarkerFn = _.bind( this.addMarker, this );

    stationsCollection().then( stations => {
      _.each( stations, station => {
        if (station.locationWgs84().isDefined()) {
          addMarkerFn( station, map );
        }
        else {
          // console.log( "No location for station: " + station.notation() );
        }
      } );
    } );
  }

  addMarker( station, map ) {
    const icon = this.markerIcon( station );
    const marker = L.marker( station.locationWgs84().asLatLng(), {
      icon: icon,
      title: station.label(),
      stationId: station.notation(),
      selected: false
    } );

    marker.on( "click", _.bind( this.onMarkerClick, this ) );
    marker.addTo( map );
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
        iconUrl: "images/marker-icon-selected.png"
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

  selectMarker( marker, selected ) {
    if (marker.selected != selected) {
      marker.selected = selected;
      marker.setIcon( this.markerIconForStatus( selected ) );
    }
  }
}
