//Program Function
function truckingAround() {
    const submitButton = document.getElementById("submit");
    const truckList = document.getElementById("truckList");
    const day = document.getElementById("dayOfWeek");
    const distanceFrom = document.getElementById("distanceField");
    const address = document.getElementById("address");
    let favTruckArr =[];


    submitButton.addEventListener('click', function() {
        event.preventDefault();
        const foodTruckArr = [];
        const filteredTrucks = [];
        if (address.value === "") {
            address.value = "1 Dr Carlton B Goodlett Pl";
        }
        if (day.value === "" ) {
          day.value = didntEnterDay();
        }
        if (distanceFrom.value === "") {
          distanceFrom.value = "0.5"
        }
        if (localStorage.fav !== undefined) {
          favTruckArr = JSON.parse(localStorage.fav)
        }
        localStorage.setItem('loc', address.value);
        let currAddress = localStorage.loc;
        let zoomDistance = zooming(distanceFrom.value);
        truckList.innerHTML = " ";
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${currAddress}&key=${apiKey}`)
            .then( (res1) => {
                return res1.json()
            })
            .then( (mapJSON) => {
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
            .then( (coords) => {
                fetch(`https://data.sfgov.org/resource/bbb8-hzi6.json?coldtruck=N&dayofweekstr=${day.value}`)
                    .then(function(res2) {
                        return res2.json()
                    })
                    .then( (resJSON) => {
                        for (let i = 0; i < resJSON.length; i++) {
                            let foodTruck = new FoodTruck(resJSON[i].latitude, resJSON[i].longitude, resJSON[i].applicant, resJSON[i].optionaltext, resJSON[i].dayofweekstr, resJSON[i].starttime, resJSON[i].endtime, resJSON[i].location, resJSON[i].permit)
                            foodTruckArr.push(foodTruck);
                        }

                        for (let i = 0; i < foodTruckArr.length; i++) {
                            if (distance(coords.lat, coords.lng, foodTruckArr[i].lat, foodTruckArr[i].lng) < Number(distanceFrom.value)) {
                                filteredTrucks.push(foodTruckArr[i])
                            }
                        }
                        filteredTrucks.sort( (a, b) => {
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
                            mapMaker(map, filteredTrucks[i]);
                        }

                        for (let i = 0; i < filteredTrucks.length; i++) {
                            addToCollapse(filteredTrucks[i], truckList, favTruckArr, coords);
                        }
                        if (filteredTrucks.length === 0){
                        Materialize.toast('Sorry no food trucks in range! Please search again to find your hunger', 4000)
                      }
                    })
            })
    })

}
truckingAround()
