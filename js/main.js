'use strict';
var markers = [];
var locations = [];
var map = L.map('map');
const ZOOM_LEVEL_CRIT = 13;
// var markers = new L.layerGroup();
// handle success case


navigator.geolocation.getCurrentPosition(onSuccess, onError);
// map.setView([latitude,longitude],13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

map.on("moveend", () => {
    if (map.getZoom() >= ZOOM_LEVEL_CRIT) { // clearMarkers()
        loadAndDrawMarkers(map.getBounds().getNorth(), map.getBounds().getEast(), map.getBounds().getSouth(), map.getBounds().getWest())
    }
})
map.on("zoomend", () => {
    console.log(map.getZoom())
    if (map.getZoom() < ZOOM_LEVEL_CRIT) {
        clearMarkers()
    }
})
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {

        map.removeLayer(markers[i]);
    }
    markers.length = 0;
    locations = []

}
function draw() { // console.log(locations)

    locations.forEach((location, index, theArray) => {


        if (!location["drawn"]) {
            theArray[index]["drawn"] = true

            var Icon = new L.Icon({
                iconUrl: '/img/' + location["color"] + '_marker.png',
                shadowUrl: '/img/shadow.png',
                iconSize: [
                    25, 41
                ],
                iconAnchor: [
                    12, 41
                ],
                popupAnchor: [
                    1, -34
                ],
                shadowSize: [41, 41]
            });

            var marker = L.marker([
                location["location"].lat,
                location["location"].lon

            ], {icon: Icon})
            marker.bindPopup('<p>Material:' + location["location"].tags.material + '</p>');


            marker.on('click', () => {
                marker.openPopup()

            })

            markers.push(marker)
            marker.addTo(map);
        }
    })


}

function saveMarkers(data, color) {

    data.elements.forEach((location) => {

        if (! locations.some(e => e.location.id == location.id)) {
            locations.push({"location": location, "color": color, "drawn": false});

        }


    })


}
function loadAndDrawMarkers(northBound, eastBound, southBound, westBound) {

    var URL_PICNIC = "https://overpass-api.de/api/interpreter?data=[out:json];node[leisure=picnic_table][access!=customers](" + southBound + "," + westBound + "," + northBound + "," + eastBound + ");out;"
    var URL_TOURISM = "https://overpass-api.de/api/interpreter?data=[out:json];node[tourism=picnic_site](" + southBound + "," + westBound + "," + northBound + "," + eastBound + ");out;"

    fetch(URL_PICNIC).then((response) => response.json()).then((data) => {
        saveMarkers(data, "green")

        draw()

    });


    fetch(URL_TOURISM).then((response) => response.json()).then((data) => {
        saveMarkers(data, "blue")


        draw()

    });


}
function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    map.setView([
        latitude, longitude
    ], 13)
    loadAndDrawMarkers(map.getBounds().getNorth(), map.getBounds().getEast(), map.getBounds().getSouth(), map.getBounds().getWest())
}

// handle error case
function onError() {
    alert("Permission for Location denied")
    map.setView([
        49.0138882, 8.4184952
    ], 13) // secret tunnelrave position
    loadAndDrawMarkers(map.getBounds().getNorth(), map.getBounds().getEast(), map.getBounds().getSouth(), map.getBounds().getWest())

}
