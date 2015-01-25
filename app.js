var fs = require('fs');
var geoloqi = require('geoloqi');
var mongojs = require('mongojs');
var config = require('./config');
var https = require('https');

//##TODO pass this in command line, or use private config file
var session = new geoloqi.Session({'access_token': config.oauth});

var app = {
	init: function() {

		var lastTimestamp;
		var i = 0;
		getNextBatch(config.startTimestamp);

		function getNextBatch(ts) {
			var me = this;
			var args = 'count=' + config.historyCount;
			if (ts) args += '&before=' + ts;
			console.log('args: ' + args)
			session.get('/location/history?' + args, function(result, err) {
				if(err) {
					throw new Error(args + ' : ' + err.error_description);
				} else {
					console.log('This batch is ' + result.start.date + ' through ' + result.end.date);
					lastTimestamp = result.start.date_ts;

					if (config.output === config.constants.OUTPUT.FILESYSTEM) {
						app.writeFileSystem(lastTimestamp, result, onSuccess);
					} else {
						app.writeMongoDb(result, onSuccess);
					}
				}
			});
		}

		function onSuccess() {
			i++;
			if (i < config.limitTo) {
				getNextBatch(lastTimestamp);
			}
		}
	},

	writeMongoDb: function(result, callback) {
		var db = mongojs.connect(config.mongodb.url, [config.mongodb.collection]);
		var collection = db[config.mongodb.collection];
		// Example: getting all documents in the collection
		//				collection.find();

		try {
			var points = result.points;
			console.log(points.length + ' items in this batch...');
			var j;
			for (var i = 0; i < points.length; i++) {
				console.log('insert ' + JSON.stringify(points[i]));
				collection.insert(points[i]);
				j = i;
			}
			
			console.log('success, ' + j + ' documents inserted into ' + config.mongodb.collection);
			callback();
		} catch(err) {
			console.log('writeMongoDb error:', err);
		}
	},

	writeFileSystem: function(lastTimestamp, result, callback) {
		fs.appendFile('output/' + lastTimestamp + '.txt', JSON.stringify(result.points), function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('success');
				callback();
			}
		});
	}
}

app.init();

// Schema
// {
// 	"uuid":"e08b78ae-c94f-46a9-ab84-5d6b3b2c2b30",	// Save for posterity
// 	"date":"2013-05-28T08:30:44-07:00",	// Convert to GMT?
// 	"date_ts":1369755044,
// 	"location":{
// 		"position":{
// 			"latitude":47.613439396955,
// 			"longitude":-122.33722561039,
// 			"speed":0,	// What is this unit?
// 			"altitude":36,	// What is this unit?
// 			"heading":10,	// What is this unit?
// 			"horizontal_accuracy":30,
// 			"vertical_accuracy":0
// 		},
// 		"type":"point"	// Will never be any other value?
// 	},
// 	"raw":{
// 		"battery":75	// Don't need; save for posterity?
// 	}
// }