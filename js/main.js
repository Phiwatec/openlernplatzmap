var map = L.map('map').setView([50, 9], 13);
URL="https://overpass-api.de/api/interpreter?data=[out:json];node[leisure=picnic_table](49,5,50,6);out;"



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(URL)
  .then((response) => response.json())
  .then((data) =>data.elements.forEach(draw) );

function draw(table){
    L.marker([table.lat, table.lon]).addTo(map)
}