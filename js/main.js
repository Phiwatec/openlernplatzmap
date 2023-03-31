
navigator.geolocation.getCurrentPosition(onSuccess, onError);
var map = L.map('map').setView([50, 9], 13);


// handle success case
function onSuccess(position) {
    const {
        latitude,
        longitude
    } = position.coords;
    map.setView([latitude,longitude],13)
    OFFSET=0.2
   


}

function loadAndDrawMarkers(northBound, eastBound, southBound, westBound) {

    URL_PICNIC = "https://overpass-api.de/api/interpreter?data=[out:json];node[leisure=picnic_table][access!=customers]("+southBound+","+westBound+","+northBound+","+eastBound+");out;"
    URL_TOURISM = "https://overpass-api.de/api/interpreter?data=[out:json];node[tourism=picnic_site]("+southBound+","+westBound+","+northBound+","+eastBound+");out;"
    
    fetch(URL_PICNIC)
    .then((response) => response.json())
    .then((data) =>data.elements.forEach(draw) );

    fetch(URL_TOURISM)
    .then((response) => response.json())
    .then((data) =>data.elements.forEach(drawGreen) );
}

// handle error case
function onError() {
    alert("Error")
   
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function draw(table){
  L.marker([table.lat, table.lon]).addTo(map);
}

function drawGreen(table) {
    L.marker([table.lat, table.lon]{icon: greenIcon}).addTo(map);
}
