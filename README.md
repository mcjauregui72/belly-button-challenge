# belly-button-challenge

This project builds an interactive dashboard to explore the Belly Button Biodiversity datasetLinks to an external site, which catalogs the microbes that colonize human navels.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

Steps taken:

1) Use the D3 library to read in samples.json from the URL https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json.

2) Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

3) Create a bubble chart that displays each sample.

4) Create a gauge chart that displays the individual's weekly wash frequency.

5) Display the sample metadata, i.e., an individual's demographic information.

6) Display each key-value pair from the metadata JSON object somewhere on the page.

7) Update all the plots when a new sample is selected.
