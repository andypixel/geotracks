var fs = require('fs');
var geoloqi = require('geoloqi');
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
			var args = 'count=' + config.historyCount;
			if (ts) args += '&before=' + ts;
			console.log('args: ' + args)
			session.get('/location/history?' + args, function(result, err) {
				if(err) {
					throw new Error(args + ' : ' + err.error_description);
				} else {
					console.log('This batch is ' + result.start.date + ' through ' + result.end.date);
					lastTimestamp = result.start.date_ts;
					
					fs.appendFile('output/' + lastTimestamp + '.txt', JSON.stringify(result.points), function (err) {
						if (err) {
							console.log(err);
						} else {
							console.log('success');

							i++;
							if (i < config.limitTo) {
								getNextBatch(lastTimestamp);
							}
						}
					});
				}
			});
		}
	}
}

app.init();