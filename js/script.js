//JQuery for dropdown options and food truck list
$(document).ready(function() {
    $('select').material_select();
    $('.collapsible').collapsible();
  });

//Google Maps
let map;

//Favorites
let favTruckArr = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(37.773972, -122.431285),
        mapTypeId: 'roadmap'
    });
}

//Placing all of the information on the map and setting it
function mapMaker(whichMap,result) {
    let contentString = `<div class="truckMap"><h4 class="truckHeader">${result.name}</h4><p class="truckText">Address: ${result.address}</p></div>`;
    let latLng = new google.maps.LatLng(result.lat, result.lng);
    let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        icon: "imgs/foodtruckMarker.png"
    });
    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    marker.addListener('click', function() {
        infowindow.open(whichMap, marker);
    });
    // google.maps.event.addListener(map, 'mousemove', function (event) {
    //   infowindow.close();
    // });
    marker.setMap(whichMap);
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
function remover(arr, data){
  if (arr.indexOf(data) !== -1) {
    let x = arr.indexOf(data)
      arr.splice(x,1)
    }
    return arr
  }

// Creates the collapsing data
function addToCollapse(data, docAppend, arr, geodist) {
    let clicks = 0;
    let listItem = document.createElement('li');
    let body = document.createElement('div');
    let fullText = document.createElement('div');
    let street = document.createElement('p');
    let desc = document.createElement('p');
    let hours = document.createElement('p');
    let favButton = document.createElement('button');
    let removeButton = document.createElement('button');
    let distTo = document.createElement('p');
    body.setAttribute('class', "collapsible-header");
    body.innerText = `${data.name}`;
    fullText.setAttribute('class', "collapsible-body");
    street.innerHTML = `<b> ${data.address}</b>`;
    desc.innerHTML = `${data.description}`;
    hours.innerHTML = `Open from ${data.start} to ${data.end} every ${data.day}`;
    distTo.innerHTML = `You are ${Number(distance(geodist.lat, geodist.lng, data.lat, data.lng)).toFixed(3)} miles away from ${data.name}`
    favButton.setAttribute('class', "btn small waves-effect waves-light red listButton");
    favButton.innerHTML = 'Add to Favorites <i class="material-icons">add_box</i>';
    favButton.addEventListener('click', function(){
      if (favTruckArr.indexOf(data) === -1) {
        favTruckArr.push(data);
        localStorage.setItem('fav', JSON.stringify(arr));
      }
    });
    removeButton.setAttribute('class', "btn small waves-effect waves-light red listButton");
    removeButton.innerHTML = 'Remove from Favorites <i class="material-icons">delete</i>';
    removeButton.addEventListener('click', function(){
      remover(arr, data);
      localStorage.setItem('fav', JSON.stringify(arr));
    })
    fullText.append(street);
    fullText.append(desc);
    fullText.append(hours);
    fullText.append(distTo);
    fullText.append(favButton);
    fullText.append(removeButton);
    listItem.append(body);
    listItem.append(fullText);
    docAppend.append(listItem);
}

//Sets the zoom based on desired distance willing to walk
function zooming(input) {
    if (input === "0.2") {
        return zoomDistance = 16;
    } else if (input === "0.5") {
        return zoomDistance = 15;
    } else if (input === "1" || input === "0.75") {
        return zoomDistance = 14;
    } else if (input === "1.5") {
        return zoomDistance = 13;
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
console.log("Location is defaulted to City Hall; Distance is defaulted to 0.5 Miles; and Day of Week is set defaulted to current day. If you search for out of SF your search will return no results as the data is only in SF (unless you do any anywhere search and you scroll back to SF)")
