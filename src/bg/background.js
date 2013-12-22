var settings = new Store("settings", {
	"processingEnabled": DEFAULTS["processingEnabled"],
	"idleTime": DEFAULTS["idleTime"]
});

// Initialization
var processingEnabled = settings.get("processingEnabled");
var processing = false;

var tabId = undefined;

if (processingEnabled) {
	enableProcessing();
}

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
  
function enableProcessing() {
	setProcessingEnabled();
	
	// Turn on idle detection
	// Get idle time in minutes
	var idleTime = settings.get('idleTime');
	idleTime *= 60;
	chrome.idle.setDetectionInterval(idleTime);
	chrome.idle.onStateChanged.addListener(function(newstate) {
		if (processingEnabled) {
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
}

function disableProcessing() {
	setProcessingDisabled();
	
	// Disable timers
}

function startProcessing() {
	chrome.browserAction.setBadgeText({text: "On"});
	
	console.log("Creating Tab...");
	// Create a new tab and store the Id for later use
	chrome.tabs.create({"active": false}, function (tab) {
		console.log("Tab Created: ["+tab.id+"]");
		tabId = tab.id;
	});
}

function stopProcessing() {
	chrome.browserAction.setBadgeText({text: ""});
	
	// Remove the tab
	chrome.tabs.remove(tabId, function (){
		tabId = undefined;	
	});
}

function setProcessingEnabled() {
	processingEnabled = true;	
	settings.set("processingEnabled", true);
}

function setProcessingDisabled() {
	processingEnabled = false;	
	settings.set("processingEnabled", false);
}

