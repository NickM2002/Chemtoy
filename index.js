var express = require('express');
var app = express();
var httpApp = express();
var fs = require('fs');
var http = require('http')
var server = require('https').createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/chemtoy.space/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/chemtoy.space/cert.pem")
}, app).listen(443);
var path = require('path');

httpApp.set('port', 80);
httpApp.get("*", function(req, res, next) {
    res.redirect("https://" + req.headers.host);
});

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))


app.get('/toy', function(req, res) {
    res.sendFile(__dirname + '/public/toy.html');
});

app.get('/team/wilson', function(req, res){
    res.sendFile(__dirname + '/public/team/index.html')
})

app.get('*', function(req, res) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

http.createServer(httpApp).listen(httpApp.get('port'), function() {
    console.log('Express HTTP server listening on port ' + httpApp.get('port'));
});