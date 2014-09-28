var fs = require('fs');

var app = {
	init: function() {
		fs.appendFile('output/test.txt', (new Date()).getSeconds() + '\r\n', function (err) {
			if (err) {
				console.log(err)
			} else {
				console.log('success')
			}
		});
	}
}

app.init();