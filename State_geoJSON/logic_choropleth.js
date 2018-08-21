// BEFORE CHROME WILL ALLOW THE GEOJSON LINK REFERENCED BELOW TO BE READ BY OUR SCRIPT,
// WE MUST VISIT THIS LINK
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US
// AND INSTALL THE PLUGIN
//
// WE SHOULD BE CAREFUL THAT THIS PLUGIN DOES NOT BREAK OTHER PARTS OF THE PROJECT,
// AS WHEN IT IS RUNNING IN MY BROWSER I AM UNABLE TO STREAM VIDEOS, FOR EXAMPLE

//US MAP, CENTERED
var myMap = L.map("map", {
    center: [38.09, -96.71],
    zoom: 5
  });
  
// geoJSON Link
var url = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json";
  
var geojson;
  
d3.json(url, function(data) {
  
    // CREATING A NEW CHOROPLETH LAYER
    geojson = L.choropleth(data, {
      // Which property in the geoJSON features to use
      valueProperty: "STATE",
      // Color scale
      scale: ["lightblue", "blue"],
      // Number of breaks in step range
      steps: 8,
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: .5,
        fillOpacity: 0.6
      },
      
      // POPUP
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.NAME + ", State ID #" + feature.properties.STATE);
      }
    }).addTo(myMap);
  
    // SETTING UP THE LEGEND
    var valueProperty= "State ID"; // Legend title
  
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>" + valueProperty + "</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  
});
  