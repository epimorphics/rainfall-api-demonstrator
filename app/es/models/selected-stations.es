export class SelectedStations {
  constructor() {
    this._selected = {};
  }

  isSelected( stationId ) {
    return !!this._selected[stationId];
  }

  setSelected( stationId, selected ) {
    this._selected[stationId] = selected;
  }
}
