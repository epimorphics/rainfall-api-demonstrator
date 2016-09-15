/** Encapsulates an immutable value returned from the API representing a station */
export class Station {
  constructor( json ) {
    this.json = json;
  }

  uri() {
    return this.json["@id"];
  }
}
