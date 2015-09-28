var jsdom = require('jsdom'),
	request = require('request'),
	async = require('async'),
	_cleanText = function(text){
		return text
		.replace(/(^[\s]+|\\n|\\r|\\t|[\s]+$)/g,'')
		.replace(/(^[\s]+|\n|\r|\t|[\s]+$)/g,'')
		.replace(/  +/g, ' ');
	},
	_buildSelector = function(config){
		if(!config || !config.tag || config.tag=='') return false;
		var selector = config.tag;
		if(config.nameAttr && config.nameAttr!='' && config.nameValue && config.nameValue!='') 
			selector += '[' + config.nameAttr + '=\'' + config.nameValue + '\']';
		return selector;
	},
	_parseHtml = function(html,htmlDataPoints,next){
		try{
			jsdom.env({
				html: html,
				scripts: ["http://code.jquery.com/jquery.js"],
				done: function(err,dom){
					if(err){
						console.log("jsdom error:",err)
						next(err);
					}
					var $ = dom.$,
						results = [],
						htmlDataPoints = Object.create(htmlDataPoints);

					for(var h=0,len=htmlDataPoints.length;h<len;h++){
						var dataPoint = htmlDataPoints[h],
							selector = _buildSelector(dataPoint);
						$(selector).each(function(index,element){
							var value,
								name = dataPoint.tag;
							if(dataPoint.nameValue && dataPoint.nameValue!='') name += '.' + dataPoint.nameValue;

							// Get value
							if(dataPoint.valueAttr && dataPoint.valueAttr!='') 
								value = $(element).attr(dataPoint.valueAttr);
							else{
								$(element).find('script').remove();
								value = $(element).text();
							}
							results.push({
								name: name,
								value: _cleanText(value)||'',
								weight: dataPoint.weight
							});
						});
					}
					next(null,results);
				}
			});
		}catch(e){
			console.log(e)
			next(e);
		}
	},
	_matchKeywords = function(compiledKeywords,url,parsedHtmlDataPoints,urlWeight,next){
		var keywordRegex = new RegExp('(\\b'+compiledKeywords.replace(/,/g,'\\b|\\b')+'\\b)','gim');
		var urlKeywordRegex = new RegExp('('+compiledKeywords.replace(/,/g,'|')+')','gim');
		var keywordMatches = {};

		// First, manually add a dataPoint for the URL.
		parsedHtmlDataPoints.push({
			name: 'url',
			value: url.substring(0),
			weight: urlWeight
		});
		// Now find and aggregate matches for each html data point.
		for(var p=0,len=parsedHtmlDataPoints.length;p<len;p++){
			var dataPoint = parsedHtmlDataPoints[p];
			var matches = dataPoint.value.match(['url','link.canonical'].indexOf(dataPoint.name)!=-1 ? urlKeywordRegex:keywordRegex);
			var aggregateMatches = {};
			// Convert matches results to lowercase.
			for(var m=0,l=matches?matches.length:0;m<l;m++){
				matches[m] = matches[m].toLowerCase();
				if(typeof aggregateMatches[matches[m]]=='undefined')
					aggregateMatches[matches[m]] = {
						count: 1,
						weight: dataPoint.weight
					};
				else
					aggregateMatches[matches[m]].count += 1;
			};
			keywordMatches[dataPoint.name] = aggregateMatches;
		}
		next(null,keywordMatches);
	},
	_scoreMatches = function(keywordMatches,next){
		var aggregateScores = {},
			matches = {};
		for(var m in keywordMatches){
			if(!keywordMatches.hasOwnProperty(m))continue;
			var dataPoint = keywordMatches[m];
			matches[m] = [];
			for(var p in dataPoint){
				if(!dataPoint.hasOwnProperty(p))continue;
				matches[m].push(p);
				if(typeof aggregateScores[p]=='undefined'){
					aggregateScores[p] = {
						count: dataPoint[p].count,
						score: dataPoint[p].count * dataPoint[p].weight
					}
				}
				else{
					aggregateScores[p].count += dataPoint[p].count;
					aggregateScores[p].score += (dataPoint[p].count * dataPoint[p].weight);
				}
			}
		}
		next(null,{
			scores: aggregateScores,
			matches: matches
		})
	};

module.exports = function(config){
	return {
		scrape: function(compiledKeywords, url, next){
			try{
				var request = require('request'),
					canonical = url;
				request.get(url,function(err,res,body){
					if(err){
						next({isError:true,message:"We couldn't access that address."},null);
						return;
					}
					if(res.statusCode!=200){
						next({isError:true,message:"We couldn't access that address."},null);
						return;
					}
					else{
						async.waterfall(
							[
								function(scrapeWorkflowNext){
									_parseHtml(body,config.htmlDataPoints,scrapeWorkflowNext);
								},
								function(parsedHtmlDataPoints,scrapeWorkflowNext){
									// A special case for link.canonical to store the value.
									for(var p=0,len=parsedHtmlDataPoints.length;p<len;p++){
										if(parsedHtmlDataPoints[p].name == 'link:canonical')
											canonical = parsedHtmlDataPoints[p].value;
									}
									_matchKeywords(compiledKeywords,url,parsedHtmlDataPoints,config.urlWeight,scrapeWorkflowNext);
								},
								function(keywordMatches,scrapeWorkflowNext){
									_scoreMatches(keywordMatches,scrapeWorkflowNext);
								}
							],
							function(err,result){
								result.url = url;
								result.canonical = canonical;
								next(err,result);
							}
						);
					}
				});
			}catch(e){
				console.log(e)
				next(e);
			}
		}
	};
}