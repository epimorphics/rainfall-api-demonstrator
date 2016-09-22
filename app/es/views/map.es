import L from "leaflet";

export class MapView {
  constructor() {
    this.initMap();
  }

  initMap() {
    this._map = L.map("map").setView([51.505, -0.09], 13);

    var osmUrl="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var osmAttrib="Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors";
    var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib});

    // start the map in South-East England
    this._map.setView( new L.LatLng(53, -1), 6 );
    this._map.addLayer( osm );
  }
}
