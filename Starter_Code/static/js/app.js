// URL to JSON 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to populate the dropdown with sample IDs
function populateDropdown(sampleIds) {
    var dropdown = d3.select("#selDataset");
  
    // Clear existing options
    dropdown.html("");
  
    // Add options for each sample ID
    sampleIds.forEach(function(sampleId) {
      dropdown.append("option").text(sampleId).property("value", sampleId);
    });
  
    // Set the default selected value
    var defaultSampleId = sampleIds[0];
    optionChanged(defaultSampleId); // Trigger the initial data load
  }
  
  // Function to handle dropdown selection change
  function optionChanged(selectedSample) {
    // Fetch data for the selected sample and update charts
    d3.json(url).then(function(data) {
      console.log(`Selected Sample ID: ${selectedSample}`);
  
      // Call other functions with the selected sample data
      // barChart(getSampleData(data.samples, selectedSample));
      // bubbleChart(getSampleData(data.samples, selectedSample));
      // demographicInfo(getSampleMetadata(data.metadata, selectedSample));
    });
  }  
  
  
  // Function to fill the demographic info panel
  function demographicInfo(metadata) {
      
    // Select the panel element by ID
    var panel = d3.select("#sample-metadata");
  
    // Clear existing content
    panel.html("");
    
  // Check if metadata is defined before iterating over it
    if (metadata) {
      // Iterate through each key-value pair
      Object.entries(metadata).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
    } else {
      panel.append("p").text("Demographic information not available for this sample.");
    }
  }
  
  // Function to filter for top ten OTUs
  function topTen(sample) {
    var sample_values = sample.sample_values;
    var otu_ids = sample.otu_ids;
    var otu_labels = sample.otu_labels;
    // Add your logic here to filter the top ten OTUs
    // Example: Sort the arrays and get the first ten elements
    var sortedData = [...Array(sample_values.length).keys()].sort((a, b) => sample_values[b] - sample_values[a]);
    var topTenData = {
      sample_values: sortedData.slice(0, 10).map(i => sample_values[i]),
      otu_ids: sortedData.slice(0, 10).map(i => otu_ids[i]),
      otu_labels: sortedData.slice(0, 10).map(i => otu_labels[i])
    };
    return topTenData;
  }
  
  // Functions to make horizontal bar chart
    // Use sample_values as the values for the bar chart.
    // Use otu_ids as the labels for the bar chart.
    // Use otu_labels as the hovertext for the chart.

  function barChart(sample) {
    // Create trace
    var trace1 = {
      x: sample.sample_values,
      y: sample.otu_ids.map(id => "OTU " + id), 
      text: sample.otu_labels,
      type: "bar",
      orientation: "h"
    };
    
    // Create data variable
    var data = [trace1];

    // Create layout variable to set plots layout
    var layout = {
      title: "Top 10 OTUs",
      yaxis: {
        type: 'category', // Set the y-axis to treat the values as categories
        categoryorder: 'total ascending', // You can adjust the category order as needed
      },
      height: 600,
      width: 800,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      }
    };
  
    // Create the bar plot
    Plotly.newPlot("bar", data, layout);
  }
  
  // Bubble chart
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

  function bubbleChart(sample) {
    // Create trace
    var trace1 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      },
      text: sample.otu_labels
    };
  
    // Create layout
    var layout = {
      xaxis: { title: "OTU ID" },
      height: 600,
      width: 1000
    };
  
    // Create data variable
    var data = [trace1];
  
    // Create the bubble plot
    Plotly.newPlot("bubble", data, layout);
  }
  
  // Function to get sample data for a specific sample ID
  function getSampleData(samples, selectedSample) {
    return samples.find(sample => sample.id === selectedSample);
  }

  // Function to get sample metadata for a specific sample ID
  function getSampleMetadata(metadata, selectedSample) {
    return metadata.find(sample => sample.id === parseInt(selectedSample));
  }

// Function to update charts and demographic info based on selected sample ID
  function updateCharts(selectedSampleId, data) {
  
    // Display demographic info
    var demoInfo = demographicInfo(getSampleMetadata(data.metadata, selectedSampleId));
  
    // Get top 10 OTUs using top ten function for selected sample and save as a variable
    var topTenData = topTen(getSampleData(data.samples, selectedSampleId));
  
    // Barchart for top ten OTUs
    barChart(topTenData);
  
    // All OTUs for selected sample
    var allOTUs = getSampleData(data.samples, selectedSampleId);
  
    // Bubble chart for all OTUs
    bubbleChart(allOTUs);
  }

  // Initial code execution
  d3.json(url).then(function(data) {
    console.log(data);
  
    // Populate the dropdown with sample IDs
    populateDropdown(data.names);
  
    // Default sample ID to populate the page
    var defaultSampleId = data.names[0];
  
    // Initial rendering with the default sample ID
    updateCharts(defaultSampleId, data);
  
    // Event listener for dropdown change
    d3.select("#selDataset").on("change", function() {
      // Get the selected sample ID from the dropdown
      var selectedSampleId = d3.select("#selDataset").node().value;
      console.log(`Selected Sample ID: ${selectedSampleId}`);
  
      // Call the updateCharts function with the selected sample ID
      updateCharts(selectedSampleId, data);
    });
  });
  