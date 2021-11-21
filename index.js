const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();

//init values
client.mset('header', 0, 'left', 0, 'article', 0, 'right', 0, 'footer', 0);
client.mget(['header', 'left', 'article', 'right', 'footer'], (err, value) => {
	console.log(value);
});

const data = () => {
	return new Promise((resolve, reject) => {
		client.mget(
			['header', 'left', 'article', 'right', 'footer'],
			(err, value) => {
				const data = {
					header: Number(value[0]),
					left: Number(value[1]),
					article: Number(value[2]),
					right: Number(value[3]),
					footer: Number(value[4]),
				};
				err ? reject(null) : resolve(data);
			}
		);
	});
};

// serve statics files from public directory
app.use(express.static('public'));

// get data
app.get('/data', function (req, res) {
	data().then((data) => {
		console.log(data);
		res.send(data);
	});
});

// update data
app.get('/update/:key/:value', function (req, res) {
	const key = req.params.key;
	let value = Number(req.params.value);
	client.get(key, (err, reply) => {
		// new value
		value = Number(reply) + value;
		client.set(key, value);

		// return data to client
		data().then((data) => {
			console.log(data);
			res.send(data);
		});
	});
});

app.listen(3000, function () {
	console.log('Running on port: 3000');
});
