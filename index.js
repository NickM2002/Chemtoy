var express = require('express');
var app = express();
var http = require('http')

app.set('port', 80);

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))

app.get('*', function(req, res) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express HTTP server listening on port ' + app.get('port'));
});