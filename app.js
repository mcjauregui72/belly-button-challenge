//Assistance with function definition and syntax throughout provided by XpertLearning Assistant 
//(https://bootcampspot.instructure.com/courses/4981/external_tools/313) and Mychele Larson

//Define urlData for import file
const urlData = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//Promise pending for json data from urlData 
const dataPromise = d3.json(urlData);
  console.log("Data promise: ", dataPromise);

//How to update content of sample-metadata element on webpage: 
//Define 'metaData' function to take meta_data as parameter
//Assign 'meta_data' value of 'metadata' key inside json data (portion denoted by 'data.metadata')
//Define 'meta_data' as variable holding 'sample-metadata' retrieved from json
//Select html element with div id="sample-metadata" and save to demSelect variable 
    function metaData(meta_data) {
    let demSelect = d3.select("#sample-metadata");
//Replace demSelect variable content with new content (sample-metadata) to show actual demographic data  
//Use demSelect.html() template literals to interpolate meta_data's values
    demSelect.html(
        `id: ${meta_data.id} <br>
        ethnicity: ${meta_data.ethnicity} <br>
        gender: ${meta_data.gender} <br>
        age: ${meta_data.age} <br>
        location: ${meta_data.location} <br>
        bbtype: ${meta_data.bbtype} <br>
        wfreq: ${meta_data.wfreq}`
    );
}

// Define 'samples' and 'meta_data' variable in scope accessible to all functions (ie., outside the .then() function)
var samples;
var meta_data;

// Load JSON data, save object as 'data'
d3.json(urlData)
    .then(function(data) {
      console.log(data);
      
    //Use dot notation to access 'metadata' and 'samples' parts of 'data' object  
    //Define 'meta_data' as metadata key within 'data' object
      meta_data = data.metadata;
    //Define 'samples' as samples key within 'data' object  
      samples = data.samples;
    
    //Select html element with id="selDataset" and save in 'selector' variable
    //contains reference to onchange="optionChanged(this.value)">
      let selector = d3.select("#selDataset");
    
    //.forEach() method iterates over each object in meta_data array one by one,
    //so '#sample-metadata' element displays only one object at a time
    //Within loop, current object's 'id' permits dynamic creation of option element in dropdown menu
    meta_data.forEach((obj) => {
           let id = obj.id;
    //selector.append("option") appends option elements to selector element to create selectable options
    //text(id) sets text content of option element, sets how text displays in dropdown menu
    //.property("value", id) sets value property of option element to value of id
    selector.append("option").text(id).property("value", id);  
        });

    //Call all three charts and pass first element of 'meta_data' and 'samples' arrays as arguments    
      metaDataFunc(meta_data[0]);
      barChartFunc(samples[0]);
      bubbleChartFunc(samples[0]);
  });

    //'value' is value of selected option in dropdown menu
    function optionChanged(value) {
    //Use .find() method to isolate 'id' in question in samples array  
      const selectedId = samples.find((item) => item.id === value);
    //(item) => function looks for desired element in meta_data array   
    //by searching for case where 'id' is same as 'value' value passed to optionChanged function
      const demographicInfo = meta_data.find((item) => item.id == value);

    //Pass 'demographicInfo' and 'selectedId' as parameters to functions that will display data related to selected trial participant
    //Demographic data
    metaDataFunc(demographicInfo);
    //Bar chart  
    barChartFunc(selectedId);
    //Bubble chart
    bubbleChartFunc(selectedId);
    }

    //Define 'metaDataFunc' to take 'demographicInfo' as parameter 
    function metaDataFunc(demographicInfo) {
      //Select "sample-metadata" element from html and save as 'demSelect2'
      let demSelect2 = d3.select("#sample-metadata")
      //Reset 'demSelect2' content to 'demographicInfo' template string representing
      //characteristics of selected trial participant's demographic info
      demSelect2.html(
        `id: ${demographicInfo.id} <br>
        ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} </br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} </br>
        wfreq: ${demographicInfo.wfreq}`  
      );
    }

    //For trial participant in question, define and create bar chart that displays top ten 'sample_values' in reverse order
    function barChartFunc(selectedId) {
      let x_axis = selectedId.sample_values.slice(0,10).reverse();
      let y_axis = selectedId.otu_ids
          .slice(0,10)
          .reverse()
          //Add "OTU" prefix to each otu_ids and make them available to the y-axis
          .map((item) => `OTU ${item}`); 
      //Store in 'text' top 10 .otu_labels' in reverse order for use in y-axis
          let text = selectedId.otu_labels.slice(0,10).reverse();
      //Define configuration for BarChart
        BarChart = {
          x: x_axis,
          y: y_axis,
          text: text,
          type: "bar",
          orientation: "h",
        };

        let chart = [BarChart];
      //Define layout for BarChart
        let layout = {
          margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 50,
          },
          height: 500,
          width: 500,
        };
      //Plot the BarChart
        Plotly.newPlot("bar",chart, layout);
      }

    //For trial participant in question, define and create bubble chart
    //that displays 'otu_ids' for x values, 'sample_values' for y values,
    //'sample_values' for  marker size, 'otu_ids' for marker colors, 
    //'otu_labels' for text values
    function bubbleChartFunc(selectedId) {
      let x_axis = selectedId.otu_ids;
      let y_axis = selectedId.sample_values;
      let marker_size = selectedId.sample_values;
      let color = selectedId.otu_ids;
      let text = selectedId.otu_labels;

      bubble = {
        x: x_axis,
        y: y_axis,
        text: text,
        //Create scatter plot where marker represents each data point
        mode: "markers", 
        marker: {
          color: color,
          colorscale: "Rainbow",
          size: marker_size,
        },
        type: "scatter",
      };
      let chart = [bubble];  

      let layout = {
        //use xaxis instead of x_axis
        xaxis: {
          title: {text: "OTU ID"},
        },
      };
      Plotly.newPlot("bubble",chart, layout);
    }