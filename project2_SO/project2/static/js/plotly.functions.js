function createScatter(selectionLeft,selectionRight){
    d3.select('#main-graph').select('div').remove();
    var plotpoint = d3.select('#main-graph').append('div').attr("id",'scatter').node();

    var url1 = "/data/poverty"
    var url2 = "/data/obesity"
    var xdata = ''
    var ydata = ''

    d3.json(url1, function(response){
        console.log(response)
       xdata  = [response]
    });

    d3.json(url2, function(response){
        console.log(response)
        ydata = [response]
    });

    var data = [{
        x: xdata,
        y: ydata,
        type: 'scatter',
    }]

    var layout = {
        title: "${selectionLeft} vs ${selectionRight}",
        xaxis: {
          title: "${selectionLeft}"
        },
        yaxis: {
          title: "${selectionRight}"
        }
      };

    Plotly.newPlot(plotpoint, data, layout);
};

createScatter('Obesity','Poverty')



function updatePie()
{
    initPie('left');
    initPie('right');
}


function initPie(side) {
    var markerGroup = side==='left'?markerLeft:markerRight;
    var locations = []

    markerGroup.eachLayer(m=>{
      if(map.getBounds().contains(m.getLatLng()))
        {locations.push(m.options.title);}
    });
    createPie(locations,side);
};
  
  
function createPie(locations,side)
{
    var counts = countLocations(locations);
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

            var path = '/data/' + side==='left'?selectionLeft:selectionRight;

            getDataPoints(path,data.points[0].label,side);
        });
}


function createTable(myObj,path,side)
{
    var tag = side==='left'?'#graph1':'#graph2';

    d3.select(tag).selectAll('div').remove();
    var plottingPoint = d3.select(tag).append('div').attr("id",'table');

    var sortedData = sortProperties(myObj);
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