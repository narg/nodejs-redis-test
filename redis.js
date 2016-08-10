var host = '127.0.0.1',
	async = require('async'),
	redis = require('redis'),
	moment = require('moment'),
    client = redis.createClient(6379, host, {});

client.on('error', function (error) {
    console.log('Error I => ', error);
});

var startTime = moment();

client.keys('*', function (error, keys) {

	console.log('Break time:', moment().diff(startTime), 'mili seconds');

	if (error) {
		return console.log('Error II => ', error);
	}

	async.mapLimit(keys, 50, function(key, callback) {
		var clientx = redis.createClient(6379, host, {});
		clientx.get(key, function(error, value) {
			clientx.quit();
			callback(error, value);
		});
	},
	function(errors, results) {
		if (error) {
			console.log('Error III => ', errors);
		} else {
			console.log('Success');
		}

		console.log('Elapsed time:', moment().diff(startTime), 'mili seconds');

		client.quit();
	});
});
