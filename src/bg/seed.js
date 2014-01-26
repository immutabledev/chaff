
function Seed () {
    this.categories = [];
    this.categoriesGathered = false;
    
    this.seedURLs = [];
    
    this.grabBag = [];   
};

Seed.prototype.gatherSeeds = function (callback) {
	var that = this;
	
	$.ajax({
		url: "http://api.feedzilla.com/v1/subcategories.json",
		type: 'GET',
		dataType: 'json',
		error: function() {
    		console.log("!!Error gathering categories from Feedzilla.");
    		callback(false);
		},
		success: function(result) {
			var tmp = [];
    		for(var i=0; i<result.length; i++) {
        		tmp.push({ "category_id": result[i].category_id, "subcategory_id": result[i].subcategory_id });  
        		//console.log("["+result[i].category_id+"]["+result[i].subcategory_id+"]");
    		}
    		
    		//console.log("tmp length: ["+tmp.length+"]");
    		that.setCategories(tmp);
    		callback(true);
		} 
	});
};

Seed.prototype.setCategories = function (cats) {
	this.categories = cats;	
	this.categoriesGathered = true;
};

Seed.prototype.setSeedURLs = function (urls) {
	this.seedURLs = [];
	
	for(var i=0; i<urls.length; i++) {
		urls[i] = urls[i].trim;
		if (/^http/.test(urls[i])) {
			console.log("Adding seed URL: ["+urls[i]+"].");
			this.seedURLs.push(urls[i]);
		}
	}	
};

Seed.prototype.getSeed = function(callback) {
	var decision = randInt(1,3);
	//var decision = 1;
	var seedURL = "";
	
	switch (decision) {
		case 1:
			if (this.categoriesGathered) {
				this.getSearchSeed(
					function(phrase) {
						if (phrase == null) {
							console.log("No seed phrase returned! Retrying.");
							this.getSeed();
						} else {
							seedURL = "http://www.google.com/search?q="+encodeURIComponent(phrase);
							callback(seedURL);
						}
					}
				);
				break;
			}
		case 2:
			console.log("Grab Bag Title Selected. ["+this.grabBag.length+"]");
			if (this.grabBag.length > 0) {
				var randomGrabBag = randInt(0, this.grabBag.length-1);
				var gb = this.grabBag.splice(randomGrabBag, 1);
				console.log("Grab Bag: ["+gb+"]");
				callback(createPhrase(gb));
				break;	
			}
		case 3:
			// Get a user provided seed URL
			seedURL = getSeedURL(this);
			callback(seedURL);
			break;
		
	}	
};

Seed.prototype.getSearchSeed = function (callback) {
	var i = randInt(0, this.categories.length-1);
	var rssURL = "http://api.feedzilla.com/v1/categories/"+this.categories[i].category_id+"/subcategories/"+this.categories[i].subcategory_id+"/articles.json";
	console.log("Selected random URL: ["+rssURL+"]");
	getRandomPhrase(rssURL, callback, this);
};	
	
function getRandomPhrase(rssURL, callback, that) {
	$.ajax({
		url: rssURL,
		type: 'GET',
		dataType: 'json',
		error: function() {
    		console.log("!!Error gathering articles from Feedzilla with URL ["+rssURL+"].");
    		that.getSearchSeed(callback);
		},
		success: function(result) {
			var numOfArticles = result.articles.length;
			//console.log("Number of Articles: ["+numOfArticles+"]");
			if (numOfArticles == 0) {
				// No articles found, so let's try again
				console.log("No Seed articles found, trying again.");
				that.getSearchSeed(callback);	
			} else {
				var randomArticle = randInt(0,result.articles.length-1);
				var title = result.articles[randomArticle].title;
				console.log("Random Article Title: ["+title+"]");
				
				// Get another article for the Grab Bag
				if (result.articles.length > 1) {
					var grabBagArticle;
					do {
						grabBagArticle = randInt(0,result.articles.length-1);
					} while (grabBagArticle == randomArticle);
					
					that.grabBag.push(result.articles[grabBagArticle].title);
					console.log("Storing Title to Grab Bag: ["+result.articles[grabBagArticle].title+"]");
				}
		
				callback(createPhrase(title));
			}
		}
	});	
}

function getSeedURL(that) {
	var seedURL = null;
	
	if (that.seedURLs.length > 0) {
		var i = randInt(0, that.seedURLs.length-1);
		seedURL = that.seedURLs[i];
	}
	
	return seedURL;
}

function createPhrase(phrase) {
	var newPhrase = "";
	if ((typeof phrase == 'string' || phrase instanceof String) && phrase != "") {
		
	} else {
		phrase.toString();
	}
	
	try {
		var words = phrase.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(/\s+/);
	} catch (e) {
		return newPhrase;
	}
	words = words.filter(isPreposistion);
	words = words.filter(isIndefiniteArticle);
	var phraseLength = randInt(Math.round(words.length/5), Math.floor(words.length/1.5));
	
	// Ensure phrase is at least 1 word
	phraseLength = (phraseLength < 1) ? 1 : phraseLength; 
	
	//console.log("Phrase Length: ["+phraseLength+"]");
	for(var i=0; i<phraseLength; i++) {
		if (!/^\w/.test(words[i])) break;
		
		if (i != 0) newPhrase += " ";
		
		newPhrase += words[i];
	}
	
	return newPhrase;	
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
