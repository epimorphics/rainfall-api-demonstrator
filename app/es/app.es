import $ from "jquery";
import _ from "lodash";

import {UserPreferences} from "./services/user-preferences.es";
import {SearchController} from "./controllers/search-controller.es";

console.log("starting app.es");

$(() => {
  let userPreferences = UserPreferences.currentPreference();
  let searchController = new SearchController();
});
