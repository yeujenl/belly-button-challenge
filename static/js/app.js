// Define URL variable with JSON link
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create an empty array to hold output of all sample ids
let option = [];

// Fetching JSON data
d3.json(url).then(function(data){
    
    // Forward loop to pull all ids
    for (let i=0; i<data.samples.length; i++){
        ids = data.samples[i].id;

        // Append array with sample ids and html coding for drop down
        option.push("<option value = '" + ids +"'>"+ ids + "</option>")
    };  

});

// Console log output to copy into html code
console.log(option);

// Create function for extracing data and graphing
function graph(data, value){
    // Empty arrays to hold values for graph ploting
    let a_sample_values = [];
    let a_otu_ids = [];
    let a_otu_labels = [];
    
    let b_sample_values = [];
    let b_otu_ids = [];
    let b_otu_labels = [];

    let meta_data = [];

    // Forward loop to extract values
    for (let i=0; i<data.samples.length; i++){
        // Variable defining each rows
        let row = data.samples[i];

        // Conditional to match row sample id with input id
        if (row.id == value) {
            // Extract metadata for "Demographic Info"
            meta_data = data.metadata[i];

            // Forward loop to extract values for bar graph
            // Limit to 10 loops for top 10 outputs
            for (let a=0; a<10; a++){
                let values = row.sample_values[a];
                let o_id = row.otu_ids[a];
                let o_labels = row.otu_labels[a];

                // Push extracted value to corresponding arrays
                a_sample_values.push(values);
                // Add "OTU " to the front of the IDs for axis-labels
                a_otu_ids.push("OTU " + o_id);
                a_otu_labels.push(o_labels);
            };

            // Forward loop to extract values for bubble graph
            for (let b=0; b<row.sample_values.length; b++){
                let b_values = row.sample_values[b];
                let b_o_id = row.otu_ids[b];
                let b_o_labels = row.otu_labels[b];

                // Push extracted value to corresponding arrays
                b_sample_values.push(b_values);
                b_otu_ids.push(b_o_id);
                b_otu_labels.push(b_o_labels);
            };

            
        }

    };

    // Defining variables to pull "meta_data" keys and values from JSON data
    let demo_values = Object.values(meta_data);
    let demo_keys = Object.keys(meta_data);

    // Define consloe.log as function to input output as HTML to corresponding "div-id"
    console.log = function(message){
        document.getElementById("sample-metadata").innerHTML = message;
    }; 

    // Create empty array for "meta_data" loop output
    let demo_list = [];

    // Forward loop to format "meta_data" output
    for (let c=0; c<7; c++){
        demo_list.push("<b>" + demo_keys[c] + "</b>: " + demo_values[c] + "</br>")

    };

    // Remove the commas in the array
    let demographic = demo_list.join("");

    // console.log formatted "meta_data"
    console.log(demographic);

    // Call functions to plot extracted values
    bar_plot(a_sample_values, a_otu_ids, a_otu_labels);
    bubble_plot(b_sample_values, b_otu_ids, b_otu_labels);
    
};


// Create function for horizontal bar graph plotting
function bar_plot(x_value, y_value, hover_text){
    let bar_plot = [{
        x: x_value,
        y: y_value,
        text: hover_text,
        type: "bar",
        orientation: "h"
    }];

    let bar_layout = {
        width: 500,
        height: 500
    };

    Plotly.newPlot("bar", bar_plot, bar_layout);
};

// Create function for bubble graph plotting
function bubble_plot(x_value, y_value, hover_text){
    let bubble_plot =[{
        x: y_value,
        y: x_value,
        text: hover_text,
        mode: 'markers',
        marker: {
          color: y_value,
          size: x_value
        }
      }];
           
      let bubble_layout = {
        xaxis: {
            title: {
            text: "OTU ID",
            },
        },
};
      
      Plotly.newPlot('bubble', bubble_plot, bubble_layout);
};



// Create function for default graph
function init(){
    // Fetching JSON data
    d3.json(url).then(function(data){ 

        // Call data extraction/graphing function for first ID
        graph(data, "940")

    });

};


// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Create function for getData()
function getData(){
    // Assign the dropdown menu option to a variable
    let dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");

    // Fetching JSON data
    d3.json(url).then(function(data){

        // Call data extraction/graphing function based on value selected
        graph(data, dataset)
                    
    }); 


}

// Call init() function to load default graph
init();