// var newYorkCoords = [40.73, -74.0059];
// var mapZoomLevel = 12;
// Creating map object

initMap();
var map;

function initMap()
{

  d3.select('#main-graph').selectAll('div').remove();
  var temp = d3.select('#main-graph').append('div').attr("id",'map-id').node();


  map = L.map(temp, {
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
    initPie();
}



function initPie() {
  var locations = []
  marker.eachLayer(m=>{
    if(map.getBounds().contains(m.getLatLng()))
      {locations.push(m.options.title);}
  });
  createPie(locations);
};


function createPie(locations)
{
  var counts = countLocations(locations);
  var labels = [];
  var values = [];
  

  
  var sortedData = sortProperties(counts)
  var slicedData = sortedData.slice(0, 10);
  

  slicedData.forEach(([key, value]) => {
    labels.push(key);
    values.push(value);
  });

  // var otherData = sortedData.slice(16);
  // var otherValue = 0
  // otherData.forEach(val => otherValue+=val[1]);
  // console.log(otherData);
  // console.log(otherValue);
  // if(otherValue)
  // {
  //   labels.push('other');
  //   values.push(otherValue);
  // }
    


  var data = [{
    values: values,
    labels: labels,
    type: 'pie',
  }];
  var layout = {
    title: 'Top 10 by location'
  }

  d3.select('#graph1').selectAll('div').remove();
  var temp = d3.select('#graph1').append('div').attr("id",'pie').node();

  Plotly.newPlot(temp, data,layout);

  temp.on('plotly_click', function(data){
        marker.clearLayers();
        readInfo(data.points[0].label);
      });
}

function countLocations(arr) {
  var counts = {};

  for (var i = 0; i < arr.length; i++) 
  {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

return counts;
}





function sortProperties(obj)  //returns Decending (b-a)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
	  return b[1]-a[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}




/////////////////////////////////////////
//////EVENT LISTENERS////////////////
///////////////////////////////////

d3.select('#clear_button').on('click', function()
{
  marker.clearLayers();
  readInfo();
});

map.on('zoomend', initPie);
map.on('move', initPie);

d3.select('#selection1').selectAll('p').on('click',function(){foo(this)});

function foo(obj)
{
  console.log(d3.select(obj).text());
}
