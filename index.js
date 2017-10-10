'use strict';
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const server = http.createServer();
const port = 3000;

function handler(req, res) {
	let data = '';
	req.on('data', function (chunk) {
		data += chunk;
	});
	
	req.on('end', () => {
		res.writeHead(200, 'OK', {'Content-Type': 'text/html; charset=utf8'});
		res.write("<form action='.' method='post'><input type='text' name='inName' /><input type='submit' value='Отправить'></form>");
		res.write(creatQuery(data));
		res.end();
	});
}

function creatQuery(data) {
	console.log('inName - ', data);
	let post = querystring.parse(data);
	let url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df&text=' + post.inName + '&lang=en-ru';
	let content = 'NoData';

	https.get(url, (res) => {
	  let rawData = '';
	  res.on('data', (chunk) => rawData += chunk);
	  res.on('end', () => {
		let parsedData = JSON.parse(rawData);
		let content = parsedData.text[0];
		  console.log('Перевод - ', content);
	  });
	})
	return content;
}

server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
	console.log('Start HTTP on port %d', port);
});
server.listen(port);