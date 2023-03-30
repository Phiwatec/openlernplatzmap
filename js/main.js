


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
    URL="https://overpass-api.de/api/interpreter?data=[out:json];node[leisure=picnic_table]("+(latitude-OFFSET)+","+(longitude-OFFSET)+","+(latitude+OFFSET)+","+(longitude+OFFSET)+");out;"
    console.log(URL)
    
  fetch(URL)
  .then((response) => response.json())
  .then((data) =>data.elements.forEach(draw) );


}

// handle error case
function onError() {
    alert("Error")
   
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function draw(table){
  L.marker([table.lat, table.lon]).addTo(map)
}
