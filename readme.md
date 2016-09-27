# Rainfall API demonstrator

The Environment Agency publish a range of linked open datasets, including readings from rainfall gauges around England. Current and historical data from these gaages is availble via an [API](http://environment.data.gov.uk/flood-monitoring/doc/rainfall).

For reference purposes, this application illustrates the incorporation of data from the rainfall gauge API into a simple JavaScript web application.

## Application features

  * Search for rainfall stations by name
  * Search for rainfall stations near to a postcode in England
  * browse a map of England to find rainfall stations
  * select one or more stations via the map or via the search facility
  * for each selected station, present key information from the underlying linked data, show the latest rainfall reading, and show a graph of cumulative rainfall over the previous month
  * provide a cheat-sheet of example API endpoints for features of a given station

Todo add screenshot

## Code layout

An aim of this project was to make the code accessible to as large an audience as possible. For that reason, we chose *not* to use any of the currently in-vogue client-side frameworks such as Angular, Ember or React. Arguably any one of those would have made the code more compact by abstracting away low-level details. However, the resulting application would then only be accessible to people who know that framework (or want to learn it).

Roughly speaking, we follow an MVC pattern for the application:

  * `app/es/controllers` hosts the single controller that is responsible for instantiating the view components.
  * `app/es/views` hosts for the main operating components of the application: textual search, map search, listing station details, displaying rainfall graphs and the endpoints suggestion dialogue.
  * `/app/es/models` contain value-object wrappers that mostly provide a convenience API around the JSON values returned from the API
  * `/app/es/services` contain service objects that provide a JavaScript API for the HTTP APIs available from the rainfall API itself, and the postcode lookup service which resolves postcodes in England to WGS84 (i.e. latitude/longitude) points.

CSS is built from a single Sass file `app/scss/app.scss`. This file `@import`s the other stylesheets for the application, and supporting stylesheets from libraries in `node_modules`.

HTML code is built from page files in `app/pages`, which pulls in component layouts and partials from `app/templates` and `app/templates/partials` respectively.

## Build tools

The app is built using [gulp](http://gulpjs.com/). To see the various build targets, from the command line do:

    gulp -T

Commonly useful targets include:

  * `build:clean` to remove previously built artefacts from `./build`
  * `build` to rebuild all of the HTML, JavaScript and CSS code
  * `test:unit` to run unit tests
  * `test:functional-and-cleanup` to run integration tests via Selenium (and then close the Selenium process)
  * `watch` to start a local development server on `localhost:3000`, and automatically watch for code changes and update the running application.

# Contributing

The primary purpose of this application is to demonstrate the API endpoints in use. You are encouraged to fork this repo and copy code to the degree that it is useful. You are also welcome to submit pull-requests with updates or bug-fixes. Significant extensions to the functionality of this application will be considered, but please note that the main aim is to keep the app simple for demonstration purposes. If you want to make significant extensions, you're probably best to create a new project based on this app.

## Code of conduct

We endorse the [code of conduct](CODE_OF_CONDUCT) for open-source projects and contributors.

# License

> Copyright (c) 2016 Environment Agency

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Data published via the Rainfall API is available under the [Open Government License](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
