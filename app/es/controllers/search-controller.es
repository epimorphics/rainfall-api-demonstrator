import {autocomplete} from "../views/autocomplete.es";
import {stationsCollection, riverNames, catchmentNames} from "../models/stations.es";

/** Simple controller for displaying search/filter results */
export class SearchController {
  constructor() {
    this.initialiseTypeaheads();
  }

  initialiseTypeaheads() {
    riverNames().then( names => {
      autocomplete( "#riverName", names, "search-river-name" );
    } );

    catchmentNames().then( names => {
      autocomplete( "#catchmentName", names, "search-catchment-name" );
    } );
  }
}
