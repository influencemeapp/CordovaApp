var config = { apiKey: "AIzaSyC1yE3Jft9NBOph7YFLnom8qZHJ-UMazuA", authDomain: "influenceme-bca7d.firebaseapp.com", databaseURL: "https://influenceme-bca7d.firebaseio.com", projectId: "influenceme-bca7d", storageBucket: "influenceme-bca7d.appspot.com", messagingSenderId: "460396177087" }; firebase.initializeApp(config);
function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode != 46 && charCode > 31
		&& (charCode < 48 || charCode > 57))
		return false;

	return true;
}

function isInteger(numero) {
	if (numero % 1 == 0) {
		return true;
	} else {
		return false;
	}
}
