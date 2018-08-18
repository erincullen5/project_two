// var newYorkCoords = [40.73, -74.0059];
// var mapZoomLevel = 12;
// Creating map object
var map = L.map("map-id", {
    center: [40.7128, -74.0059],
    zoom: 15
  });
  

  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);

var path = 'FastFoodRestaurants.csv';

var marker = L.markerClusterGroup();
d3.csv(path, function(response)
{
    
    

    // Loop through our data...
    response.forEach(d => {
    // set the data location property to a variable
    

    // If the data has a location property...
    if (d.latitude && d.longitude){

        // Add a new marker to the cluster group and bind a pop-up
        marker.addLayer(L.marker([d.latitude,d.longitude],{title:d.name})
        .bindPopup(d.name));
        }

    });

    // Add our marker cluster layer to the map
    map.addLayer(marker);

});

map.on('zoomend', function() {
  marker.eachLayer(m=>{
    if(map.getBounds().contains(m.getLatLng()))
      {console.log(m.options.title);}
  });
});





// Building API query URL
var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
var date = "$where=created_date between'2016-01-10T12:00:00' and '2017-01-01T14:00:00'";
var complaint = "&complaint_type=Rodent";
var limit = "&$limit=10000";

// Assembling API query URL
var url = baseURL + date + complaint + limit;

// Grabbing the data with d3..
d3.json(url, function(response) {

  // Creating a new marker cluster group
    var markers = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>',iconSize:40 });
        }
    });

  // Loop through our data...
  for (var i = 0; i < response.length; i++) {
    // set the data location property to a variable
    var location = response[i].location;

    // If the data has a location property...
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(response[i].descriptor));
    }

  }

  // Add our marker cluster layer to the map
  map.addLayer(markers);

});