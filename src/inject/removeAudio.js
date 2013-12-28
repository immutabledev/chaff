var sources = ["applet", "audio", "embed", "object", "video"];

console.log("___Removing Audio Sources___");
for(var i=0; i<sources.length; ++i) {
	removeElements(document.getElementsByTagName(sources[i]));
}
console.log("___End Removing Audio Sources___");

function removeElements(elements) {
	for(var i=0; i<elements.length; i++) {
		console.log("!!Removing element ["+elements[i]+"].");
		if (elements[i] !== null && elements[i] !== undefined && elements[i].parentNode !== null) {
			try {
				elements[i].parentNode.removeChild(elements[i]);
			} catch(e) {
				console.log("!!!Error removing element.");
			}
		}
	}	
}
