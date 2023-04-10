'use strict';
var markers=[] ;
var map = L.map('map');
const ZOOM_LEVEL_CRIT=13;
//var markers = new L.layerGroup();
// handle success case
function onSuccess(position) {
    const {
        latitude,
        longitude
    } = position.coords;
    map.setView([latitude,longitude],13)
    loadAndDrawMarkers(map.getBounds().getNorth(), map.getBounds().getEast(), 
        map.getBounds().getSouth(), map.getBounds().getWest())
}

// handle error case
function onError() {
    alert("Error")
   
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);
// map.setView([latitude,longitude],13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on("moveend", ()=> {
  if (map.getZoom() >=  ZOOM_LEVEL_CRIT ){
    loadAndDrawMarkers(map.getBounds().getNorth(), map.getBounds().getEast(), 
    map.getBounds().getSouth(), map.getBounds().getWest())
  }
})
map.on("zoomend", ()=>{
  console.log(map.getZoom())
  if (map.getZoom() <  ZOOM_LEVEL_CRIT ){
    
    for(var i = 0; i < markers.length; i++){
      
      map.removeLayer(markers[i]);
  }
  markers.length = 0;
  }
})

function draw(table){
  var marker=L.marker([table.lat, table.lon])
    markers.push(marker)
    marker.addTo(map);
}

function loadAndDrawMarkers(northBound, eastBound, southBound, westBound) {

    var URL_PICNIC = "https://overpass-api.de/api/interpreter?data=[out:json];node[leisure=picnic_table][access!=customers]("+southBound+","+westBound+","+northBound+","+eastBound+");out;"
    var URL_TOURISM = "https://overpass-api.de/api/interpreter?data=[out:json];node[tourism=picnic_site]("+southBound+","+westBound+","+northBound+","+eastBound+");out;"
    
    fetch(URL_PICNIC)
    .then((response) => response.json())
    .then((data) =>data.elements.forEach(draw) );

    fetch(URL_TOURISM)
    .then((response) => response.json())
    .then((data) =>data.elements.forEach(drawGreen) );
}

function drawGreen(table) {
  
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var marker=L.marker([table.lat, table.lon],{icon: greenIcon})
    markers.push(marker)
    marker.addTo(map);
    
}
