var settings = new Store("settings", {
	"processingEnabled": DEFAULTS["processingEnabled"],
	"autoMode": DEFAULTS["autoMode"],
	"idleTime": DEFAULTS["idleTime"]
});

// Define Globals
var processingEnabled;
var processing;

var autoMode;

var tabId;

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
		if (autoMode) {
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

window.addEventListener('storage', onStorageEvent, false);

init();

function init() {
	processingEnabled = settings.get("processingEnabled");
	processing = false;
	
	autoMode = settings.get("autoMode");
	
	tabId = undefined;
	
	setIdleTime();
	
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
		stopProcessing();		
	} else {
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
		});
	}
}

function stopProcessing() {
	if (processing) {
		processing = false;
		chrome.browserAction.setBadgeText({text: ""});
		
		// Remove the tab
		chrome.tabs.remove(tabId, function (){
			tabId = undefined;	
		});
	}
}

function setProcessingEnabled() {
	processingEnabled = true;	
	settings.set("processingEnabled", true);
}

function setProcessingDisabled() {
	processingEnabled = false;	
	settings.set("processingEnabled", false);
}

function setIdleTime() {
	// Get idle time in minutes
	var idleTime = settings.get('idleTime');
	idleTime *= 60;
	chrome.idle.setDetectionInterval(idleTime);	
}
