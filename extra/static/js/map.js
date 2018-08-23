function buildMap (route) {

    // Creating map object
    var map = L.map("map", {
        center: [39.50, -98.35],
        zoom: 11
    });

    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    }).addTo(map);

    var marker = L.marker([route.lat, route.lang]).addTo(map)
    marker.bindPopup(`${route.name}`);
}
//


function init() {
    // Grab a reference to the dropdown select element
    // var selector = d3.select("#selDataset")
    // var sample = selector.node().value
  
    // Use the list of sample names to populate the select options
    d3.json("/data").then((data) => {
      data.forEach((d) => {
        buildMap(d)
      });
    })
}


// Initialize the dashboard
init();