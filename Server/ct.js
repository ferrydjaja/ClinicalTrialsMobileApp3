'use strict'

const ClinicalTrials = require('clinical-trials-gov');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs');
const zlib = require('zlib');
const heartbeats = require('heartbeats');
const geolib = require('geolib');

//Heremap API
const appid = "iQA4VQrg3Pts1thv0MbD"; 
const appcode = "MjsII_3Xaha17fKFj_kX4w"; 
const path = "/home/ubuntu/CT/data/XMLRes1/";

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
//app.use(bodyParser.json())

const  compression = require('compression');
app.use(compression());

app.get('/', (req, res) => {

	let cond = req.query.cond;
	let cntry = req.query.cntry;
	let state = req.query.state;
	let city = req.query.city;
	let gndr = req.query.gndr;
	let recrs = req.query.recrs;
	let age = req.query.age;
	let dist = req.query.dist;
	let nctid = req.query.nctid;

	//User location
	let latA = req.query.lat;
	let lngA = req.query.lng;

	let q = req.query.q;

	const maxdistance = 482803; //in meter (300 miles)
	
	if (q == '1') { //To be consumed by UI5: http://localhost/nodejs?q=1&cond=ALK-positive&cntry=US&state=&city=&recrs=&gndr=&age=&dist=10676
		//https://clinicaltrials.gov/ct2/results?displayxml=true&cond=Eye Strain&cntry=US&state=&city=&gndr=&recrs=&age=&dist=10676&count=10000

		let GPSSensor = false;
		if(lngA != '' && latA != '')
			GPSSensor = true;

		
		res.set('Content-Type', 'application/json');
		let heart = heartbeats.createHeart(1000);
		heart.createEvent(1, function(count, last){
			res.write(" ");
		});

		ClinicalTrials.search({cond: cond, cntry, state, city, gndr, recrs, age, dist}).then(trials => {
			if (typeof trials != 'undefined') {
				
				let data = JSON.parse(JSON.stringify(trials));
				
				let jsonO = {
					"results" : { //Results
					},
					"Spots" : { //City Level
					},
					"SpotsC" : { //Country Level
					}
				}
				let jsonpost = [];
				let jsonspot = [];
				let jsonspotC = [];
				let json = [];

				let order = '';
				let score = '';
				let nct_id = '';
				let url = '';
				let title = '';
				let status = '';
				let condition_summary = '';
				let intervention_summary = '';
				let last_changed = '';
				let last_update_submitted = '';
				let last_update_posted = '';


				const main = async () => {
					let i = data.length;

					console.log('len:' + i)

					if(typeof i == 'undefined') { 
						//*********************************************** One record found **********************************************************************************
						
						order = data.order;
						score = data.score;
						nct_id = data.nct_id;
						url = data.url;
						title = data.title;
						status = data.status;
						condition_summary = data.condition_summary;
						intervention_summary = data.intervention_summary;
						last_changed = data.last_changed;
						last_update_submitted = data.last_update_submitted;
						last_update_posted = data.last_update_posted;


						try {
							  	
						 	const returnValue = require(path + nct_id + '.json');
						  	//const returnValue = require('./XMLRes/NCT01630018.json');
						  	//const returnValue = require('./XMLRes/NCT01689584.json');
						  	//const returnValue = require('./XMLRes/NCT02328677.json');
							

							// ************************ City Level *******************************************************************************************
							let AddtoBasketCity = false;
							for (let c = 0, len = returnValue.Spots.length; c < len; c++) {
																
								// NCTID location
								var lngB = returnValue.Spots[c].pos.split(";")[0];
								var latB = returnValue.Spots[c].pos.split(";")[1];
									
								// User Location
								//console.log('City lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

								if(GPSSensor) { //GPS Sensor Active

									let distance = geolib.isPointInCircle(
									    {latitude: latA, longitude: lngA},
									    {latitude: latB, longitude: lngB},
									    maxdistance
									);

									//console.log('City lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB + ':' + ',distance:' + distance);
										
									if(distance) { //Only add NCTID with the locations within the range to basket
										//Map City Spots
										jsonspot.push({
											key: returnValue.Spots[c].key,
											pos: returnValue.Spots[c].pos,
											tooltip: returnValue.Spots[c].tooltip,
											type: 'Success'
										});	
										AddtoBasketCity = true;	
									} 

								} else { //GPS Sensor Not Active - add all to basket
									AddtoBasketCity = true;	
									//Map City Spots
									jsonspot.push({	// Add all locations to baskets
										key: returnValue.Spots[c].key,
										pos: returnValue.Spots[c].pos,
										tooltip: returnValue.Spots[c].tooltip,
										type: 'Success'
									});	
								}					

							}
							// **********************************************************************************************************************************


							// ************************ Country Level *******************************************************************************************
							let AddtoBasketCountry = false; 
							for (let c = 0, len = returnValue.SpotsC.length; c < len; c++) {
																		
								// NCTID location
								var lngB = returnValue.SpotsC[c].pos.split(";")[0];
								var latB = returnValue.SpotsC[c].pos.split(";")[1];
									
								// User Location
								//console.log('Country lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

								if(GPSSensor) { //GPS Sensor Active
									let distance = geolib.isPointInCircle(
										{latitude: latA, longitude: lngA},
										{latitude: latB, longitude: lngB},
										maxdistance
									);
									//console.log('dist country:' + distance);

									if(distance) { //Only add NCTID with the locations within the range to basket
										//console.log('Country lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);
										//Map Country Spots
										let found = jsonspotC.findIndex(r => r.pos === returnValue.SpotsC[c].pos);
										if(found == -1) { //pos not found
											jsonspotC.push({
												key: returnValue.SpotsC[c].key,
												pos: returnValue.SpotsC[c].pos,
												tooltip: returnValue.SpotsC[c].tooltip,
												type: 'Success'
											});
										} else { //pos found
											let total = parseInt(jsonspotC[found].key);
											total = total + parseInt(returnValue.SpotsC[c].key) - 1;
											jsonspotC[found].key = total.toString();
										}	
										AddtoBasketCountry = true;	
									}

								} else { //GPS Sensor Not Active - add all to basket
									AddtoBasketCountry = true;	

									//Map Country Spots
									let found = jsonspotC.findIndex(r => r.pos === returnValue.SpotsC[c].pos);
									if(found == -1) { //pos not found
										jsonspotC.push({
											key: returnValue.SpotsC[c].key,
											pos: returnValue.SpotsC[c].pos,
											tooltip: returnValue.SpotsC[c].tooltip,
											type: 'Success'
										});
									} else { //pos found
										let total = parseInt(jsonspotC[found].key);
										total = total + parseInt(returnValue.SpotsC[c].key);
										jsonspotC[found].key = total.toString();
									}	
								}								
							}
							// **********************************************************************************************************************************

							if(AddtoBasketCity && AddtoBasketCountry) { 

								json.push({
									order: order,
									score: score,
									nct_id: nct_id,
									url: url,
									title: title,
									status: status,
									condition_summary: condition_summary,
									intervention_summary: intervention_summary,
									last_changed: last_changed,
									last_update_submitted: last_update_submitted,
									last_update_posted: last_update_posted,
									eligibility: [],
									location: []
								});

								if(GPSSensor) {
									jsonspotC.push({
										key: '',
										pos: lngA + ';' + latA + ';0',
										tooltip: 'You are here',
										type: 'Error'
									});
								}

								json[0]["eligibility"] = returnValue.results[0].eligibility;
								json[0]["location"] = returnValue.results[0].location;

								jsonO["results"] = json;
								jsonO["Spots"] = jsonspot;
								jsonO["SpotsC"] = jsonspotC;
							}

						}
						catch (e) {
							console.log(e);
						}

						heart.kill();
						res.end(JSON.stringify(jsonO));
						//*********************************************** One record found ************************************************************************************

					} else {	
						//*********************************************** Multiple records found ******************************************************************************
						let k = 0;
						let jsonidx = 0;
						
						while (i--) {													
						
							if(typeof data[k].order === 'undefined') 
								order = " ";
								else
								order = data[k].order;

							if(typeof data[k].score === 'undefined') 
								score = " ";
							else
								score = data[k].score;

							if(typeof data[k].nct_id === 'undefined') 
								nct_id = " ";
							else
								nct_id = data[k].nct_id;

							if(typeof data[k].url === 'undefined') 
								url = " ";
							else
								url = data[k].url;

							if(typeof data[k].title === 'undefined') 
								title = " ";
							else
								title = data[k].title;

							if(typeof data[k].status === 'undefined') 
								status = " ";
							else
								status = data[k].status;

							if(typeof data[k].condition_summary === 'undefined') 
								condition_summary = " ";
							else
								condition_summary = data[k].condition_summary;

							if(typeof data[k].intervention_summary === 'undefined') 
								intervention_summary =" ";
							else
								intervention_summary = data[k].intervention_summary;

							if(typeof data[k].last_changed === 'undefined') 
								last_changed = " ";
							else
								last_changed = data[k].last_changed;

							if(typeof data[k].last_update_submitted === 'undefined') 
								last_update_submitted = " ";
							else
								last_update_submitted = data[k].last_update_submitted;

							if(typeof data[k].last_update_posted  === 'undefined') 
								last_update_posted = " ";
							else
								last_update_posted = data[k].last_update_posted;

							
							try {							  	
							  	const returnValue = require(path + nct_id + '.json');
							  	//const returnValue = require('./XMLRes/NCT01630018.json');
							  	//const returnValue = require('./XMLRes/NCT01689584.json');
							  	//const returnValue = require('./XMLRes/NCT02328677.json');
							  							  	
							  	

								// ************************ City Level *******************************************************************************************
								let AddtoBasketCity = false; 
								for (let c = 0, len = returnValue.Spots.length; c < len; c++) {
																
									// NCTID location
									var lngB = returnValue.Spots[c].pos.split(";")[0];
									var latB = returnValue.Spots[c].pos.split(";")[1];
									
									// User Location
									//console.log('City lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

									if(GPSSensor) { //GPS Sensor Active

										let distance = geolib.isPointInCircle(
										    {latitude: latA, longitude: lngA},
										    {latitude: latB, longitude: lngB},
										    maxdistance
										);
										
										if(distance) { //Only add NCTID with the locations within the range to basket
											//console.log('City nctid: ' + nct_id + ', lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB + ':' + ', distance:' + distance);
											//Map City Spots
											jsonspot.push({
												key: returnValue.Spots[c].key,
												pos: returnValue.Spots[c].pos,
												tooltip: returnValue.Spots[c].tooltip,
												type: 'Success'
											});	
											AddtoBasketCity = true;	
										} 

									} else { //GPS Sensor Not Active - add all to basket
										AddtoBasketCity = true;	
										//Map City Spots
										jsonspot.push({	// Add all locations to baskets
											key: returnValue.Spots[c].key,
											pos: returnValue.Spots[c].pos,
											tooltip: returnValue.Spots[c].tooltip,
											type: 'Success'
										});	
									}					

								}
								// **********************************************************************************************************************************



								// ************************ Country Level *******************************************************************************************
								let AddtoBasketCountry = false; 
								for (let c = 0, len = returnValue.SpotsC.length; c < len; c++) {
																		
									// NCTID location
									var lngB = returnValue.SpotsC[c].pos.split(";")[0];
									var latB = returnValue.SpotsC[c].pos.split(";")[1];
									
									// User Location
									//console.log('Country lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

									if(GPSSensor) { //GPS Sensor Active

										let distance = geolib.isPointInCircle(
										    {latitude: latA, longitude: lngA},
										    {latitude: latB, longitude: lngB},
										    maxdistance
										);

										//console.log('dist country:' + distance);

										if(distance) { //Only add NCTID with the locations within the range to basket
											//console.log('Country lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

											//Map Country Spots		
											let found = jsonspotC.findIndex(r => r.pos === returnValue.SpotsC[c].pos);
											if(found == -1) { //pos not found
												jsonspotC.push({
													key: returnValue.SpotsC[c].key,
													pos: returnValue.SpotsC[c].pos,
													tooltip: returnValue.SpotsC[c].tooltip,
													type: 'Success'
												});
											} else { //pos found
												let total = parseInt(jsonspotC[found].key);
												total = total + parseInt(returnValue.SpotsC[c].key) - 1;
												jsonspotC[found].key = total.toString();
											}	
											

											AddtoBasketCountry = true;	
										}

									} else { //GPS Sensor Not Active - add all to basket
										AddtoBasketCountry = true;	

										//Map Country Spots
										let found = jsonspotC.findIndex(r => r.pos === returnValue.SpotsC[c].pos);
										if(found == -1) { //pos not found
											jsonspotC.push({
												key: returnValue.SpotsC[c].key,
												pos: returnValue.SpotsC[c].pos,
												tooltip: returnValue.SpotsC[c].tooltip,
												type: 'Success'
											});
										} else { //pos found
											let total = parseInt(jsonspotC[found].key);
											total = total + parseInt(returnValue.SpotsC[c].key);
											jsonspotC[found].key = total.toString();
										}
									}								
								}
								// **********************************************************************************************************************************

								if(AddtoBasketCity && AddtoBasketCountry) { 
									
									json.push({
										order: order,
										score: score,
										nct_id: nct_id,
										url: url,
										title: title,
										status: status,
										condition_summary: condition_summary,
										intervention_summary: intervention_summary,
										last_changed: last_changed,
										last_update_submitted: last_update_submitted,
										last_update_posted: last_update_posted,
										eligibility: [],
										location: []
									});

									if(GPSSensor) {
										jsonspotC.push({
											key: '',
											pos: lngA + ';' + latA + ';0',
											tooltip: 'You are here',
											type: 'Error'
										});
									}

									json[jsonidx]["eligibility"] = returnValue.results[0].eligibility;
									json[jsonidx]["location"] = returnValue.results[0].location;

									jsonO["results"] = json;
									jsonO["Spots"] = jsonspot;
									jsonO["SpotsC"] = jsonspotC; 

									jsonidx++;
								}
							}
							catch (e) {
								console.log(e);
							}
							

							if(k == data.length-1) {
								heart.kill();
								res.end(JSON.stringify(jsonO));
							}
							

							k++;
						}
					}
				};

				main().catch(console.error);

			} else {
				//no records
				res.end(JSON.stringify({}));

			}
		});

	} else if (q == '2') { //To view details from UI5: http://localhost/nodejs?q=2&nctid=NCT00001372

		let GPSSensor = false;
		if(lngA != '' && latA != '')
			GPSSensor = true;
		
		let jsonO = {
			"results" : { //Results
			},
			"Spots" : { //City Level
			},
			"SpotsC" : { //Country Level
			}
		}
		let jsonpost = [];
		let jsonspot = [];
		let jsonspotC = [];
		let json = [];
		let jsonLocation = [];

		const returnValue = require(path + nctid+ '.json');
		//const returnValue = require('./XMLRes/NCT02328677.json');

		
		// ************************ City Level *******************************************************************************************
		let AddtoBasketCity = false;
		for (let c = 0, len = returnValue.Spots.length; c < len; c++) {
																
			// NCTID location
			var lngB = returnValue.Spots[c].pos.split(";")[0];
			var latB = returnValue.Spots[c].pos.split(";")[1];
									
			// User Location
			//console.log('City lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB);

			if(GPSSensor) { //GPS Sensor Active

				let distance = geolib.isPointInCircle(
				    {latitude: latA, longitude: lngA},
				    {latitude: latB, longitude: lngB},
				    maxdistance
				);

				//console.log('City lngA :' + lngA + ', latA: ' + latA + ', lngB:' + lngB + ', latB:' + latB + ':' + ',distance:' + distance);
										
				if(distance) { //Only add NCTID with the locations within the range to basket
					//Map City Spots
					jsonspot.push({
						key: returnValue.Spots[c].key,
						pos: returnValue.Spots[c].pos,
						tooltip: returnValue.Spots[c].tooltip,
						type: 'Success'
					});	

					if(typeof returnValue.results[0].location.length === 'undefined')
						jsonLocation.push(returnValue.results[0].location);
					else 
						jsonLocation.push(returnValue.results[0].location[c]);

					AddtoBasketCity = true;	
				} 

			} else { //GPS Sensor Not Active - add all to basket
				AddtoBasketCity = true;	
				//Map City Spots
				jsonspot.push({	// Add all locations to baskets
					key: returnValue.Spots[c].key,
					pos: returnValue.Spots[c].pos,
					tooltip: returnValue.Spots[c].tooltip,
					type: 'Success'

				});	

				if(typeof returnValue.results[0].location.length === 'undefined')
					jsonLocation.push(returnValue.results[0].location);
				else 
					jsonLocation.push(returnValue.results[0].location[c]);

			}					

		}
		// **********************************************************************************************************************************

		if(AddtoBasketCity) { 

			
			let nct_id = returnValue.results[0].nct_id;
			let url = returnValue.results[0].url;
			let brief_title = returnValue.results[0].brief_title;
			let official_title = returnValue.results[0].official_title;
			let brief_summary = returnValue.results[0].brief_summary;
			let country = returnValue.results[0].country;
			let detailed_description = returnValue.results[0].detailed_description;
			let last_update_submitted = returnValue.results[0].last_update_submitted;
			let last_name = returnValue.results[0].last_name;
			let phone = returnValue.results[0].phone;
			let email = returnValue.results[0].email;
			let eligibility = returnValue.results[0].eligibility;
									
			json.push({
				nct_id: nct_id,
				url: url,
				brief_title: brief_title,
				official_title: official_title,
				brief_summary: brief_summary,
				country: country,
				detailed_description: detailed_description,
				last_update_submitted: last_update_submitted,
				last_name: last_name,
				phone: phone,
				email: email,
				eligibility: eligibility,
				location: []
			});

			if(GPSSensor) {
				jsonspot.push({
					key: '',
					pos: lngA + ';' + latA + ';0',
					tooltip: 'You are here',
					type: 'Error'
				});
			}

			json[0]["location"] = jsonLocation;

			jsonO["results"] = json;
			jsonO["Spots"] = jsonspot;
			jsonO["SpotsC"] = jsonspotC;
		}

		res.set('Content-Type', 'application/json');
		res.end(JSON.stringify(jsonO));

	} else if (q == '3') { //To view suggestions https://clinicaltrials.gov/ct2/rpc/extend/cond?cond=cancer

		ClinicalTrials.GetSuggestion({cond: cond}).then(returnValue => {;
			returnValue = JSON.parse(returnValue);
			res.set('Content-Type', 'application/json');
			res.end(JSON.stringify(returnValue));
		});


	} 
	
})


function Start() {
	// Spin up the server
	app.listen(app.get('port'), function() {
		console.log('Pfizer Clinical Trials App running on port', app.get('port'))
	});
}
Start();
