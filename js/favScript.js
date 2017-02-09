let favMap;

function initMap() {
    favMap = new google.maps.Map(document.getElementById('favMap'), {
        zoom: 12,
        center: new google.maps.LatLng(37.773972, -122.431285),
        mapTypeId: 'roadmap'
    });
}

function clearStorage(){
  const clear = document.getElementById('resetStorage');
  clear.addEventListener('click', function(){
    event.preventDefault();
    localStorage.clear();
    console.log("You have cleared your localStorage")
  });
}

function refreshPage(){
  const refresh = document.getElementById('refresh');
  refresh.addEventListener('click', function(){
    console.log("You have refreshed your localStorage!");
    window.location.reload()
  })
}

function favPageCreator() {
    const favTrucks = document.getElementById('favTruckList');
    let favTruckPageArr = JSON.parse(localStorage.fav);
    let loc = localStorage.loc;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${apiKey}`)
        .then(function(res3) {
            return res3.json()
        })
        .then(function(map2JSON) {
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
            for (let i = 0; i < favTruckPageArr.length; i++) {
                mapMaker(favMap, favTruckPageArr[i]);
            }
            for (let i = 0; i < favTruckPageArr.length; i++) {
                addToCollapse(favTruckPageArr[i], favTrucks);
            }
        })
}
setTimeout(function(){favPageCreator()}, 1000);
clearStorage();
refreshPage();
