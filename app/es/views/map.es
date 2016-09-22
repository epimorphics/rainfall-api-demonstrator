import L from "leaflet";
import _ from "lodash";
import {stationsCollection} from "../models/stations.es";

export class MapView {
  constructor() {
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

    stationsCollection().then( stations => {
      _.each( stations, station => {
        const location = station.locationWgs84();

        if (location.x && location.y) {
          L.marker( location.asLatLng() )
            .addTo( map );
        }
        else {
          console.log( "No location for station:" );
          console.log( station );
        }
      } );
    } );
  }
}
