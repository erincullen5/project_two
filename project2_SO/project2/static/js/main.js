// Initial Params
var selectionLeft = "obesity";
var selectionRight = "Restaurant";

init();

function init() 
{
    // Grab a reference to the dropdown select element
    var selector = d3.selectAll(".select");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
                .append("p")
                .text(titleCase(sample))
                .attr("value", sample)
                .classed('default', true);
      });

    });

    d3.select('#selection1').select('.'+selectionLeft).classed('active',true);
    d3.select('#selection2').select('.'+selectionRight).classed('active',true);

    initMap();
    
    getDataStates('/data/' + selectionLeft, left);
    getDataPoints('/data/' + selectionRight, undefined,right);
    
}


function switchBoard(selection,side)   //directs user input to proper functions
{
  var value = d3.select(selection).attr('value');

  if (value !== selectionLeft && value !== selectionRight) 
  {
    setActive(selection,side)

    if(!checkTitleCase(selectionLeft) && !checkTitleCase(selectionRight))  //if both are plotByState
    {
      createScatter();
    }
    else
    {
      //createMap()
      var path = '/data/' + value;

      if(checkTitleCase(value))   //checks if it's plotBy points or state based capitalizatoin of first letter
      {
        getDataPoints(path, undefined,side)
      }
      else
      {
        getDataStates(path, side)
      }

    }
    
  }
}

function setActive(selection,side)
{
  d3.select( (side==='left'?'#selection1':'#selection2') )
    .selectAll('p')
    .classed('active',false);

  d3.select(selection).classed('active',true);

  (side==='left'?selectionLeft:selectionRight) = d3.select(this).attr('value');
}




function titleCase(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkTitleCase(string)   //if first letter of table is uppercase plotByPoint
{
  return (string.charAt(0) == string.charAt(0).toUpperCase())
}


/////////////////////////////////////////
//////EVENT LISTENERS///////////////////
///////////////////////////////////////

d3.select('#clear_button').on('click', function()
{
  markerLeft.clearLayers();
  markerRight.clearLayers();
  readInfo(undefined,'left');
  readInfo(undefined,'right');
});

map.on('zoomend', updatePie);
map.on('move', updatePie);



d3.select('#selection1').selectAll('p').on('click',function(){
  markerLeft.clearLayers();

  if(checkTitleCase(selectionLeft))
  {
    geojson.clearLayers();
    legend.remove();
  }

  switchBoard( this ,'left');
});



d3.select('#selection2').selectAll('p').on('click',function(){
  markerRight.clearLayers();

  if(checkTitleCase(selectionRight))
  {
    geojson.clearLayers();
    legend.remove();
  }

  switchBoard( this ,'right');
});