function createScatter(selectionLeft,selectionRight){
    d3.select('#main-graph').select('div').remove();
    var plotpoint = d3.select('#main-graph').append('div').attr("id",'scatter').node();

    var url1 = "/data/" + selectionLeft;
    var url2 = "/data/" + selectionRight;

    Promise.all([d3.json(url1), d3.json(url2)]).then(response => {
        [xdata, ydata] = response;
        
        var data = [{
            x: xdata.map(d => d.rate),
            y: ydata.map(d => d.rate),
            type: 'scatter',
            mode: 'markers'
        }]
    
        var layout = {
            title: `${titleCase(selectionLeft)} vs ${titleCase(selectionRight)}`,
            xaxis: {
              title: `${titleCase(selectionLeft)}`
            },
            yaxis: {
              title: `${titleCase(selectionRight)}`
            }
          };
    
        Plotly.newPlot(plotpoint, data, layout);

    })
};




function updatePie()
{
    if(checkIfState(selectionLeft))
        {initPie('left');}
    if(checkIfState(selectionRight))
        {initPie('right');}
}


function initPie(side) {
    var markerGroup = side==='left'?markerLeft:markerRight;
    var locations = [];

    markerGroup.eachLayer(m=>{
      if(map.getBounds().contains(m.getLatLng()))
        {
            var markerObj ={};
            markerObj['name']=m.options.title;
            markerObj['latitude'] = m.getLatLng().lat;
            markerObj['longitude'] = m.getLatLng().lng;

            locations.push(markerObj)
        }
    });

    createPie(locations,side);
};
  
  
function createPie(locations,side)
{
    var counts = countLocations(locations.map(d=>d.name));
    var labels = [];
    var values = [];

    var tag = side==='left'?'#graph1':'#graph2';
    var markerGroup = side==='left'?markerLeft:markerRight;



    var sortedData = sortProperties(counts);
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


    d3.select(tag).selectAll('div').remove();
    var plottingPoint = d3.select(tag).append('div').attr("id",'pie').node();

    Plotly.newPlot(plottingPoint, data,layout);

    plottingPoint.on('plotly_click', function(data){
    
        markerGroup.clearLayers();
        getDataPoints(undefined,locations.filter(l=>l.name === data.points[0].label),side);
    });
}


function createTable(myObj,side)
{
    
    var tag = side==='left'?'#graph1':'#graph2';
    var selection = side==='left'?selectionLeft:selectionRight;

    d3.select(tag).selectAll('div').remove();
    var plottingPoint = d3.select(tag).append('div').attr("id",'table');
    var table = plottingPoint.append('table').classed('table',true).classed('table-striped',true);
    

    var tableHead = table.append('thead').append('tr');
    tableHead.append('th').text('State').classed('table-head',true);
    tableHead.append('th').text(`${titleCase(selection)}`).classed('table-head',true);
    var tableBody = table.append('tbody');

    var sortedData = sortProperties(myObj);
    var slicedData = sortedData.slice(0,10);

    slicedData.forEach((element) => {
        var row = tableBody.append("tr");
        row.append("td").text(element[0]);
        row.append('td').text(element[1]);
        }); 

}


function countLocations(arr) 
{
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