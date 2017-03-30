/* eslint no-param-reassign: ["error", { "props": false }] */

import L from 'leaflet';
import _ from 'lodash';
import $ from 'jquery';
import { stationsCollection } from '../models/stations.es';

require('leaflet.markercluster');

/* Support functions */

/* Return the marker for a selected site */
function selectedMarkerIcon() {
  return L.Icon.Default.extend({
    options: {
      iconUrl: 'marker-icon-selected.png',
    },
  });
}

/* Return the marker for a site by status */
function markerIconForStatus(selected) {
  return selected ? new (selectedMarkerIcon())() : new L.Icon.Default();
}

/** Notify other components that the selection state has changed */
function triggerSelected(stationId, selected) {
  $('body').trigger('rainfall-demo.selected', [stationId, selected]);
}

/** Select the given marker */
function selectMarker(marker, selected, noTrigger) {
  if (marker.options.selected !== selected) {
    marker.options.selected = selected;
    marker.setIcon(markerIconForStatus(selected));
    if (!noTrigger) {
      triggerSelected(marker.options.stationId, selected);
    }
  }
}


class MapView {
  constructor(selectedStations) {
    this.selectedStationsRef = selectedStations;
    this.initMap();
    this.addStationMarkers();
    this.initEvents();
  }

  initMap() {
    this.mapRef = L.map('map').setView([51.505, -0.09], 13);

    const osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = "Map data © <a href='//openstreetmap.org'>OpenStreetMap</a> contributors";
    const osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 12, attribution: osmAttrib });

    // start the map in South-East England
    this.mapRef.setView(new L.LatLng(53, -1), 6);
    this.mapRef.addLayer(osm);

    // marker images path
    L.Icon.Default.imagePath = 'images/';
  }

  initEvents() {
    $('body').on('rainfall-demo.selected', _.bind(this.onStationSelected, this));
  }

  addStationMarkers() {
    const createMarkerFn = _.bind(this.createMarkerFor, this);
    const map = this.mapRef;

    stationsCollection().then((stations) => {
      const markers = [];

      _.each(stations, (station) => {
        if (station.locationWgs84().isDefined()) {
          markers.push(createMarkerFn(station));
        }
      });

      const markersGroup = L.markerClusterGroup();
      markersGroup.addLayers(markers);
      map.addLayer(markersGroup);
    });
  }

  createMarkerFor(station) {
    const icon = this.markerIcon(station);
    const marker = L.marker(station.locationWgs84().asLatLng(), {
      icon,
      title: station.label(),
      stationId: station.notation(),
      selected: false,
    });

    marker.on('click', _.bind(this.onMarkerClick, this));
    return marker;
  }

  markerIcon(station) {
    return markerIconForStatus(
      this.selectedStationsRef.isSelected(station),
   );
  }

  onMarkerClick(e) {
    const marker = e.target;
    const stationId = marker.options.stationId;
    const nowSelected = !this.selectedStationsRef.isSelected(stationId);
    this.selectedStationsRef.setSelected(stationId, nowSelected);
    selectMarker(marker, nowSelected);
  }

  // events

  /** Ensure that map marker status stays in sync with selection status from other components */
  onStationSelected(event, stationId, selected) {
    const selectMarkerFn = _.bind(selectMarker, this);

    this.mapRef.eachLayer((layer) => {
      if (layer.options.stationId === stationId && layer.options.selected !== selected) {
        selectMarkerFn(layer, selected, true);
      }
    });
  }
}

export { MapView as default };
