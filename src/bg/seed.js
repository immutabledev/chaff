function Seed () {
    this.categories = [];
    this.categoriesGathered = false;
    
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
    		callback();
		},
		success: function(result) {
			var tmp = [];
    		for(var i=0; i<result.length; i++) {
        		tmp.push({ "category_id": result[i].category_id, "subcategory_id": result[i].subcategory_id });  
        		//console.log("["+result[i].category_id+"]["+result[i].subcategory_id+"]");
    		}
    		
    		//console.log("tmp length: ["+tmp.length+"]");
    		that.setCategories(tmp);
    		callback();
		} 
	});
};

Seed.prototype.setCategories = function (cats) {
	this.categories = cats;	
	this.categoriesGathered = true;
};

Seed.prototype.getSearchSeed = function (callback) {
	//console.log("Length: ["+this.categories.length+"]");
	var strategy = randInt(1,2);
	switch (strategy) {
		case 1:
			console.log("Grab Bag Title Selected. ["+this.grabBag.length+"]");
			if (this.grabBag.length > 0) {
				callback(createPhrase(this.grabBag.pop()));
				break;	
			}
		case 2:
			if (this.categoriesGathered) {
				var i = randInt(0, this.categories.length-1);
				var rssURL = "http://api.feedzilla.com/v1/categories/"+this.categories[i].category_id+"/subcategories/"+this.categories[i].subcategory_id+"/articles.json";
				console.log("Selected random URL: ["+rssURL+"]");
				getRandomPhrase(rssURL, callback, this);
			} else {
				callback(null);
			}
			break;
	}
	
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

function createPhrase(phrase) {
	var words = phrase.split(/\s+/);
	var phraseLength = randInt(Math.round(words.length/5), Math.floor(words.length/1.5));
	
	// Ensure phrase is at least 1 word
	phraseLength = (phraseLength < 1) ? 1 : phraseLength; 
	
	var newPhrase = "";
	//console.log("Phrase Length: ["+phraseLength+"]");
	for(var i=0; i<phraseLength; i++) {
		if (!/^\w/.test(words[i])) break;
		
		if (i != 0) newPhrase += " ";
		
		newPhrase += words[i].replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
	}
	
	return newPhrase;	
}

