// Google Maps --> USED VAR TO PREVENT ERROR WHEN LOADING IN NON-CHROME BROWSERS
var favMap;

function initMap() {
  favMap = new google.maps.Map(document.getElementById('favMap'), {
    zoom: 12,
    center: new google.maps.LatLng(37.773972, -122.431285),
    mapTypeId: 'roadmap'
  });
}

//Clearse storage and resets page
function clearStorage(){
  const clear = document.getElementById('resetStorage');

  clear.addEventListener('click', () => {
    event.preventDefault();
    localStorage.setItem('fav', JSON.stringify([]));
    setTimeout(() => { window.location.reload() }, 1000);
  });
}

//Function similar to getting trucks but this one sets it on the favorites page
function favPageCreator() {
  const favTrucks = document.getElementById('favTruckList');
  let favTruckPageArr = JSON.parse(localStorage.fav);
  const loc = localStorage.loc;

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${apiKey}`)
    .then((res3) => {
      return res3.json()
    })
      .then((map2JSON) => {
        favMap = new google.maps.Map(document.getElementById('favMap'), {
          zoom: 15,
          center: new google.maps.LatLng(map2JSON.results[0].geometry.location.lat, map2JSON.results[0].geometry.location.lng),
          mapTypeId: 'roadmap'
        });
        let marker = new google.maps.Marker({
          map: favMap,
          icon: "imgs/home-2.png",
          position: map2JSON.results[0].geometry.location
        });
        favTruckPageArr.sort( (a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
            return 0;
        });
        for (let i = 0; i < favTruckPageArr.length; i++) {
          mapMaker(favMap, favTruckPageArr[i]);
        }
        for (let i = 0; i < favTruckPageArr.length; i++) {
          addToCollapse(favTruckPageArr[i], favTrucks, favTruckPageArr, map2JSON.results[0].geometry.location, true);
        }
      })
}
setTimeout(() => {favPageCreator()}, 1000);
clearStorage();
