// Runs server that listens for post requests at /summarize with text
// in the http request body associated with the 'str' key, then runs the text
// through the text-backdrop npm module and returns the results
var backdrop = require('text-backdrop');
var express = require('express');
var bodyparser = require('body-parser');
var morgan = require('morgan');
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('combined'));

app.post('/summarize', function (req, res) {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    var text = req.body['str'];
    backdrop(text).then(function(data) {
        res.end(JSON.stringify(data));
    }).catch(function(err) {
        res.status(500).send(err);
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Well-Versed backend listening at http://%s:%s', host, port);
});
