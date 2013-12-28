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

var linksOnPage = document.getElementsByTagName('a');

// Filter the list of links
var links = [];
for(var i=0; i<linksOnPage.length; ++i) {
	// Remove any link that does not begin with http or https or is a Bookmark
	if (/^http/.test(linksOnPage[i]) && !/#\w*$/.test(linksOnPage[i])) {
		links.push(linksOnPage[i]);
	} else {
		console.log("Bad Link: ["+linksOnPage[i]+"]");
	}
}


if (links.length > 0) {
	var selectedLink = randInt(0, links.length-1);

	var delay = randInt(6,25)*1000;
	console.log("New URL: ["+links[selectedLink]+"] in "+delay+"ms");
	var newPageTimeout = setTimeout(
		function() {
	        window.location = links[selectedLink];
	    }
	, delay); 
} else {
	console.log("!!No links found.");	
}

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}