chrome.extension.onMessage.addListener(function(req, sender, respond) {
	console.log("inject.js: Message Received! ["+req+"]");
   if (req === 'ScriptRunning') {
       respond('true');
   } else if (req === 'StopScript') {
   	   clearTimeout(newPageTimeout);
   	   console.log("inject.js: StopScript received.");
   	   respond('true');
   }
});

// Used to scale the random time generated for switching pages
var clickFactor = 1;

var googleSearch = false;
if (/^https?:\/\/www\.google\.com\/search/.test(window.location)) {
	//console.log(">>Google Search Page Detected<<");
	googleSearch = true;
	clickFactor = 0.4;
}

var linksOnPage = document.getElementsByTagName('a');

// Filter the list of links
var links = [];
for(var i=0; i<linksOnPage.length; ++i) {
	// Remove any link that does not begin with http or https or is a Bookmark
	if (/^http/.test(linksOnPage[i]) && !/#\S*$/.test(linksOnPage[i])) {
		if (googleSearch && /^https?:\/\/[^\/]*google[^\/]*\//.test(linksOnPage[i])) {
			//console.log("Google Search and Google URL Detected, skipping: ["+linksOnPage[i]+"]");
		} else {
			links.push(linksOnPage[i]);
			//console.log("Link: ["+linksOnPage[i]+"]");
		}
	} else {
		//console.log("Bad Link: ["+linksOnPage[i]+"]");
	}
}


if (links.length > 0) {
	var selectedLink = randInt(0, links.length-1);

	var maxTime = Math.round(scriptOptions.maxTimeBetweenClicks*clickFactor);
	var delay = randInt(Math.floor(maxTime*scriptOptions.timeBetweenClicksVariance*clickFactor), maxTime)*1000;
	console.log("Using Delay: ["+scriptOptions.maxTimeBetweenClicks+"]");
	console.log("New URL: ["+links[selectedLink]+"] in "+delay+"ms");
	var newPageTimeout = setTimeout(
		function() {
	        window.location = links[selectedLink];
	    }
	, delay); 
} else {
	console.log("!!No links found.");	
}

// Attempt to disable "Are you sure you want to leave" popups
window.onbeforeunload = null;
window.onunload = null;

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}