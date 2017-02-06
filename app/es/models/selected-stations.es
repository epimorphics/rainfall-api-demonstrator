/* Model object to contain user's current selection of stations */
export class SelectedStations {
  constructor() {
    this.selectedRef = {};
  }

  isSelected(stationId) {
    return !!this.selectedRef[stationId];
  }

  setSelected(stationId, selected) {
    this.selectedRef[stationId] = selected;
  }
}

export { SelectedStations as default };
