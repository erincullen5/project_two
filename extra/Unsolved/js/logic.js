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

readInfo();

function readInfo(selected ='')
{
  d3.csv(path, function(response)
  {
    if (!selected)
      {makeMap(response);}
    else
    {
      let mySelections = response.filter(d => d.name ===selected);
      makeMap(mySelections);
    }

  });
}

function makeMap(response)
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

}

map.on('zoomend', function() {
  var restraunts = []
  marker.eachLayer(m=>{
    if(map.getBounds().contains(m.getLatLng()))
      {restraunts.push(m.options.title);}
  });
  createPie(restraunts);
});


function createPie(restaurants)
{
  var counts = countRestaurants(restaurants);
  var values = [];
  var labels = [];

  

  Object.entries(counts).forEach(([key, value]) => {
    values.push(value);
    labels.push(key);
  });

  var data = [{
    values: values,
    labels: labels,
    type: 'pie'
  }];

  d3.select(graph1).append('div').attr("id",'pie');
  Plotly.newPlot('pie', data);

  var myPlot = document.getElementById('pie');
      myPlot.on('plotly_click', function(data){
        map.removeLayer(marker.eachLayer(m=>m));
        readInfo(data.points[0].label);
      });
}

function countRestaurants(arr) {
  var counts = {};

  for (var i = 0; i < arr.length; i++) 
  {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

return counts;
}