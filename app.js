var fs = require('fs');
var geoloqi = require('geoloqi');
var settings = require('./local_settings')

//##TODO pass this in command line, or use private config file
var session = new geoloqi.Session({'access_token': settings.oauth});


var app = {
	init: function() {
		// fs.appendFile('output/test.txt', (new Date()).getSeconds() + '\r\n', function (err) {
		// 	if (err) {
		// 		console.log(err)
		// 	} else {
		// 		console.log('success')
		// 	}
		// });

		session.get('/location/history?count=10', function(result, err) {
			if(err) {
				throw new Error('There has been an error! '+err);
			} else {
				console.log(result);
			}
		});
	}
}

app.init();