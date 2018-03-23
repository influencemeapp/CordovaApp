function jump(a,t){
	if(a.value.length == a.getAttribute('maxlength')){
	document.getElementById(t).focus();
	}
}
function justNumbers(e) {
	var keynum = window.event ? window.event.keyCode : e.which;
	if ((keynum == 8) || (keynum == 46))
		return true;

	return /\d/.test(String.fromCharCode(keynum));
}
