//init function for reading in dataset from json
function init() {
    // get a reference to our dropdown input
    var dropdown = d3.select("#selDataset");

    // load data
    d3.json("samples.json").then((data)=> {
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
		
		//initialize with first item selected
		drawCharts(data.names[0]);
		createInfo(data.names[0]);
    })
	;
}

// This function will draw the bar and bubble charts
function drawCharts(id) {
	//Read data
    d3.json("samples.json").then (sampledata =>{
        var ids = sampledata.samples[0].otu_ids;
        var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
        var labels =  sampledata.samples[0].otu_labels.slice(0,10);

        var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d);
        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'blue'},
            type:"bar",
            orientation: "h",
        };
        var data = [trace];
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 30
            }
        };

        // create the bar chart
		Plotly.newPlot("bar", data, layout);

        // The bubble chart
        var trace1 = {
            x: sampledata.samples[0].otu_ids,
            y: sampledata.samples[0].sample_values,
            mode: "markers",
            marker: {
                size: sampledata.samples[0].sample_values,
                color: sampledata.samples[0].otu_ids
            },
            text:  sampledata.samples[0].otu_labels

        };

        // set the layout for the bubble plot
        var layout_2 = {
            xaxis:{title: "OTU ID"},
            height: 640,
            width: 1280
        };

        // creating data variable 
        var data1 = [trace1];

		// create the bubble plot
		Plotly.newPlot("bubble", data1, layout_2); 
    });
}  
// get the demographic information for selected item
function createInfo(id) {
	//read the data
    d3.json("samples.json").then((data)=> {

       var metadata = data.metadata;
       var result = metadata.filter(meta => meta.id.toString() === id)[0];
       var demographicInfo = d3.select("#sample-metadata");
       demographicInfo.html("");
       Object.entries(result).forEach((key) => {   
		demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
       });
    });
}

// function to be called when item is selected
function optionChanged(id) {
    drawCharts(id);
    createInfo(id);
}



init();