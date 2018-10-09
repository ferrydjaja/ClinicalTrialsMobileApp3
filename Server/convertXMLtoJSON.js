const parseString = require('xml2js').parseString;
const fs = require('fs');
const ClinicalTrials = require('clinical-trials-gov');

//Heremap API
const appid = "iQA4VQrg3Pts1thv0MbD"; 
const appcode = "MjsII_3Xaha17fKFj_kX4w"; 

let nctid = process.argv[2]; //nctid filename
const path = './XMLRes/';


const parseXML = (xml) => {
    let response;
    parseString(xml, {
        explicitArray: false,
        mergeAttrs: true,
        normalize: true,
    }, (err, result) => {
        if (!err) { 
            response = result;
        } else { throw err };
    });
    return response;
}


start();

function start() {
	getData(nctid, function(returnValue) {
		
		//For Windows
		nctid = nctid.split('.');
		nctid = nctid[0];

		//For Linux
		//nctid = nctid.split('/');
		//nctid = nctid[7].split('.');
		//nctid = nctid[0];


		fs.writeFile(path +  nctid + '.json', returnValue.trim(), 'utf8', function (err) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
			process.exit();
		}); 
	});
}

function getData(nctid, callback) {
	fs.readFile(nctid, 'utf8', function(err, data) {
		if (!err) {

			let jsonO = {
				"results" : {
				},
				"Spots" : {
				},
				"SpotsC" : {
				}
			}
			let jsonspot = [];
			let jsonspotC = [];
			let json = [];

			json.push({
				nct_id: '',
	            url: '',
	            brief_title: '',
	            official_title: '',
	            brief_summary: '',
	            country: '',
	            //state: state,
	            detailed_description: '',
	            last_update_submitted: '',
	            last_name: '',
	            phone: '',
	            email: '',
				eligibility: [],
				location: []
			});


			const main = async () => {
				
				let readFileContent = JSON.parse(JSON.stringify(parseXML(data)));
				readFileContent = readFileContent.clinical_study;

				let nct_id ='';
				if (!readFileContent.id_info.nct_id)
	                nct_id = "N/A";
	            else
	                nct_id = readFileContent.id_info.nct_id;

				let url ='';
				if (!readFileContent.required_header)
	                url = "N/A";
	            else
	                url = readFileContent.required_header.url;

	            let brief_title ='';
				if (!readFileContent.brief_title)
	                brief_title = "N/A";
	            else
	                brief_title = readFileContent.brief_title;

	            let official_title ='';
				if (!readFileContent.official_title)
	                official_title = "N/A";
	            else
	                official_title = readFileContent.official_title;

	            let brief_summary ='';
				if (!readFileContent.brief_summary)
	                brief_summary = "N/A";
	            else
	                brief_summary = readFileContent.brief_summary.textblock;

	            let location_countries ='';
				if (!readFileContent.location_countries)
	                location_countries = "N/A";
	            else
	                location_countries = readFileContent.location_countries.country;

	            let detailed_description ='';
				if (!readFileContent.detailed_description)
	                detailed_description = "N/A";
	            else
	                detailed_description = readFileContent.detailed_description.textblock;

	            let last_update_submitted ='';
				if (!readFileContent.last_update_submitted)
	                last_update_submitted = "N/A";
	            else
	                last_update_submitted = readFileContent.last_update_submitted;

	            let last_name ='';
	            let phone = '';
	            let email = '';
				if (!readFileContent.overall_contact) {
	                last_name = "N/A";
	                phone = "N/A";
                	email = "N/A";
				}
	            else {
	                last_name = readFileContent.overall_contact.last_name;
	                phone =  readFileContent.overall_contact.phone;
	                email = readFileContent.overall_contact.email;
	            }


				json[0]["nct_id"] = nct_id;
				json[0]["url"] = url;			
				json[0]["brief_title"] = brief_title;
				json[0]["official_title"] = official_title;
				json[0]["brief_summary"] = brief_summary;
				json[0]["country"] = location_countries;
				json[0]["detailed_description"] = detailed_description;
				json[0]["last_update_submitted"] = last_update_submitted;
				json[0]["last_name"] = last_name;
				json[0]["phone"] = phone;
				json[0]["email"] = email;
				json[0]["eligibility"] = readFileContent.eligibility;
				json[0]["location"] = readFileContent.location;

				
				let lengthdata = 1; let country = ''; let city = ''; let state = ''; var name;
				let keyidx = 0;
				if (readFileContent.hasOwnProperty('location')) {

					if (typeof readFileContent.location.length === 'undefined')
						lengthdata = 1;
					 else
						lengthdata = readFileContent.location.length;

					//console.log('location length: ' + lengthdata);

					for (let c = 0, len = lengthdata; c < len; c++) {
						
						if(lengthdata == 1) {
							name = readFileContent.location.facility.name;

							if(readFileContent.location.facility.hasOwnProperty("address")) {
								
								if(readFileContent.location.facility.address.hasOwnProperty("country"))
									country = readFileContent.location.facility.address.country; 
								
								if(readFileContent.location.facility.address.hasOwnProperty("state"))
									state = readFileContent.location.facility.address.state; 

								if(readFileContent.location.facility.address.hasOwnProperty("city"))
									city = readFileContent.location.facility.address.city; 
								
							}
						} else {
							name = readFileContent.location[c].facility.name;

							if(readFileContent.location[c].facility.hasOwnProperty("address")) {
								
								if(readFileContent.location[c].facility.address.hasOwnProperty("country"))
									country = readFileContent.location[c].facility.address.country; 

								if(readFileContent.location[c].facility.address.hasOwnProperty("state"))
									state = readFileContent.location[c].facility.address.state; 

								if(readFileContent.location[c].facility.address.hasOwnProperty("city"))
									city = readFileContent.location[c].facility.address.city; 
							}

						}

						country = country.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');

						if(country == "Korea, Republic of") 
							country = "South Korea";
						if(country == "Macedonia, The Former Yugoslav Republic of")
							country = "Macedonia";
						if(country == "Former Serbia and Montenegro")
							country = "Serbia";
						if(country == "Iran, Islamic Republic of")
							country = "Iran";
						if(country == "Moldova, Republic of")
							country = "Moldova";
						if(country == "Korea, Democratic People's Republic of") 
							country = "South Korea";
						if(country == "Congo, The Democratic Republic of the") 
							country = "Congo";
						if(country == "Cte DIvoire")
							country = "Cote d'Ivoire";
						if(country == "Runion")
							country = "Reunion";
						if(country == "Lao People's Democratic Republic")
							country = "Lao";

						state = state.replace(/[^A-Za-z 0-9]*/g, '');
						city =  city.replace(/[^A-Za-z 0-9]*/g, '');
						console.log(nct_id + '|' + country + '|' + state + '|' + city);
						
						if(country != '') {
							
							//Get City Lat & Long Level
							let eror = 1; let eror_cnt = 1;
							while(eror != 0) {	//redo if connection is failed
								console.log('City level:' + eror + '-' + eror_cnt);

								if(eror_cnt > 3) //2x times tried
									break;
								
								try {
									let latlong = await ClinicalTrials.GetLatLong({searchtext: city + ' ' +  country, appid: appid, appcode: appcode});
									
									latlong = JSON.parse(latlong);

									//to check if country is exist/correct
									if(latlong.Response.View.length > 0) {
										const lat = latlong.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
										const lng = latlong.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
										console.log('City lat: ' + lat + ', lng: ' + lng);


										//Map Spots Detail: City Level
										jsonspot.push({
											key: keyidx,
											pos: lng + ';' + lat + ';0',
											tooltip: name,
											select: false,
											type: 'Success'
										});

										

									} else {
										console.log('City doesnt exist:' +  city + ' ' + state + ' ' + country);
										let latlong = await ClinicalTrials.GetLatLong({searchtext: country, appid: appid, appcode: appcode});

										latlong = JSON.parse(latlong);

										//to check if country is exist/correct
										if(latlong.Response.View.length > 0) {

											const lat = latlong.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
											const lng = latlong.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
											console.log('lat: ' + lat + ', lng: ' + lng);

											jsonspot.push({
												key: keyidx,
												pos: lng + ';' + lat + ';0',
												tooltip: name,
												select: false,
												type: 'Success'
											});
										}
									}

									eror = 0

									
								} catch (e) {
									eror = 1;
									eror_cnt++;
									console.log(e);
								}
							}

							//Get Country Lat & Long Level
							let erorC = 1; let erorC_cnt = 1;
							while(erorC != 0) {	//redo if connection is failed
								console.log('Country level:' + erorC + '-' + erorC_cnt);

								if(erorC_cnt > 3) //2x times tried
									break;
								
								try {
									let latlong = await ClinicalTrials.GetLatLong({searchtext:  country, appid: appid, appcode: appcode});
									
									latlong = JSON.parse(latlong);

									//to check if country is exist/correct
									if(latlong.Response.View.length > 0) {
										const lat = latlong.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
										const lng = latlong.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
										console.log('Country lat: ' + lat + ', lng: ' + lng);


										//Map Spots Detail: Country Level
										let found = jsonspotC.findIndex(r => r.pos === lng + ';' + lat + ';0');
										if(found == -1) { //lat & long not found
											jsonspotC.push({
												key: '1',
												pos: lng + ';' + lat + ';0',
												tooltip: country
											});
										} else { //lat & long found
											let total = parseInt(jsonspotC[found].key);
											total = total + 1;
											jsonspotC[found].key = total.toString();
										}

									} 
	
									erorC = 0
									
								} catch (e) {
									erorC = 1;
									erorC_cnt++;
									console.log(e);
								}
							}

							keyidx++;
						}
					}
				}

				jsonO["results"] = json;
				jsonO["Spots"] = jsonspot;
				jsonO["SpotsC"] = jsonspotC;

				callback(JSON.stringify(jsonO)); 


			}
			main().catch(console.error);
		}
	});
}
