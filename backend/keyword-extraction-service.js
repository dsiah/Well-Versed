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
            data[Object.keys(data)[0]]['origTitle'] = body;
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
                var keyPhrases = JSON.parse(body)['KeyPhrases'];
                console.log('Key phrases = ' + keyPhrases);
                news(keyPhrases, fun);
            }
        });
    }

/*
    function namedEntities(text, fun) {
        indico.namedEntities(text)
          .then(function(result) {
              console.log('Named entity recog = ' + JSON.stringify(result));
              result = result.filter(function(map) { return Object.keys(map).length; })[0];
              Object.keys(result).forEach(function(key) {
                  var oldVal = result[key];
                  result[key] = {'namedEntitities': oldVal};
              });
              newsFromNamedEntities(result, fun);
          }).catch(function(err) {
              fun(console.warn(err));
          });
    }
*/

    function news(namedEntities, fun) {
        var newKey = "";
        // Hacky way to construct URL
        var hackedUrl = 'https://api.datamarket.azure.com/Bing/Search/v1/News?' + "Query=" + "%27";
        namedEntities = namedEntities.filter(function(name) { return name[0] == name[0].toUpperCase() }).slice(0, 4);
        namedEntities.forEach(function(entity) {
            newKey += entity + ' ';
            hackedUrl += entity + '%27';
        });
        console.log('new key = ' + newKey);
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
                console.log('body = ' + JSON.stringify(body));
                var newsArticles = [];
                body['d']['results'].forEach(function(metadata) {
                    var pruned = {};
                    pruned['Title'] = metadata['Title'];
                    pruned['Url'] = metadata['Url'];
                    newsArticles.push(pruned);
                });
                console.log('news = ' + newsArticles);
                // namedEntities[newKey]['news'] = newsArticles;
                var summary = {};
                summary[newKey] = {'news': newsArticles};
                console.log("Current summary = " + JSON.stringify(summary))
                summaryFromWiki(summary, fun);
            }
        });
    }

    function summaryFromWiki(summary, fun) {
        keys = [];
        Object.keys(summary).forEach(function(x) {keys.push(x)});
        console.log('keys = ' + keys);
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
                return fun(null, summary);
            });
        });
    }

app.listen(process.argv[2]);
console.log('Starting server on port ' + process.argv[2]);
