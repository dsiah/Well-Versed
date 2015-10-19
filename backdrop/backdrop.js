var indico = require('indico.io');
var btoa = require('btoa');
var Q = require('q');
var request = require('request-promise');
var wikipedia = require('wikipedia-js');

indico.apiKey = '37486d14726ba66828c08209e66e241c';

var NUM_IMAGES = 3;
var NUM_NEWS_ARTICLES = 5;
var NUM_TEXT_TAGS = 3;

function backdrop (text) {
    backdrop = {};
    // Get keywords from text, then hit Bing News API
    var newsPromise = indico.keywords(text).then(function(keywords) {
        backdrop['keywords'] = keywords;
        return keywords;
    }).then(bingNews)
      .then(function(news) {
      	backdrop['news'] = news;
      }).catch(console.warn);

    // Get named entities, then hit wiki summary and Bing Image API for each named entity
    var namedEntsPromise = indico.named_entities(text).then(function(namedEnts) {
        backdrop['named_entities'] = namedEnts;
        return Object.keys(namedEnts);
    }).then(function(entities) {
        var deferred = Q.defer();
        var allPromises = [];
        // Grab wiki-summary and bing images for each entity
        entities.forEach(function(entity) {
            allPromises.push(allInfoForNamedEnt(entity))
        });
        // Only fulfill promise once all info for all entities is returned
        Q.all(allPromises).then(function(allInfo) {
            deferred.resolve(allInfo);
        }).catch(deferred.reject);
        return deferred.promise;
        // allInfo contains lists of {entity -> {images: ..., summary...}}
    }).then(function(allInfo) {
        for (var  i = 0; i < allInfo.length; ++i) {
            var entity = Object.keys(allInfo[i])[0];
            backdrop[entity] = {};
            Object.keys(allInfo[i][entity]).forEach(function (info) {
                backdrop[entity][info] = allInfo[i][entity][info];
            });
        }
      }).catch(console.warn);

    // Get text tags
    var textTagsPromise = indico.textTags(text, {top_n: NUM_TEXT_TAGS}).then(function(tags) {
        backdrop['textTags'] = tags;
    }).catch(console.warn);
    
    // Wait for all information to be gathered, then return it all 
    var deferred = Q.defer();
    var allPromises = Q.all([newsPromise, namedEntsPromise, textTagsPromise]);
    allPromises.then(function(res) {
        deferred.resolve(backdrop);
    }).catch(deferred.reject);
    return deferred.promise;
};

// Takes in an entity and returns all relevant information for
// that entity as a map {entity: {image: ..., summary: ..., etc.}}
function allInfoForNamedEnt(entity) {
    var deferred = Q.defer();
    var allInfo = {};
    allInfo[entity] = {};
    Q.all([bingImages(entity), wikiSummary(entity)]).then(function (info) {
        allInfo[entity]['images'] = info[0];
        allInfo[entity]['summary'] = info[1];
        deferred.resolve(allInfo);
    }).catch(deferred.reject);
    return deferred.promise;
}

// Returns promise that when fulfilled will return all relevant
// bing images for the given keyword
function bingImages(keyword) {
    var deferred = Q.defer();
    var url = constructBingUrl([keyword], 'Image');
    bingOptions = bingReqOptions(url);

    request(bingOptions).then(function(body) {
        var images = [];
        for (var i = 0; i < NUM_IMAGES; ++i) {
            var result = body['d']['results'][i];
            var full_image = result['MediaUrl'];
            var thumbnail = result['Thumbnail']['MediaUrl'];
            images.push({'full_image': full_image,
                         'thumbnail':thumbnail});
        }
        deferred.resolve(images);
    }).catch(deferred.reject);

    return deferred.promise;
}

// Returns promise that when fulfilled will return all relevant
// news to the given keywords
function bingNews(keywords) {
	// Ignore weights for now, and only take two keywords because Bing
	// API seems to not send full results often for 3 keywords
	var deferred = Q.defer();
	var keywords = Object.keys(keywords).slice(0, 2);
    var url = constructBingUrl(keywords, 'News');
    var bingOptions = bingReqOptions(url);

    request(bingOptions).then(function(body) {
        var newsArticles = [];
        var numArticlesReturned = Object.keys(body['d']['results']).length;
        for (var i = 0; i < NUM_NEWS_ARTICLES && i < numArticlesReturned; ++i) {
            var result = body['d']['results'][i];
            var title = result['Title'];
            var url = result['Url'];
            newsArticles.push({'title': title, 'url': url});
        }
        deferred.resolve(newsArticles);
    }).catch(deferred.reject);

    return deferred.promise;
}

// returns a bing search url for the given keywords
// Example media types are 'News', 'Image', etc.
function constructBingUrl(keywords, mediaType) {
	var hackedUrl = 'https://api.datamarket.azure.com/Bing/Search/v1/' + mediaType + '?Query=' + "%27";
	    keywords.forEach(function(word) {
        hackedUrl += word + '%27';
    });
    hackedUrl += '&$format=json';
    return hackedUrl;
}

// Returns the necessary bing options (headers + API key) to
// pass along for get requests
function bingReqOptions(url) {
    bingOptions = {
        url: url,
        method: 'GET',
        headers: { //We can define headers too
            'Authorization': 'Basic ' + btoa('AccountKey:QN98hNEWbua9ag8YDVPodtOHXHoHzPRMLlDnwvWW9lk'),
            'Accept': 'application/json'
        },
        json: true
    }
    return bingOptions;
}

// returns a wikipedia summary for the given entity
function wikiSummary(entity) {
	var deferred = Q.defer();
	var options = {query: entity, format: "html", summaryOnly: true};
	wikipedia.searchArticle(options, function(err, html) {
		if(err) {
			deferred.reject(err);
		}
		deferred.resolve(html);
	});
	return deferred.promise;
}

module.exports = backdrop;
