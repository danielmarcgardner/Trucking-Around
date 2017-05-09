# Trucking-Around - Galvanize Q1 Project

Trucking Around is deployed: http://truckingaround.surge.sh/

Rather than searching through twitter or facebook for updates on trucks, Trucking Around lets users search by location in SF using distance and day of the week filters. The search returns the trucks on the map as well as a side panel where users can get more information about the trucks, add and remove favorites, as well as get directions to the truck.

Trucking Around uses the Google Maps API and SF Open Data (for Food Trucks). Trucking Around uses  'fetch' to get the geocoded data from Google Maps followed by chained .then() methods to a 'fetch' to get the data from SF Open Data with a day of the week endpoint. The data then passes through a distance filter to return the trucks within the given distance. To create favorites Trucking Around takes advantage of localStorage to store the favorites in an array. localStorage is also used for finding directions. The recently searched address gets saved into storage and when the directions button is clicked the truck address is also saved to localStorage. The data is then passed into the google map directions. Trucking Around uses a polyfill for 'fetch' so it works on all browsers even where 'fetch' is not supported natively.

# Getting Started
1. Fork and Clone this repo.
2. Register for [Google Maps API Keys](https://developers.google.com/maps/documentation/javascript/get-api-key).
3. Create an apikeys.js file. The file should look like this:
```
const apiKey = xxxxx
```
4. `open index.html` to run locally.
5. Find something good to eat in San Francisco!
