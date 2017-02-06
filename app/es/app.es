import $ from 'jquery';

import UserPreferences from './services/user-preferences.es';
import { SearchController } from './controllers/search-controller.es';

require('babel-polyfill');

$(() => {
  UserPreferences.currentPreference();
  return new SearchController();
});
