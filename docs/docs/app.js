// 'data' is object fetched from JSON file
// 'data' object contains properties 'names','metadata', 'samples', 'labels'
// 'metadata': array containing objects representing 'id', 'ethnicity', 'gender', 'age', 'location', 'bbtype', 'wfreq'
// samples: array containing objects representing (patient) 'id', 'otu_ids', 'sample_values', and 'otu_labels'
// 'value' parameter in optionChanged function represents value of ID currently selected in dropdown menu because onchange event handler in HTML is set up to pass selected value to function

const urlData = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch json object from specified URL and store returned promise in variable 'dataPromise'
// Log promise object (not actual data); promise object in console indicates fetch request pending
const dataPromise = d3.json(urlData); 
console.log("Data promise: ", dataPromise);

// Define variables outside .then() function to make them available everywhere
var samples;
var meta_data;
var labels;

    //Use .then() method to work with data once promise resolves
    dataPromise.then(function(data) {
      console.log("Data Loaded:", data);  //log data to console once json data fetched

      // Assign Data To Variables For Later Use
      //Data.metadata, data.samples, data.labels properties of 'data' object, contain arrays of information
      //Use dot notation to access 'metadata', 'samples', and 'labels' parts of 'data' object  
      //Define 'meta_data', 'samples','labels' as keys within 'data' object
      meta_data = data.metadata;  
      samples = data.samples;  
      labels = data.labels;    

      //Use D3.js to select HTML element w/id 'selDataset' and store in 'selector' variable 
      //'selDataset' contains reference to onchange="optionChanged(this.value)">
      let selector = d3.select("#selDataset");  //selects <select> element 'selDataset' and names it 'selector'
      
      //Iterate over each obj in array (forEach method) and execute code inside loop
      //Arrow function => is alternate way to define anonymous function 
      meta_data.forEach((obj) => {   // Iterate over objects in 'meta_data' array; function takes each obj as parameter and executes code inside curly braces
        //Assign value of 'id' property from current obj to variable 'id'
          let id = obj.id;          // Within iterations, 'obj' represents current object; operation extracts 'id' property from each obj in array
        //Append new <option> element to <select> element 
        //Set text content of <option> element (what user ses in menu) to value of 'id'
        //Set value attribute of <option> element to value of 'id'
        //When user selects new option, optionChanged function called with selectedId as argument, updates displayed data accordingly
          selector.append("option").text(id).property("value", id);});  // closes meta_data.forEach function block
        // selector.append("option") creates new <option> element to append to <select> element (dropdown menu) referenced by selector 
        //.property("value", id); sets 'value' attribute of <option> element to value of id; value gets passed to optionChanged function when user selects dropdown option

      //Initialize Page With First Patient's Data
      //Call functions for creating charts and pass them 1st element of 'meta_data' and 'samples' arrays as arguments    
      //This updates content of HTML 'sample-metadata' element with demographic data for patient
      
      //JS functions can be called before being defined as long as they're defined at some point before actually executed
      //Arguments passed are placeholders that get populated with values when functions get defined and executed 
      const firstPatientId = String(meta_data[0].id);
      const firstPatientData = samples.find(sample => String(sample.id) === firstPatientId);
      const firstPatientMetaData = meta_data.find(item => String(item.id) === firstPatientId);

      if (firstPatientData && firstPatientMetaData) 
        {metaData(firstPatientMetaData);
        barChart(firstPatientData);
        bubbleChart(firstPatientData);
        washFreq(firstPatientMetaData.wfreq);} 
    else {console.error("Error: Unable to find data for the first patient.");}
      
    //Add event listener for dropdown change
      selector.on("change", function() {optionChanged(this.value);});   //closes then method function block because function encompasses entire process of handling data, including setting up dropdown menu and initializing page with first patient's data

  }).catch(function(error) {      // }) closes function block passed to .then method
      console.error("Error loading data:", error)});

//JS code interacts with HTML elements and updates them dynamically based on data retrieved from JSON
//Define 'metaData' function to take 'meta_data' variable as parameter/argument; meta_data = data.metadata, per above
//metaData function accepts object containing demographic data (from JSON) and uses it to dynamically update HTML element 'sample-metadata' content
function metaData(meta_data) { 
    let demSelect = d3.select("#sample-metadata");  //Use D3.js to select HTML element 'sample-metadata' (where demo data displayed) and assign it to variable 'demSelect'
    //Replace demSelect variable content with 'sample-metadata' to show actual demographic data  
    demSelect.html(   //method updates HTML content of selected element (#sample-metadata) using template literal
                      //template literal uses ${...} syntax to interpolate values from meta_data object
                      //Each ${} placeholder inside template literal replaced with corresponding property value from 'meta_data'
        `id: ${meta_data.id} <br>  
        ethnicity: ${meta_data.ethnicity} <br>
        gender: ${meta_data.gender} <br>
        age: ${meta_data.age} <br>
        location: ${meta_data.location} <br>
        bbtype: ${meta_data.bbtype} <br>
        wfreq: ${meta_data.wfreq}`
    );
} 

//In JavaScript, first define variables, then call functions that use variables
function optionChanged(value) {    //optionChanged defined to accept 1 parameter, value of selected option in dropdown menu
  console.log("Selected ID:", value);
  
  //DEFINE VARIABLE selectedId AS PATIENTID IN SAMPLES ARRAY THAT = CURRENT ELEMENT BEING PROCESSED IN ARRAY
  //Use .find() method to isolate 'id' in question in samples array  
  //item.id refers to 'id' property of object in samples or meta_data arrays
  //each array object represents sample or metadata entry, and each entry has uniquely-identifying 'id' property
  const selectedId = samples.find((item) => String(item.id) === String(value)); // Ensure both IDs are strings
  //.find() method returns 1st element in 'samples' array (not samples.json) that satisfies provided testing function
  //(item) => item.id == value' is testing function; takes each item in samples array and checks if 'id' property's value = 'value'
  //strict comparison without type coercion: ===; == performs type coersion
  //Once code finds 1st object where 'id' property's value ==='value', assigns that object to 'selectedId' variable
  const demographicInfo = meta_data.find((item) => String(item.id) === String(value)); // Ensure both IDs are strings
  //.find() method returns 1st element in 'meta_data" array whose 'id' property value ==='value' and assigns that object to 'demographicInfo' variable

  if (selectedId && demographicInfo) {
    const washFrequency = demographicInfo.wfreq;
    metaData(demographicInfo);
    barChart(selectedId);
    bubbleChart(selectedId);
    washFreq(washFrequency);
  } else {
    console.error("Error: 'wfreq' property is missing or undefined");
  }
}
  
//For patient in question, define and create bar chart that displays top ten 'sample_values' in reverse order
function barChart(selectedId) {
    if (!selectedId) {
        console.error("Error: selectedId is undefined");
        return;}

  // Ensure chart div cleared before drawing new chart
  d3.select("#bar").html("");

    let x_axis = selectedId.sample_values.slice(0,10).reverse();
    let y_axis = selectedId.otu_ids.slice(0,10).reverse().map((item) => `OTU ${item}`); 
    let text = selectedId.otu_labels.slice(0,10).reverse();

    //Add "OTU" prefix to each otu_ids and make them available to y-axis
    //.map() method creates new array by applying function to each element of array its called on
    //(item) => OTU ${item}) arrow function takes single parameter item (each element of reversed array selectedId.otu_ids.slice(0,10).reverse())

    //Configuration for BarChart specifies data & settings required for Plotly to generate bar chart (x-axis values, y-axis values, text labels, chart type, orientation)
    //Define configuration for BarChart; 'let' necessaary because it declares BarChart variable
    let BarChart = {
        x: x_axis, 
        y: y_axis, 
        text: text, 
        type: "bar", 
        orientation: "h",}; 
    //Note text = selectedId.otu_lables.slice(0,10).reverse, specified hover labels

    //'newPlot' function requires data to be passed in array format
    //Encapsulating BarChart object in array ensures it meets expected input format
    //Create array named chart that contains BarChart object
    let chart = [BarChart];
    let layout = {margin: {l: 100, r: 100, t: 0, b: 50,}, height: 500, width: 500 };

    //'.newplot()' method creates new plot (or updates existing) in specified HTML element
    //'bar': id of HTML element where plot will be rendered (look for HTML element with id="bar" <div id="bar"></div>) 
    //'chart': array containing data to plot; here, array containing object 'BarChart')
    Plotly.newPlot("bar", chart, layout);
  }  

//For patient in question, define and create bubble chart to display 'otu_ids' for x values and marker colors,
//'sample_values' for y values, 'sample_values' for marker size, and 'otu_labels' for text values
function bubbleChart(selectedId) {
    if (!selectedId) {      //checks if selectedId is falsy: If yes, code inside if block will execute, logging error message and returning from function early
        console.error("Error: selectedId is undefined");
        return;}

    // Ensure chart div cleared before drawing new chart
    d3.select("#bubble").html("");
    
    let x_axis = selectedId.otu_ids;
    let y_axis = selectedId.sample_values;
    let text = selectedId.otu_labels;
    let marker_size = selectedId.sample_values;
    let color = selectedId.otu_ids;
    
    let bubble = {
        x: x_axis, 
        y: y_axis, 
        text: text,
        //Create scatter plot where marker represents each data point
        mode: "markers", 
        marker: {color: color, colorscale: "Rainbow", size: marker_size,},
        type: "scatter",};
    
    let chart = [bubble]; 
    //JavaScript object keys don't support hyphens; change 'x-axis' to 'xaxis'
    let layout = {xaxis: {title: {text: "OTU ID"}, },}; 
    //Plotly provides reasonable defaults for many chart layout properties (y-axis configuration, margins, background color, grid lines)
    //If properties not specified, Plotly applies default values, ensuring chart renders properly
    //xaxis: {title: {text: "OTU ID"}} explicitly sets x-axis title to "OTU ID" 
    Plotly.newPlot("bubble", chart, layout); 
  }

//Gauge charts don't use standard xaxis & yaxis properties; use properties specifically designed for gauge type, encapsulated within gauge object
//'domain' defines position of gauge on plot, e.g. { x: [0, 1], y: [0, 1] }
//'mode' defines mode, e.g. 'gauge+number' or 'gauge'
//'gauge' is object containing several properties for customizing appearance & behavior

//In Plotly, properties clustered into 'data' and 'layout' objects to separate content & presentation
//'data' object contains all info about data being plotted (what's shown and how it's visualized)
//'layout' object contains all info about chart overall appearance and layout

function washFreq(washFrequency) {
    if (washFrequency === undefined) {
        console.error("Error: washFrequency is undefined");
        return;}
  
    // Ensure chart div cleared before drawing new chart
    d3.select("#gauge").html("");
    
    // Define data for gauge chart
    let data = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: washFrequency,
            title: { text: "Wash Frequency" },
            gauge: {
                axis: { range:[null, 9] },
                steps: [
                    { range: [0, 1], color: "red" },
                    { range: [1, 2], color: "orange" },
                    { range: [2, 3], color: "yellow" },
                    { range: [3, 4], color: "green" },
                    { range: [4, 5], color: "blue" },
                    { range: [5, 6], color: "indigo" },
                    { range: [6, 7], color: "violet" },
                    { range: [7, 8], color: "pink" },
                    { range: [8, 9], color: "gray" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: washFrequency
                }
            }
        }
    ];

    let layout = { width: 400, height: 300 };
    Plotly.newPlot("gauge", data, layout);}
