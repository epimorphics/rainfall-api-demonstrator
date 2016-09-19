import $ from "jquery";
import {allStations} from "./services/rainfall-api.es";
import {UserPreferences} from "./services/user-preferences.es";

console.log("starting app.es");

$(() => {
  let userPreferences = UserPreferences.currentPreference();
});
