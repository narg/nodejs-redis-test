var host = '127.0.0.1',
	async = require('async'),
	moment = require('moment'),
	CachemanRedis = require('cacheman-redis'),
	redis = require('redis'),
    redisClient = redis.createClient(6379, host, {}),
    cacheClient = new CachemanRedis(redisClient); 

redisClient.on('error', function (error) {
    console.log('Error I => ', error);
});

var startTime = moment();

redisClient.keys('*', function (error, keys) {

	console.log('Break time:', moment().diff(startTime), 'mili seconds');

	if (error) {
		return console.log('Error II => ', error);
	}

	async.mapLimit(keys, 50, function(key, callback) {
		var redisClient = redis.createClient(6379, host, {});
    	var cacheClient = new CachemanRedis(redisClient); 

		cacheClient.get(key, function(error, value) {
			redisClient.quit();
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

		redisClient.quit();
	});
});
