## Dataset
I’m going to use a dataset called DADS from INSEE.


INSEE is the National Institute of Statistics and Economic Studies which collects, analyses and disseminates information on the French economy and society. The DADS is the Annual Declaration of Social Data, which is a declaratory formality that all companies with employees must carry out.


This last dataset publicly available is from 2014 but it allows real conclusions to be drawn since the data is only 3 years old.


You can find this dataset on this [link](https://www.insee.fr/fr/statistiques/2021266)


It contains information on salaries of French citizens according to their occupation, age, gender of place of residence. This dataset will be central to my analysis and I will try to join other dataset like geographic, industry and demographic data.


I will join this with the different populations of the cities to show the importance of this one in the geography of France. These data come from the INSEE sub-municipal database "Population", which provides data on the characteristics of the population according to gender, age, socio- professional category and nationality category. However, I will only keep the total population of each city because here the subject of my visualization is about the different salaries so it is better not to scatter and focus on the salaries.


You can find this dataset on this [link](https://www.insee.fr/fr/statistiques/3137409)


I completed all this with a set of geographic data (latitude and longitude of each city) which permits to put it in a map. The dataset comes from the French government open data.


You can find this dataset on this [link](https://www.data.gouv.fr/fr/datasets/listes-des-communes-geolocalisees-par-regions-departements-circonscriptions-nd/)


You will find in the Data folder the different csv files used and especially the file that came out after processing under Python (**merge_csv.ipynb**). There is also the raw data (xls) in the _original_xls_files_ folder.
