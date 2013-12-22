function enableCheckbox(status) {
	console.log("enableCheckbox("+status+")");
	
	if (status == true || status == false) {
		chrome.runtime.sendMessage({action: "status", data: status}, function(response) {
	  		console.log("enableCheckbox(): ["+response.status+"]");
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
})