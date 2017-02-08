//JQuery for dropdown options and food truck list
$(document).ready(function() {
    $('select').material_select();
    $('.collapsible').collapsible()
  });

//Google Maps
let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(37.773972, -122.431285),
        mapTypeId: 'roadmap'
    });
}

//Placing all of the information on the map and setting it
function mapMaker(result) {
    let contentString = `<div class="truckMap"><h4 class="truckHeader">${result.name}</h4><p class="truckText">Address: ${result.address}</p></div>`;
    let latLng = new google.maps.LatLng(result.lat, result.lng);
    let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        icon: "imgs/foodtruckMarker.png"
    });
    let infowindow = new google.maps.InfoWindow({
        content: contentString,
        id: `${result.identifier}`
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    markers.push(marker)
    marker.setMap(map);
}

//Creating a class for all food trucks
class FoodTruck {
    constructor(lat, lng, name, description, day, start, end, address, identifier) {
        this.lat = lat;
        this.lng = lng;
        this.name = name;
        this.description = description;
        this.day = day;
        this.start = start;
        this.end = end;
        this.address = address;
        this.identifier = identifier
    }
}
// Creates the collapsing data
function addToCollapse(data) {
    let listItem = document.createElement('li');
    let icon = document.createElement('i');
    let body = document.createElement('div');
    let fullText = document.createElement('div');
    let street = document.createElement('p');
    let desc = document.createElement('p');
    let hours = document.createElement('p');
    icon.setAttribute('class', "material-icons");
    icon.innerHTML = "local_shipping";
    body.setAttribute('class', "collapsible-header");
    body.append(icon);
    body.innerText = `${data.name}`;
    fullText.setAttribute('class', "collapsible-body");
    street.innerHTML = `<b> ${data.address}</b>`;
    desc.innerHTML = `${data.description}`;
    hours.innerHTML = `Open from ${data.start} to ${data.end} every ${data.day}`;
    fullText.append(street);
    fullText.append(desc);
    fullText.append(hours);
    listItem.append(body);
    listItem.append(fullText);
    truckList.append(listItem);
}

//Distance Function: credit to http://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2) {
    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;
    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist *= 180 / Math.PI;
    dist *= 60 * 1.1515;
    return dist;
}

//Sets the zoom based on desired distance willing to walk
function zooming(input) {
    if (input === "0.2") {
        return zoomDistance = 16;
    } else if (input === "0.5") {
        return zoomDistance = 15;
    } else if (input === "1") {
        return zoomDistance = 14;
    } else if (input === "5000") {
        return zoomDistance = 12;
    }
}

function didntEnterDay(){
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let d = new Date();
  let n = d.getDay();
  return days[n]
}

//Program Function
function truckingAround() {
    const submitButton = document.getElementById("submit");
    const truckList = document.getElementById("truckList");
    const day = document.getElementById("dayOfWeek");
    let distanceFrom = document.getElementById("distanceField");
    const address = document.getElementById("address");

    submitButton.addEventListener('click', function() {
        event.preventDefault();
        if (address.value === "") {
            initMap()
            address.value = "1 Dr Carlton B Goodlett Pl"
        }
        if (day.value === "" ) {
          day.value = didntEnterDay()
        }
        if (distanceFrom.value ==="") {
          distanceFrom.value = "0.5"
        }
        const foodTruckArr = [];
        const filteredTrucks = [];
        let zoomDistance = zooming(distanceFrom.value)
        truckList.innerHTML = " ";
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}&key=${apiKey}`)
            .then(function(res1) {
                return res1.json()
            })
            .then(function(mapJSON) {
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: zoomDistance,
                    center: new google.maps.LatLng(mapJSON.results[0].geometry.location.lat, mapJSON.results[0].geometry.location.lng),
                    mapTypeId: 'roadmap'
                });
                let marker = new google.maps.Marker({
                    map: map,
                    icon: "imgs/home-2.png",
                    position: mapJSON.results[0].geometry.location,
                });
                return mapJSON.results[0].geometry.location
            })
            .then(function(coords) {
                fetch(`https://data.sfgov.org/resource/bbb8-hzi6.json?coldtruck=N&dayofweekstr=${day.value}`)
                    .then(function(res2) {
                        return res2.json()
                    })
                    .then(function(resJSON) {
                        for (let i = 0; i < resJSON.length; i++) {
                            let foodTruck = new FoodTruck(resJSON[i].latitude, resJSON[i].longitude, resJSON[i].applicant, resJSON[i].optionaltext, resJSON[i].dayofweekstr, resJSON[i].starttime, resJSON[i].endtime, resJSON[i].location, resJSON[i].permit)
                            foodTruckArr.push(foodTruck);
                        }

                        for (let i = 0; i < foodTruckArr.length; i++) {
                            if (distance(coords.lat, coords.lng, foodTruckArr[i].lat, foodTruckArr[i].lng) < Number(distanceFrom.value)) {
                                filteredTrucks.push(foodTruckArr[i])
                            }
                        }
                        filteredTrucks.sort(function(a, b) {
                            let nameA = a.name.toUpperCase();
                            let nameB = b.name.toUpperCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });

                        for (let i = 0; i < filteredTrucks.length; i++) {
                            mapMaker(filteredTrucks[i]);
                        }

                        for (let i = 0; i < filteredTrucks.length; i++) {
                            addToCollapse(filteredTrucks[i]);
                        }
                        console.log(markers[0].position.lng(), 'so much stuff')
                    })
            })
    })

}
truckingAround()
console.log("Location is defaulted to City Hall; Distance is defaulted to 0.5 Miles; and Day of Week is set defaulted to current day. If you search for out of SF your search will return no results as the data is only in SF (unless you do any anywhere search and you scroll back to SF)")
