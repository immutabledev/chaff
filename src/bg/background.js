var settings = new Store("settings", {
	"processingEnabled": DEFAULTS["processingEnabled"],
	"autoMode": DEFAULTS["autoMode"],
	"idleTime": DEFAULTS["idleTime"],
	"website1": DEFAULTS["website1"],
	"website2": DEFAULTS["website2"],
	"website3": DEFAULTS["website3"],
	"website4": DEFAULTS["website4"],
	"website5": DEFAULTS["website5"],
	"website6": DEFAULTS["website6"]
});

// Define Globals
var processingEnabled;
var processing;
var manualProcessing;

var autoMode;

var seedURLs;

var tabId;
var currentTab;

var retryCount;

// Used to track if a browsing timeout occurred for the Tab Updated event
var browsingTimeout;
var historyTimeout;
var historyAnalyzedLastPass;

// Last URL used during a Browsing Timeout. Used to get out of a Browse Timeout loop.
var browseTimeoutNewURL;

var history;

var BROWSING_PARAMETERS = [];

// Setup event handlers
chrome.browserAction.onClicked.addListener(
	function(tab) {
		toggleProcessing();
	}	
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	switch(request.action) {
  		case "status":
  			console.log("Request: ["+request.data+"]");
  			sendResponse({status: request.data});
  	
  			if (request.data == true) {
  				if (processingEnabled != true) {
  					enableProcessing();
  				}
  			} else if (request.data == false) {
  				disableProcessing();
  			}
  			break;
  			
  		default:
  			break;
  	}
});

chrome.idle.onStateChanged.addListener(
	function(newstate) {
		if (autoMode && !manualProcessing) {
			switch(newstate) {
				case "active":
					stopProcessing();
					break;
					
				case "idle":
				case "locked":
					startProcessing();
					break;
			}
		}
});

chrome.tabs.onRemoved.addListener(
	function(removedTabId, removeInfo) {
		if (removedTabId == tabId) {
			tabId = undefined;
			
			stopProcessing();	
		}
	}	
);

chrome.tabs.onUpdated.addListener(
	function(updatedTabId, changeInfo, tab) {
		console.log("Tab Updated: ["+updatedTabId+"] ["+changeInfo.status+"]")
		if (updatedTabId != tabId || changeInfo.status != 'complete') return;
		
		tabUpdated(tab);
	}	
);

window.addEventListener('storage', onStorageEvent, false);

init();

function init() {
	processingEnabled = settings.get("processingEnabled");
	processing = false;
	manualProcessing = false;
	
	autoMode = settings.get("autoMode");
	
	tabId = undefined;
	currentTab = undefined;
	
	historyAnalayzedLastPass = false;
	
	setIdleTime();
	
	gatherSeedURLs();
	
	if (processingEnabled) {
		enableProcessing();
	}	
}

function onStorageEvent(e) {
	console.log(e);
	
	switch(e.key) {
		case "store.settings.autoMode":
			autoMode = (e.newValue == "true");
			break;
			
		case "store.settings.idleTime":
			setIdleTime();
			break;
	}
}
  
function toggleProcessing() {
	if (processing) {
		manualProcessing = false;
		stopProcessing();		
	} else {
		manualProcessing = true;
		startProcessing();
	}	
}
  
function enableProcessing() {
	setProcessingEnabled();
	
}

function disableProcessing() {
	setProcessingDisabled();
	
}

function startProcessing() {
	if (!processing) {
		processing = true;
		chrome.browserAction.setBadgeText({text: "On"});
		
		console.log("Creating Tab...");
		// Create a new tab and store the Id for later use
		chrome.tabs.create({"active": true}, function (tab) {
			console.log("Tab Created: ["+tab.id+"]");
			tabId = tab.id;
			
			beginBrowsing();
		});
	}
}

function stopProcessing() {
	if (processing) {
		processing = false;
		currentTab = undefined;
		chrome.browserAction.setBadgeText({text: ""});
		
		// Clear Timeouts
		if (browsingTimeout) clearTimeout(browsingTimeout);
		if (historyTimeout) clearTimeout(historyTimeout);
		
		// Remove the tab
		if (tabId != undefined) {
			try {
				chrome.tabs.remove(tabId, function (){
					tabId = undefined;	
				});
			} catch(e) {
				console.log("Unable to remove Tab ID: ["+tabId+"]");
			}
		}
	}
}

function beginBrowsing() {
	retryCount = 0;
	
	// Get the seed URL
	var seedURL = getSeedURL();
	
	browse(seedURL);
}

function browse(url) {
	startBrowseTimeout();
	chrome.tabs.update(tabId, {url: url});	
}

function startBrowseTimeout() {
	clearTimeout(browsingTimeout);	
	browsingTimeout = setTimeout(browseError, 60000);	
}

function browseError() {
	var browseTimeoutNewURLtmp = history[currentSeed].pop(); // This one is the back URL
	browseTimeoutNewURLtmp = history[currentSeed].pop();
	
	if (browseTimeoutNewURLtmp == browseTimeoutNewURL) {
		console.log("!!Browse Timeout: Timed out from same URL last time. Backing up one more. ["+browseTimeoutNewURLtmp+"] == ["+browseTimeoutNewURL+"]")
		browseTimeoutNewURLtmp = history[currentSeed].pop();	
	}
	
	browseTimeoutNewURL = browseTimeoutNewURLtmp;
	
	if (browseTimeoutNewURL != undefined) {
		console.log("!!Browse Timeout: Backing up to: ["+browseTimeoutNewURL+"].");
		browse(browseTimeoutNewURL);
	} else {
		beginBrowsing();
	}
}

function tabUpdated(tab) {
	startBrowseTimeout();
	
	currentTab = tab;
	
	// If the browsing history has exceeded the pre-determined depth, begin again with a new seed
	if (history[currentSeed].length > BROWSING_PARAMETERS['depth']) {
		console.log("!!!Browsing Depth of ["+BROWSING_PARAMETERS['depth']+"] exceeded. Reseeding.");
		beginBrowsing();
	}
	
	// If detected language of page isn't desired, back up
  	chrome.tabs.detectLanguage(tabId, 
  		function(language) {
    		console.log("Tab Language: ["+language+"]");
  		});
	
	// Analyze the browsing history to determine if a change in behavior is necessary
	var alternateURL = "";
	
	if (!historyAnalyzedLastPass) {
		alternateURL = analyzeHistory(tab.url);
	} else {
		historyAnalyzedLastPass = false;
	}
	
	if (alternateURL != "") {
		historyTimeout = setTimeout(
			function() {
				historyAnalyzedLastPass = true;
		    	browse(alternateURL);
		    }
		, 20000); // 20 Seconds		 
	} else {
		// Inject some JavaScript to determine the next page to visit
		inject();	
	}
}

function getSeedURL() {
	// Determine number of URLs
	var numURLs = seedURLs.length;
	
	// Select a random URL
	currentSeed = randInt(0, numURLs-1);
	
	// Clear History
	history[currentSeed] = [];
	console.log("Out of ["+numURLs+"] URLs, selected URL number ["+currentSeed+"] = ["+seedURLs[currentSeed]+"].");
	
	
	// Initialize Browsing Parameters; TODO: Finish initializing parameters
	// Number of pages to browse on a particular site
	BROWSING_PARAMETERS['siteDepth'] = randInt(5, 10);
	
	// Number of pages to visit based upon a seed site
	BROWSING_PARAMETERS['depth'] =  randInt(BROWSING_PARAMETERS['siteDepth']*1.5, 20);
	
	return seedURLs[currentSeed];
}

function setProcessingEnabled() {
	processingEnabled = true;	
	settings.set("processingEnabled", true);
}

function setProcessingDisabled() {
	processingEnabled = false;	
	settings.set("processingEnabled", false);
}

function analyzeHistory(currentURL) {
	var status = "";
	
	// See if the browsing history indicates the script is stuck on the same website for too long
	if (history[currentSeed].length > BROWSING_PARAMETERS['siteDepth']) {
		var tld = getDomain(currentURL);
		var count = 0;
		console.log("Analyzing History [Staleness]: Domain ["+tld+"], Depth ["+BROWSING_PARAMETERS['siteDepth']+"].");
		for(var i = history[currentSeed].length-1; i>=0; i--) {
			var domain = getDomain(history[currentSeed][i]);
			//console.log(">>Found Domain: ["+domain+"]");	
			if (domain == tld) {
				count++;
				//console.log(">>>Matches previous domain. ["+count+"]");
			} else {
				break;
			}
			
			if (count > BROWSING_PARAMETERS['siteDepth']) {
				console.log(">>>>More than ["+BROWSING_PARAMETERS['siteDepth']+"] matches for domain ["+tld+"].");
				for(var j = i; j>=0; j--) {
					status = history[currentSeed][j];

					if (getDomain(history[currentSeed][j]) != tld) break;	
				}
				
				break;
			}
		}
	}
	
	// Other patterns to look for:
	// - Navigated to the same page two or three times in a row (discounting bookmark)
	// - Visited the same page in the history at least 4-5 times; trigger a re-seed
	
	console.log("analyzeHistory() = ["+status+"].");
	return status;
}

// Returns just the domain from a URL string
function getDomain(url) {
	var domain = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	return domain[0];	
}

function inject() {
	console.log("Injecting into tab ["+tabId+"].");
	try {
		chrome.tabs.executeScript(tabId, { file: "src/inject/inject.js" }, 
			function() {
		    	saveHistory();
	   		}
	   	);
	} catch(e) {
		injectError();
	}
}

// There was an issue loading the page; Back up and try again.
function injectError() {
	console.log("Timeout occurred while injecting.");
	var currentHistory = history[currentSeed];
	
	if (currentHistory.length > 0) {
		retryCount++;
		console.log(">>Trying previous URL again ["+history[currentSeed][currentHistory.length-1]+"]. Retry ["+retryCount+"].");
		browse(history[currentSeed][currentHistory.length-1]);
	} else { // Issue with seed site, so we need to start again with a new seed
		console.log(">>Starting again with a new seed.");
		beginBrowsing();
	}		
}

// Remeber the links we've been to
function saveHistory() {
	if (currentTab != undefined) {
		history[currentSeed].push(currentTab.url);
		console.log("URL ["+currentTab.url+"] saved in History for seed ["+currentSeed+"], depth ["+history[currentSeed].length+"].");
		retryCount = 0;
	}	
}

function gatherSeedURLs() {
	seedURLs = [];
	
	for(i=1; i<=10; i++) {
		var tmp = settings.get("website"+i);
		if (/^http/.test(tmp)) {
			console.log("Adding seed URL: ["+tmp+"].");
			seedURLs.push(tmp);
		}
	}
}

function setIdleTime() {
	// Get idle time in minutes
	var idleTime = settings.get('idleTime');
	idleTime *= 60;
	chrome.idle.setDetectionInterval(idleTime);	
}

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}