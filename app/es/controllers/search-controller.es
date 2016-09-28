import {SelectedStations} from "../models/selected-stations.es";
import {SearchView} from "../views/search.es";
import {MapView} from "../views/map.es";
import {StationDetailsView} from "../views/station-details.es";
import {ApiDetailsView} from "../views/api-details.es";

/** Simple controller for displaying search/filter results */
export class SearchController {
  constructor() {
    this.models = {
      selected: new SelectedStations()
    };

    this.views = {
      searchView: new SearchView( this.models.selected ),
      mapView: new MapView( this.models.selected ),
      detailsView: new StationDetailsView(),
      apiDetailsView: new ApiDetailsView()
    };
  }
}
