import $ from "jquery";
import Typeahead from "typeahead";

/** Generic autocomplete component, based on jquery-ui's autocomplete */
export function autocomplete( selector, source, eventName ) {
  console.log( `starting autocomplete with ${selector}` );
  const elem = $(selector)[0];
  const ta = Typeahead( elem, {
    source: source
  } );
  return ta;
}
