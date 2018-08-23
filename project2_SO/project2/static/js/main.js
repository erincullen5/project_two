// Initial Params
var selectionLeft = "obesity";
var selectionRight = "fastfood";

init();

function init() 
{
    // Grab a reference to the dropdown select element
    var selector = d3.selectAll(".select");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then( function(sampleNames)  {
      sampleNames.forEach( (sample) =>
      {
        Object.entries(sample).forEach( ([key, value])=>
        {
          selector
                  .append("p")
                  .text(titleCase(key))
                  .attr("value", value)
                  .attr("id", key)
                  .classed('default', true);
        });
      });

      callEvent();

      d3.select('#selection1').select('#'+selectionLeft).classed('active',true);
      d3.select('#selection2').select('#'+selectionRight).classed('active',true);

      
      getDataStates('/data/' + selectionLeft, 'left');
      getDataPoints('/data/' + selectionRight, undefined,'right');

    });

    initMap();
    
    
}


function switchBoard(selection,side)   //directs user input to proper functions
{
  var value = d3.select(selection).attr('id');
  
  if (value !== selectionLeft && value !== selectionRight) 
  {

    setActive(selection,side)

    if(!checkIfState(selectionLeft) && !checkIfState(selectionRight))  //if both are plotByState
    {
      createScatter(selectionLeft,selectionRight);   ///inside plotly.function.js
    }
    else
    {
      initMap();
      var path = '/data/' + value;

      if(checkIfState(value))   //checks if it's plotBy points or state based capitalizatoin of first letter
      {
        getDataPoints(path, undefined,side)
      }
      else
      {
        getDataStates(path, side)
      }

    }
    
  }
  if(side==='left')
  {
    markerLeft.clearLayers();

    if(checkIfState(selectionLeft))
    {
      geojson.clearLayers();
      legend.remove();
    }
  }
  else
  {
    markerRight.clearLayers();

    if(checkIfState(selectionRight))
    {
      geojson.clearLayers();
      legend.remove();
    }
  }



}

function setActive(selection,side)
{
  d3.select( side==='left'?'#selection1':'#selection2' )
    .selectAll('p')
    .classed('active',false);

  d3.select(selection).classed('active',true);

  if(side==='left')
  {
    selectionLeft= d3.select(selection).attr('id');
  }
  else
  {
    selectionRight = d3.select(selection).attr('id');
  }
}




function titleCase(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkIfState(selection)
{
  // var mapping = {
  //   fastfood: false,
  //   gyms: false,
  //   obesity: true,
  //   population: true,
  //   poverty: true,
  // }
  
  // return mapping[string.toLowerCase()];

  return !(d3.select('#'+selection).attr('value'));

}


/////////////////////////////////////////
//////EVENT LISTENERS///////////////////
///////////////////////////////////////



function callEvent()
{
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
    switchBoard( this ,'left')});

  d3.select('#selection2').selectAll('p').on('click',function(){
    switchBoard( this ,'right')});

}