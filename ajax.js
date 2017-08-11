//from Julie C Maloni's CSS, HTML, and JS book

var ajaxreq = false;
var ajaxCallback;

function ajaxRequest(filename) {
	try{
		ajaxreq = new XMLHttpRequest();
	} catch (error) {
		console.log("error: " + error);
		return false;
	}
	ajaxreq.open("GET", filename);
	ajaxreq.onreadystatechange = ajaxResponse;
	ajaxreq.send(null);
}

function ajaxResponse() {
	if(ajaxreq.readyState != 4 )return;
	if(ajaxreq.status == 200) {
		//success
		if(ajaxCallback) ajaxCallback();
	} else {
		console.log("Fail: " + ajaxreq.statusText);
	}
	return true;
}
