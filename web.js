var express = require('express');
var fs      = require('fs');

var app = express.createServer(express.logger());
var buf = new Buffer(fs.readFileSync('indexrev.html'));


app.get('/', function(request, response) {


    response.setHeader('content-type','text,html');


    console.log(buf);
    response.send(buf);
});





var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
