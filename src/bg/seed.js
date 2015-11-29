
function Seed () {
    this.seedURLs = [];
    
    this.grabBag = [];   
    
    this.settings = [];
    
    this.searchEngines = [];
    
    this.FEED_URLS = [
                      "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&output=rss"
                     ];
};

Seed.prototype.setSettings = function (settings) {
	this.settings = settings;
    
    if (this.settings.useDDG == true) {
		console.log("Using Duck Duck Go.");
		this.searchEngines.push(generateDDGSearchURL);
	} 
	
	if (this.settings.useGoogle == true) {
		console.log("Using Google.");
		this.searchEngines.push(generateGoogleSearchURL);
	} 
	
	if (this.settings.useBing == true) {
		console.log("Using Bing.");
		this.searchEngines.push(generateBingSearchURL);
	} 
	
	if (this.settings.useYahoo == true) {
		console.log("Using Yahoo.");
		this.searchEngines.push(generateYahooSearchURL);
	} 
}

Seed.prototype.setSeedURLs = function (urls) {
	this.seedURLs = [];
	
	for(var i=0; i<urls.length; i++) {
		urls[i].trim;
		if (/^http/.test(urls[i])) {
			console.log("Adding seed URL: ["+urls[i]+"].");
			this.seedURLs.push(urls[i]);
		}
	}	
};

Seed.prototype.getSeed = function(callback) {
	var that = this;
	var decision = randInt(1,3);
	//var decision = 1;
	var seedURL = "";
	
	switch (decision) {
		case 1:
            console.log("[GetSeed] Search Engine.");
            this.getSearchSeed(
                function(phrase) {
                    var size = that.searchEngines.length;
                    
                    if (phrase == null || size < 1) {
                        console.log("[GetSeed] >>No seed phrase returned! Retrying.");
                        callback(null);
                    } else {
                        callback(that.searchEngines[randInt(0,size-1)](phrase));
                    }
                }
            );
            break;
		case 2:
			console.log("[GetSeed] Grab Bag. ["+this.grabBag.length+"]");
			if (this.grabBag.length > 0) {
				var randomGrabBag = randInt(0, this.grabBag.length-1);
				var gb = this.grabBag.splice(randomGrabBag, 1);
				var p = this.createPhrase(gb);
				console.log("[GetSeed] >>Grab Bag: ["+gb+"]["+p+"]");
                var size = that.searchEngines.length;
                if (p == null || size < 1) {
                    console.log("[GetSeed] >>No Grab Bag phrase returned! Retrying.");
                    callback(null);
                } else {
                    callback(that.searchEngines[randInt(0,size-1)](p));
                }

			} else {
                console.log("[GetSeed] >>Nothing in Grab Bag! Retrying.");
                callback(null);
            }
            break;
		case 3:
			// Get a user provided seed URL
            console.log("[GetSeed] User Seed.");
			seedURL = this.getUserSeedURL(this);
            
            console.log("[GetSeed] >>User Seed URL Selected: ["+seedURL+"]");
            callback(seedURL);
			break;
	}	
};

Seed.prototype.getSearchSeed = function (callback) {
    var i = randInt(0, this.FEED_URLS.length-1);
	getRandomPhrase(this.FEED_URLS[i], callback, this);
};	

Seed.prototype.createPhrase = function (phrase) {
	var newPhrase = "";
	//console.log("createPhrase("+phrase+")");
	if ((typeof phrase == 'string' || phrase instanceof String) && phrase != "") {
		//console.log("createPhrase - OK");
	} else {
		//console.log("createPhrase - toString()");
		phrase = phrase.toString();
	}
	
	try {
		var words = phrase.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(/\s+/);
	} catch (e) {
		//console.log("createPhrase() Exception! ["+e+"]");
		return newPhrase;
	}
	words = words.filter(isPreposistion);
	words = words.filter(isIndefiniteArticle);
	var searchPhraseMax = Math.floor(words.length/(100/this.settings.searchPhraseMaxPercent));
	var phraseLength = randInt(Math.floor(searchPhraseMax*this.settings.searchPhraseVariance), searchPhraseMax);
	
	// Ensure phrase is at least 1 word
	phraseLength = (phraseLength < 1) ? 1 : phraseLength; 
	
	//console.log("Phrase Length: ["+phraseLength+"]["+this.settings.searchPhraseMinPercent+"]["+this.settings.searchPhraseMaxPercent+"]");
	for(var i=0; i<phraseLength; i++) {
		if (!/^\w/.test(words[i])) break;
		
		if (i != 0) newPhrase += " ";
		
		newPhrase += words[i];
	}
	
	return newPhrase;	
};

Seed.prototype.getUserSeedURL = function (callback) {
	var seedURL = null;
	
	if (this.seedURLs.length > 0) {
		var i = randInt(0, this.seedURLs.length-1);
		seedURL = this.seedURLs[i];
	}
	
	return seedURL;
}
	
function getRandomPhrase(rssURL, callback, that) {
    var articles = [];
    
    $.get(rssURL, function (data) {
        $(data).find("item").each(function () {
            var el = $(this);
            var title = el.find("title").text();
            console.log("Articles: ["+title+"]");
            articles.push(title);
        });
        
        var numOfArticles = articles.length;
        console.log("Number of Articles: ["+numOfArticles+"]");
        if (numOfArticles == 0) {
            // No articles found, so let's try again
            console.log("No Seed articles found, trying again.");
            //that.getSearchSeed(callback);
            callback(null);
        } else {
            var randomArticle = randInt(0,articles.length-1);
            var title = articles[randomArticle];
            console.log("Random Article Title: ["+title+"]");
            
            // Get another article for the Grab Bag
            if (articles.length > 1) {
                var grabBagArticle;
                do {
                    grabBagArticle = randInt(0,articles.length-1);
                } while (grabBagArticle == randomArticle);
                
                that.grabBag.push(articles[grabBagArticle]);
                console.log("Storing Title to Grab Bag: ["+articles[grabBagArticle]+"]");
            }
    
            callback(that.createPhrase(title));
        }
    });
}

function generateDDGSearchURL(phrase) {
	return "https://duckduckgo.com/?q="+encodeURIComponent(phrase);	
}

function generateGoogleSearchURL(phrase) {
	return "https://www.google.com/search?q="+encodeURIComponent(phrase);	
}

function generateBingSearchURL(phrase) {
	return "http://www.bing.com/search?q="+encodeURIComponent(phrase);
}

function generateYahooSearchURL(phrase) {
	return "https://search.yahoo.com/search?p="+encodeURIComponent(phrase);
}

function getSeedURL(that) {
	var seedURL = null;
	
	if (that.seedURLs.length > 0) {
		var i = randInt(0, that.seedURLs.length-1);
		seedURL = that.seedURLs[i];
	}
	
	return seedURL;
}

function isPreposistion(val) {
	return PREPOSITIONS.indexOf(val) == -1;	
}

function isIndefiniteArticle(val) {
	return INDEFINITE_ARTICLES.indexOf(val) == -1;
}

var PREPOSITIONS = [
  "a",
  "abaft",
  "aboard",
  "about",
  "above",
  "absent",
  "across",
  "afore",
  "after",
  "against",
  "along",
  "alongside",
  "amid",
  "amidst",
  "among",
  "amongst",
  "an",
  "anenst",
  "apropos",
  "apud",
  "around",
  "as",
  "aside",
  "astride",
  "at",
  "athwart",
  "atop",
  "barring",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "besides",
  "between",
  "beyond",
  "but",
  "by",
  "circa",
  "concerning",
  "despite",
  "down",
  "during",
  "except",
  "excluding",
  "failing",
  "following",
  "for",
  "forenenst",
  "from",
  "given",
  "in",
  "including",
  "inside",
  "into",
  "lest",
  "like",
  "mid",
  "midst",
  "minus",
  "modulo",
  "near",
  "next",
  "notwithstanding",
  "of",
  "off",
  "on",
  "onto",
  "opposite",
  "out",
  "outside",
  "over",
  "pace",
  "past",
  "per",
  "plus",
  "pro",
  "qua",
  "regarding",
  "round",
  "sans",
  "save",
  "since",
  "than",
  "through",
  "throughout",
  "till",
  "times",
  "to",
  "toward",
  "towards",
  "under",
  "underneath",
  "unlike",
  "until",
  "unto",
  "up",
  "upon",
  "versus",
  "via",
  "vice",
  "with",
  "within",
  "without",
  "worth"
];
var INDEFINITE_ARTICLES = ["a", "an", "the"];
