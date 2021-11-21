const redis = require('redis');
const client = redis.createClient();

//single value read & write
client.set('my_key', 'Hello World!');
client.get('my_key', (err, reply) => {
	console.log(reply);
});

//multiple value read & write
client.mset('header', 0, 'left', 0, 'article', 0, 'rigth', 0, 'footer', 0);
client.mget(['header', 'left', 'article', 'rigth', 'footer'], (err, value) => {
	console.log(value);
});

client.quit();
