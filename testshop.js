/**
 * @Author: John Isaacs <john>
 * @Date:   13-Feb-182018
 * @Filename: testshop.js
 * @Last modified by:   john
 * @Last modified time: 14-Feb-182018
 */



const http = require('http'),
  fs = require('fs');
  var querystring = require('querystring');
  var url = require('url');
const port = 4000

var products =["Pear myPhone", "bixel2","2+3 haxxor phone"];

var pairs = [];
const requestHandler = (request, response) => {
  console.log(request.url)

  var filePath = '.' + request.url;
  response.writeHead(200, {
    'Set-Cookie': 'DiscountAgreed=25',
    'Content-Type': 'text/html;charset=UTF-8',

  });
  response.write("<html><body>");
  response.write("<h1>Welcome to the shop</h1>");


  var post;
  var query = "";
  var cookies = "";
  var product = 0;
  var price = 0;
  var quantity = 0;
  var discount = 0;



  if (request.method == 'POST') {
    var body = '';

    request.on('data', function(data) {
      body += data;
      if (body.length > 1e6)
        request.connection.destroy();
    });

    request.on('end', function() {
      try{
       post= querystring.parse(body);
       var cookies = parseCookies(request);
        if (filePath.split('?')[0] ==  './cookieshop') {

          discount = cookies.DiscountAgreed;
          query = url.parse(request.url,true).query;
          product = parseInt(query.prod);
          price = post.price;
          quantity = post.quantity;


          response.write("<h1>Your Basket</h1>");
          response.write("<h2>Product = "+products[product]+"</h2>");
          response.write("<h2>Quantity = "+quantity+"</h2>");
          response.write("<h2>Unit Price = £"+price+"</h2>");
          response.write("<h2>Discount = "+discount+"%</h2>");
          response.write("<h2>Total = £"+((quantity * price)-((quantity * price)*(0.25)))+"</h2>");
          response.end('</body></html>');


       } else if (filePath.split('?')[0] == './parametershop') {
         query = url.parse(request.url,true).query;
         product = parseInt(query.prod);
         price = post.price;
         quantity = post.quantity;
         var referer = request.headers.referer
         if (referer == "http://rgu.ac.uk"){

        console.log(referer);
        response.write("<h1>Your Basket</h1>");
        response.write("<h2>Product = "+products[product]+"</h2>");
        response.write("<h2>Quantity = "+quantity+"</h2>");
        response.write("<h2>Unit Price = £"+price+"</h2>");
        response.write("<h2>Total = £"+(quantity * price)+"</h2>");
        response.end('</body></html>');
      }
      else{
        response.write("<h1>SORRY THIS IS FOR RGU CUSTOMERS ONLY</h1>");
        response.end('</body></html>');
      }

       }
       else if (filePath.split('?')[0] == './validationshop') {
         query = url.parse(request.url,true).query;
         product = parseInt(query.prod);
         price = post.price;
         quantity = post.quantity;


        response.write("<h1>Your Basket</h1>");
        response.write("<h2>Product = "+products[product]+"</h2>");
        response.write("<h2>Quantity = "+quantity+"</h2>");
        response.write("<h2>Unit Price = £"+price+"</h2>");
        response.write("<h2>Total = £"+(quantity * price)+"</h2>");
        response.end('</body></html>');

       } else if (filePath.split('?')[0] == './fieldshop') {
          query = url.parse(request.url,true).query;
          product = parseInt(query.prod);
          price = post.price;
          quantity = post.quantity;


         response.write("<h1>Your Basket</h1>");
         response.write("<h2>Product = "+products[product]+"</h2>");
         response.write("<h2>Quantity = "+quantity+"</h2>");
         response.write("<h2>Unit Price = £"+price+"</h2>");
         response.write("<h2>Total = £"+(quantity * price)+"</h2>");
         response.end('</body></html>');
       }
     }
     catch (err){
       response.write("<h2>SERVER ERROR</h2>");
       response.end('</body></html>');
     }

    });

  }
else{
  try{
  if (filePath == './') {
    response.write("<h2>Index page - nothing here </h2>");
  }
  else if (filePath == './shopHidden') {
    fs.readFile('./shopHidden.html', function(err, html) {
      if (err) {
        throw err;
      }
      console.log("here");
        response.write(html);
        response.end('</body></html>');
    });

  }else if (filePath == './shopCookie') {
    fs.readFile('./shopCookie.html', function(err, html) {
      if (err) {
        throw err;
      }
        response.write(html);
        response.end('</body></html>');
    });

  }
  else if (filePath == './shopParameter') {
    fs.readFile('./shopParameter.html', function(err, html) {
      if (err) {
        throw err;
      }
        response.write(html);
        response.end('</body></html>');
    });

  }
  else if (filePath == './shopValidation') {
    fs.readFile('./shopValidation.html', function(err, html) {
      if (err) {
        throw err;
      }
        response.write(html);
        response.end('</body></html>');
    });

  }
  else{
    response.end('</body></html>');
  }
}
catch(err){
  response.write("<h2>SERVER ERROR</h2>");
  response.end('</body></html>');
}
}




}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
