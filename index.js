const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {
	const {query, pathname} = url.parse(req.url, true);
	
	if(pathname === '/' || pathname === '/overview'){
		res.writeHead(200, {'Content-type': 'text/html'});
		const cardsHtml = dataObj.map(el => replaceTemplate(cardTemplate, el)).join('');
		const output = overviewTemplate.replace('{%product_cards%}', cardsHtml)
		res.end(output)
	} else if (pathname === '/product'){
		res.writeHead(200, {'Content-type': 'text/html'});
		const product = dataObj[query.id]
		const output = replaceTemplate(productTemplate, product);
		res.end(output);
	} else {
		res.writeHead(404, {'Content-type': 'text/html'})
		res.end('<h1>page not found</h1>')
	}
})

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000')
})