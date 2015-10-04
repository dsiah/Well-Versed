var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var request = require('request');
var btoa = require('btoa');

var app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use(morgan('combined'));

var indico = require('indico.io');
indico.apiKey = 'adbd90dfcbcdfb52656b5e2113a49c53';

app.post('/summarize', function(req, res) {
    // console.log('recieved post request with body: ' + JSON.stringify(req.body));
    res.set({
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': "*"
            });
    var body = req.body['str'];
    summarize(body, function(err, data) {
        if(err) {
            return console.warn('ERROR: ' + err);
        } else {
            return(res.end(data));
        }
    });
});

    function summarize(text, fun) {
        console.log("Raw text = " + text)
        request({
            url: 'https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases', //URL to hit
            qs: {'text' : text}, //Query string data
            method: 'GET', //Specify the method
            headers: { //We can define headers too
                'Authorization': 'Basic ' + btoa('AccountKey:QN98hNEWbua9ag8YDVPodtOHXHoHzPRMLlDnwvWW9lk'),
                'Accept': 'application/json'
            }
        }, function(error, response, body) {
            if(error) {
                console.warn(fun(error));
            } else {
                console.log('Key phrases = ' + JSON.parse(body)['KeyPhrases']);
                namedEntities(JSON.parse(body)['KeyPhrases'], fun);
            }
        });
    }

    function namedEntities(text, fun) {
        indico.namedEntities(text)
          .then(function(result) {
              console.log("Named entity recognition = " + JSON.stringify(result));
              fun(null, JSON.stringify(result));
          }).catch(function(err) {
              fun(console.warn(err));
          });
    }

app.listen(process.argv[2]);
console.log('Starting server on port ' + process.argv[2]);
