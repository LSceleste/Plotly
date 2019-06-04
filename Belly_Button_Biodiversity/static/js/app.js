function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    const url = `/metadata/${sample}`;
    
    d3.json(url).then(function(metaData) {
      meta1 = d3.select("#sample-metadata");
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      meta1.html("");
      // Hint: Inside the loop, you will need to use d3 to append new
      meta1.append("h4").text(`Sample #: ${metaData.sample}`);
      meta1.append("h4").text(`Ethnicity: ${metaData.ETHNICITY}`);
      meta1.append("h4").text(`Gender: ${metaData.GENDER}`);
      meta1.append("h4").text(`Age: ${metaData.AGE}`);
      meta1.append("h4").text(`Location: ${metaData.LOCATION}`);
      meta1.append("h4").text(`BBType: ${metaData.BBTYPE}`);
      meta1.append("h4").text(`WFREQ: ${metaData.WFREQ}`);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then((data) => {
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;
    console.log(otu_ids,otu_labels,sample_values)
    // Build a Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
  });
   
  console.log("Plotting pie chart");

  d3.json(url).then(function(pieData) {

    // @TODO: Build a Bubble Chart using the sample data
//USE existing list of data 'pieData'.otu_ids for x, for y use otu_values with 'pieData'
    // @TODO: Build a Pie Chart
    chartPie = []
    for (let i = 0; i < pieData.otu_ids.length; i ++)
      {
        chartPie.push({otu_id : pieData.otu_ids[i],
                      sample_value : pieData.sample_values[i],
                      otu_label : pieData.otu_ids[i],

        });
      };
    chartPie2 = chartPie.sort(function (firtsNumber, secondNumber) {
      return (secondNumber.sample_value - firtsNumber.sample_value
        )});
    
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
     const chartData = chartPie2.slice(0,10);
    
     let plotOtu_id = []
     let plotSample_values = []
     let plotOtu_labels = []
     for (let i = 0; i < 10; i ++)
      {
        plotOtu_id.push(chartData[i].otu_id);
        plotSample_values.push(chartData[i].sample_value);
        plotOtu_labels.push(chartData[i].otu_label)
    };
    var trace1 = {
      labels: plotOtu_id,
      values: plotSample_values,
      type: 'pie'
    }; 
    var data = [trace1];
    var layout = {
      title: "Top 10 Species"
    };
    Plotly.newPlot("pie",data,layout);
});
}

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
  console.log(newSample)
}

// Initialize the dashboard
init();
