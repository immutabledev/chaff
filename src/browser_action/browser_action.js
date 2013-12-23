function enableCheckbox(status) {
	console.log("enableCheckbox("+status+")");
	
	if (status == true || status == false) {
		chrome.runtime.sendMessage({action: "status", data: status}, function(response) {
	  		console.log("enableCheckbox(): ["+response.status+"]");
		});	
	}
}

function manualCheckbox(status) {
	console.log("manualCheckbox("+status+")");
	
	if (status == true || status == false) {
		chrome.runtime.sendMessage({action: "manual", data: status}, function(response) {
	  		console.log("manualCheckbox(): ["+response.status+"]");
		});	
	}
}

var settings = new Store("settings");

document.addEventListener('DOMContentLoaded', function () {
	var checkboxId = document.getElementById('enable-checkbox');
	checkboxId.checked = settings.get("processingEnabled");
    checkboxId.addEventListener('click', 
    	function() {
    		enableCheckbox(checkboxId.checked);
    	}, 
    	false);
});

document.addEventListener('DOMContentLoaded', function () {
	var manCheckboxId = document.getElementById('manual-checkbox');
	manCheckboxId.checked = settings.get("manualProcessingEnabled");
    manCheckboxId.addEventListener('click', 
    	function() {
    		manualCheckbox(manCheckboxId.checked);
    	}, 
    	false);
});