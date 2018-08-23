// BEFORE CHROME WILL ALLOW THE GEOJSON LINK REFERENCED BELOW TO BE READ BY OUR SCRIPT,
// WE MUST VISIT THIS LINK
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US
// AND INSTALL THE PLUGIN
//
// WE SHOULD BE CAREFUL THAT THIS PLUGIN DOES NOT BREAK OTHER PARTS OF THE PROJECT,
// AS WHEN IT IS RUNNING IN MY BROWSER I AM UNABLE TO STREAM VIDEOS, FOR EXAMPLE

//US MAP, CENTERED
var map = L.map("map", {
  center: [38.09, -96.71],
  zoom: 5
});

// GeoJSON link
var link = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json";

// Assign color for each state
function chooseColor(NAME) {
  switch (NAME) {
  case "Alabama":                 return "green";
  case "Alaska":                  return "yellow";
  case "Arizona":                 return "red";
  case "Arkansas":                return "red";
  case "California":              return "blue";
  case "Colorado":                return "purple";
  case "Connecticut":             return "green";
  case "District of Columbia":    return "orange";
  case "Delaware":                return "blue";
  case "Florida":                 return "blue";
  case "Georgia":                 return "yellow";
  case "Hawaii":                  return "yellow";
  case "Idaho":                   return "purple";
  case "Illinois":                return "blue";
  case "Indiana":                 return "red";
  case "Iowa":                    return "green";
  case "Kansas":                  return "red";
  case "Kentucky":                return "yellow";
  case "Louisiana":               return "yellow";
  case "Maine":                   return "blue";
  case "Maryland":                return "yellow";
  case "Massachusetts":           return "yellow";
  case "Michigan":                return "green";
  case "Minnesota":               return "red";
  case "Mississippi":             return "purple";
  case "Missouri":                return "purple";
  case "Montana":                 return "blue";
  case "Nebraska":                return "yellow";
  case "Nevada":                  return "yellow";
  case "New Hampshire":           return "purple";
  case "New Jersey":              return "purple";
  case "New Mexico":              return "yellow";
  case "New York":                return "blue";
  case "North Carolina":          return "green";
  case "North Dakota":            return "green";
  case "Ohio":                    return "blue";
  case "Oklahoma":                return "green";
  case "Oregon":                  return "red";
  case "Pennsylvania":            return "red";
  case "Rhode Island":            return "red";
  case "South Carolina":          return "red";
  case "South Dakota":            return "purple";
  case "Tennessee":               return "blue";
  case "Texas":                   return "blue";
  case "Utah":                    return "green";
  case "Vermont":                 return "green";
  case "Virginia":                return "purple";
  case "Washington":              return "green";
  case "West Virginia":           return "green";
  case "Wisconsin":               return "yellow";
  case "Wyoming":                 return "red";
  default:                        return "blue";
  }
}

d3.json(link, function(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "black", //BORDER COLOR
        fillColor: chooseColor(feature.properties.NAME), //REFERENCE FUNCTION TO FILL STATE WITH DEFINED COLOR
        fillOpacity: 0.5,  //OPACITY
        weight: 0.5  //BORDER THICKNESS IN PIXELS
      };
    }
  }).addTo(map);
});