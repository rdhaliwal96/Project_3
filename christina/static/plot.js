// function buildMetadata(sample) {

//     // @TODO: Complete the following function that builds the metadata panel
//     // Use `d3.json` to fetch the metadata for a sample  
//     d3.json("/api/v1.0/current-listings").then((response)=>{
//       // Use d3 to select the panel with id of `#sample-metadata`    
//       var panel=d3.select("#sample-metadata")
//       // Use `.html("") to clear any existing metadata
//       panel.html("");
//    // Use `Object.entries` to add each key and value pair to the panel    
//       Object.entries(response).forEach(([key,value])=>{
//         panel.append("h6").text(`${key}: ${value}`);
  
  
//       });
//       buildGauge(response.WFREQ);
//        // BONUS: Build the Gauge Chart
  
//     })
//   };
  
  
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
  
      // BONUS: Build the Gauge Chart
  
  
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then((response) => {
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).   
      var trace1={
        "type": "pie",
        "labels": response.otu_ids.slice(0,10),
        "values": response.sample_values.slice(0,10),
        "hovertext": response.otu_labels.slice(0,10)
  
      }
      var data=[trace1];
  
      Plotly.newPlot("pie", data);
  
  
      var trace2 = {
        "x": response.otu_ids,
        "y": response.sample_values,
        "mode": 'markers',
        "text": response.otu_labels,
        "marker": {
          "size": response.sample_values,
          "color": response.otu_ids}
      }
  
  
      var data2=[trace2];
      Plotly.newPlot("bubble", data2);
  
    });
  };
  
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  
  