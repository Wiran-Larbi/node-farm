// import fs from 'fs';
const fs = require("fs");
const http = require("http");
const url = require("url");

// ? Handlers
const bindTemplate = require('./utils/bindTemplate');


///////////////////////////////////////////////////
// ? Servers :
const dev_data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dev_data_obj = JSON.parse(dev_data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');



const server = http.createServer((req,res) => {

    const {pathname:path,query} = url.parse(req.url,true);
    let output;

    switch (path) {
        
        //? Root Page
        case "/": 
            res.end('Hello From Node Farm Server ...');
            break;

        //? Overview Page
        case "/overview": //
            res.writeHead(200,{'Content-type': 'text/html'});
            const cards = dev_data_obj.map(product => bindTemplate(templateCard,product)).join('');
            output = templateOverview.replace('{%PRODUCT_CARDS%}',cards);

            res.end(output);
            break;

        //? Product Page    
        case "/product":
            res.writeHead(200,{'Content-type': 'text/html'});
            const product = dev_data_obj[query.id];
            output = bindTemplate(templateProduct,product);

            res.end(output);
            break;
        
        //? Api Page
        case "/api":
            
            res.writeHead(200,{'Content-type': 'application/json'});
            res.end(dev_data);
            console.log(dev_data_obj);

            break;
    
        default:
            res.writeHead(404, {
                'Content-type': 'text/html'
            });
            res.end('<h3 style="color:orangered;">Page not found. Try Something else ...</h1>');
            break;
    }
});

server.listen(3002,'127.0.0.1', () => {
    console.log('Listening on http://localhost:3002');
});



