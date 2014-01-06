// Define Globals
var settings;

var processingEnabled;
var processing;
var manualProcessing;

var autoMode;

var seedURLs;

var tabId;
var currentTab;

// Used to track if a browsing timeout occurred for the Tab Updated event
var browsingTimeout;
var historyTimeout;
var historyAnalyzedLastPass;

// Last URL used during a Browsing Timeout. Used to get out of a Browse Timeout loop.
var browseTimeoutNewURL;

var history;

var BROWSING_PARAMETERS = [];

var SeedService;

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
		if (updatedTabId != tabId || changeInfo.status != 'complete') return;
		console.log("Tab Updated: ["+updatedTabId+"] ["+changeInfo.status+"]");
		tabUpdated(tab);
	}	
);

window.addEventListener('storage', onStorageEvent, false);

init();

function init() {
	settings = new Store("settings", DEFAULTS);
	
	processingEnabled = settings.get("processingEnabled");
	processing = false;
	manualProcessing = false;
	
	autoMode = settings.get("autoMode");
	
	tabId = undefined;
	currentTab = undefined;
	
	historyAnalayzedLastPass = false;
	
	setIdleTime();
	
	gatherSeedURLs();
	
	SeedService = new Seed();
	SeedService.gatherSeeds(
		function() {
				if (processingEnabled) {
					enableProcessing();
				}			
		}
	);       
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
			
		case "store.settings.website1":
		case "store.settings.website2":
		case "store.settings.website3":
		case "store.settings.website4":
		case "store.settings.website5":
		case "store.settings.website6":
		case "store.settings.website7":
		case "store.settings.website8":
		case "store.settings.website9":
		case "store.settings.website10":
			gatherSeedURLs();
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
	processingEnabled = true;	
	settings.set("processingEnabled", true);
}

function disableProcessing() {
	processingEnabled = false;	
	settings.set("processingEnabled", false);
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
		
		chrome.tabs.sendMessage(tabId, "StopScript", function(response) {
  			console.log("Inject Script Stopped: ["+response+"]");
		});
		
		// Remove the tab if requested
		if (settings.get("removeTabWhenFinished") && tabId != undefined) {
			try {
				chrome.tabs.remove(tabId, function (){
					tabId = undefined;	
				});
			} catch(e) {
				console.log("Unable to remove Tab ID: ["+tabId+"]");
			}
		} else {
			tabId = undefined;
		}
	}
}

function beginBrowsing() {
	// Initialize Browsing Parameters; TODO: Finish initializing parameters
	// Number of pages to browse on a particular site
	BROWSING_PARAMETERS['siteDepth'] = randInt(5, 10);
	
	// Number of pages to visit based upon a seed site
	BROWSING_PARAMETERS['depth'] =  randInt(Math.ceil(BROWSING_PARAMETERS['siteDepth']*1.5), 20);
	
	// Clear History
	history = [];
	
	//var decision = randInt(1,2);
	var decision = 2;
	var seedURL = "";
	
	switch (decision) {
		case 1:
			// Get a user provided seed URL
			seedURL = getSeedURL();
			browse(seedURL);
			break;
		
		case 2:
			SeedService.getSearchSeed(
				function(phrase) {
					if (phrase == null) {
						console.log("No seed phrase returned! Restarting the Browse.");
						beginBrowsing();	
					} else {
						seedURL = "http://www.google.com/search?q="+encodeURIComponent(phrase);
						browse(seedURL);
					}
				}
			);
			break;
	}
	
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
	var browseTimeoutNewURLtmp = history.pop(); // This one is the bad URL
	browseTimeoutNewURLtmp = history.pop();
	
	if (browseTimeoutNewURLtmp == browseTimeoutNewURL) {
		console.log("!!Browse Timeout: Timed out from same URL last time. Backing up one more. ["+browseTimeoutNewURLtmp+"] == ["+browseTimeoutNewURL+"]")
		browseTimeoutNewURLtmp = history.pop();	
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
	if (history.length > BROWSING_PARAMETERS['depth']) {
		console.log("!!!Browsing Depth of ["+BROWSING_PARAMETERS['depth']+"] exceeded. Reseeding.");
		beginBrowsing();
	}
	
	// TODO: If detected language of page isn't desired, back up
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
	var currentSeed = randInt(0, numURLs-1);
	
	console.log("Out of ["+numURLs+"] URLs, selected URL ["+seedURLs[currentSeed]+"] = ["+seedURLs[currentSeed]+"].");
	
	return seedURLs[currentSeed];
}

function analyzeHistory(currentURL) {
	var status = "";
	
	// See if the browsing history indicates the script is stuck on the same website for too long
	if (history.length > BROWSING_PARAMETERS['siteDepth']) {
		var tld = getDomain(currentURL);
		var count = 0;
		console.log("Analyzing History [Staleness]: Domain ["+tld+"], Depth ["+BROWSING_PARAMETERS['siteDepth']+"].");
		for(var i = history.length-1; i>=0; i--) {
			var domain = getDomain(history[i]);
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
					status = history[j];

					if (getDomain(history[j]) != tld) break;	
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
		chrome.tabs.executeScript(tabId, { file: "src/inject/removeAudio.js", allFrames: true, runAt: "document_end" },
			function() {
				chrome.tabs.executeScript(tabId, { file: "src/inject/inject.js" }, 
					function() {
		    			saveHistory();
	   				}
	   			);
	   		}	
	   );
	} catch(e) {
		// Let the Browse Timeout occur to handle this case
		console.log("!!Error occurred when trying to inject into tab.");
	}
}

// Remeber the links we've been to
function saveHistory() {
	if (currentTab != undefined) {
		history.push(currentTab.url);
		console.log("URL ["+currentTab.url+"] saved in History, depth ["+history.length+"].");
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