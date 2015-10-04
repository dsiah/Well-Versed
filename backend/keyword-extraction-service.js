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
            data = JSON.stringify(data);
            console.log('Final Summary = ' + data);
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
                namedEntities(JSON.parse(body)['KeyPhrases'], fun);
            }
        });
    }

    function namedEntities(text, fun) {
        indico.namedEntities(text)
          .then(function(result) {
              result = result[0];
              Object.keys(result).forEach(function(key) {
                  var oldVal = result[key];
                  result[key] = {'namedEntitities': oldVal};
              });
              newsFromNamedEntities(result, fun);
          }).catch(function(err) {
              fun(console.warn(err));
          });
    }

    function newsFromNamedEntities(namedEntities, fun) {
        // Hacky way to construct URL
        var hackedUrl = 'https://api.datamarket.azure.com/Bing/Search/v1/News?' + "Query=" + "%27";
        Object.keys(namedEntities).forEach(function(entity) {
            hackedUrl += entity + '%27';
        });
        hackedUrl += '&$format=json';
        console.log('URL = ' + hackedUrl);
        request({
            url: hackedUrl, // Url to hit
            method: 'GET', //Specify the method
            headers: { //We can define headers too
                'Authorization': 'Basic ' + btoa('AccountKey:QN98hNEWbua9ag8YDVPodtOHXHoHzPRMLlDnwvWW9lk'),
                'Accept': 'application/json'
            }
        }, function(error, response, body) {
            if(error) {
                console.warn(fun(error));
            } else {
                body = JSON.parse(body);
                var newsArticles = [];
                body['d']['results'].forEach(function(metadata) {
                    var pruned = {};
                    pruned['Title'] = metadata['Title'];
                    pruned['Url'] = metadata['Url'];
                    newsArticles.push(pruned);
                });
                namedEntities['news'] = newsArticles;
                summaryFromWiki(namedEntities, fun);
            }
        });
    }

    function summaryFromWiki(summary, fun) {
        keys = [];
        Object.keys(summary).forEach(function(x) {keys.push(x)});
        keys.forEach(function(key) {
            var python = require('child_process').spawn(
                 'python',
                 // second argument is array of parameters, e.g.:
                 ["wiki-summary.py"
                 , key 
                 , 2]
            );
            var output = "";
            python.stdout.on('data', function(data){ output += data });
            python.on('close', function(code){ 
                if (code !== 0) {  return fun(code) }
                console.log('output = ' + output);
                summary[key]['wiki'] = output;
                console.log('summary = ' + JSON.stringify(summary));
                return fun(null, summary);
            });
        });
    }

app.listen(process.argv[2]);
console.log('Starting server on port ' + process.argv[2]);
