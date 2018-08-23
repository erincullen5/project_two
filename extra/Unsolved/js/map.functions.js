
////////////////////////////////////////////
////////GLOBAL MAP VARIABLES///////////////
///////////////////////////////////////////

var map;
var markerLeft = L.markerClusterGroup();
var markerRight = L.markerClusterGroup();
var geojson;
var legend;
  

  
function initMap()
{

  d3.select('#main-graph').selectAll('div').remove();
  var plottingPoint = d3.select('#main-graph').append('div').attr("id",'map-id').node();


  map = L.map(plottingPoint, {
    center: [39.8283, -98.5795],
    zoom: 4
  });
    

    
    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 20,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(map);
}




////////////FUNCTION TO READ IN JSON///////////////
//ALSO FILTERS BASED ON A SELECTED LOCATION NAME//
//////////////////////////////////////////////////
function getDataPoints(path, selected ='',side)
{
    d3.json(path, function(response)    //pulls data from database
    {
        if (!selected)
            {plotByPoint(response,side);}
        else
        {
            let mySelections = response.filter(d => d.name ===selected);
            plotByPoint(mySelections,side);
        }

    });
}

////////////FUNCTION TO READ IN JSON///////////////
///////AND CREATE GEOJSON FILE FOR STATES/////////
//////////////////////////////////////////////////
function getDataStates(path, side)
{
    var myObj={};

    var baseGeoJSON = "states.json";

    d3.json(path, function(response)       //pulls data from database
    {
        response.forEach(d=> myObj[d.state]=d.rate)

        createTable(myObj,side)
    });

    d3.json(baseGeoJSON , function(data)  //modifies geojson with our data
    {
        data.features.forEach(d=> d.properties['STATE'] = myObj[d.properties.NAME]);
    
        plotByState(data);
      
    });

}




  
function plotByPoint(markerData,side)
{

    // Loop through our data...
    markerData.forEach(d => {
    // set the data location property to a variable
    

    // If the data has a location property...
    if (d.latitude && d.longitude){

        var markerGroup = (side==='left'?markerLeft:markerRight);

        // Add a new marker to the cluster group and bind a pop-up
        markerGroup.addLayer(L.marker([d.latitude,d.longitude],{title:d.name})
        .bindPopup(d.name));
        }

    });

    // Add our marker cluster layer to the map
    map.addLayer(markerGroup);
}



function plotByState(rateData)
{
    // CREATING A NEW CHOROPLETH LAYER
    geojson = L.choropleth(rateData, {
        // Which property in the geoJSON features to use
        valueProperty: 'STATE',
        // Color scale
        scale: ["red", "green"],
        // Number of breaks in step range
        steps: 20,
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
    }).addTo(map);
    
    // SETTING UP THE LEGEND
    var valueProperty= "By State"; // Legend title

    legend = L.control({ position: "bottomleft" });
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
    legend.addTo(map);
}