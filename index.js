const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8'); // Async wait for filesync with another thread
console.log("__dirname or pwd =  "+__dirname); // same as pwd PWD 
const laptopData = JSON.parse(json);



const server = http.createServer((req,res) =>{

    const pathName = url.parse(req.url,true).pathname;
    console.log(pathName);
    const query = url.parse(req.url,true).query;
    const id = url.parse(req.url,true).query.id;
    // http://127.0.0.1:1333/laptop?id=3&name=apple&date=today
    //console.log("QUERY "+query);
    // const SearchArray = [];
    // const SearchArrayID = [];
    // SearchArray.push(query);
    // SearchArray.map(el => SearchArrayID.push(el.id));
    // console.log(SearchArrayID);

    // SearchArray.forEach(el=>{
    //     extract(el);
    // });

    // function extract(e) {
    //     console.log("Element ID: " + e.id);
    // }

    //PRODUCT OVERVIEW 

    if(pathName ===  '/products' || pathName === '' ) {
        res.writeHead(200,{ 'content-type':'text/html'});
        //res.end(pathName);

        fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8',(err,data) =>{
            let overviewOutput = data;
                fs.readFile(`${__dirname}/templates/template-card.html`,'utf-8',(err,data) =>{
                    const cardsOutput = laptopData.map(el => replaceTemplate(data,el)).join('');
                    overviewOutput = overviewOutput.replace('{%CARDS%}',cardsOutput);
                    res.end(overviewOutput);
                 });
         });
    } 

     // IMAGES
     else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    
    //LAPTOP DETAIL
    
    else if (pathName === "/laptop" && id < laptopData.length) {
        res.writeHead(200,{'content-type':'text/html'});
        //res.end(`Laptops!!! ${id}`);
        //res.end(__dirname);
        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8',(err,data) =>{
           if (err) {
               console.log(err);
           } else {
                const laptop = laptopData[id];
                const output = replaceTemplate(data,laptop);
                res.end(output);
            }
        });
    } else {
        res.writeHead(404,{'content-type':'text/html'});
        res.end("Nothing!!");
    }
    

    
});
server.listen(1333,"127.0.0.1",()=>{
    console.log("Listening on 1333");
});



function replaceTemplate(originalHTML,laptop) {

    let output = originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName);

        output = output.replace(/{%IMAGE%}/g,laptop.image);
        output = output.replace(/{%PRICE%}/g,laptop.price);
        output = output.replace(/{%SCREEN%}/g,laptop.screen);
        output = output.replace(/{%CPU%}/g,laptop.storage);
        output = output.replace(/{%STORAGE%}/g,laptop.ram);
        output = output.replace(/{%RAM%}/g,laptop.description);
        output = output.replace(/{%DESCRIPTION%}/g,laptop.description);
        output = output.replace(/{%ID%}/g,laptop.id);

    return output;
}