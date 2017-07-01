// ---------- DOCUMENT READY ---------- //

$(document).ready(function() {
	// Loader charging...
	$('body').addClass("disabled");
	var loader = $('<div></div>').addClass('loader');
	$('body').append(loader);
	
	// Getting current page...
	var page = getCurrentPage();
	
	switch (page) {
		case "home-page.html":
			jsonReady();
			break;
			
		case "senate-page.html":
			if (localStorage.getItem("senateNytJson") !== null && localStorage.getItem("senateSlJson") !== null) {
				functionManager("senate");
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function(nytJson) {
					$.getJSON("javascript/sunlight-api-senate.json", function(slJson) {
						localStorage.setItem("senateNytJson", JSON.stringify(nytJson));
						localStorage.setItem("senateSlJson", JSON.stringify(slJson));
						functionManager("senate");
					});
				});
			}
			break;
			
		case "house-page.html":
			if (localStorage.getItem("houseNytJson") !== null && localStorage.getItem("houseSlJson") !== null) {
				functionManager("house");
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function(nytJson) {
					$.getJSON("javascript/sunlight-api-house.json", function(slJson) {
						localStorage.setItem("houseNytJson", JSON.stringify(nytJson));
						localStorage.setItem("houseSlJson", JSON.stringify(slJson));
						functionManager("house");
					});
				});
			}
			break;
			
		case "senate-attendance-page.html":
			if (localStorage.getItem("senateNytJson") !== null) {
				functionManager2("senate");
				addTable("#least", "engaged", statistics.stats[3].least_engaged);
				addTable("#most", "engaged", statistics.stats[3].most_engaged);
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function(json) {
					localStorage.setItem("senateNytJson", JSON.stringify(json));
					functionManager2("senate");
					addTable("#least", "engaged", statistics.stats[3].least_engaged);
					addTable("#most", "engaged", statistics.stats[3].most_engaged);
				});
			}
			break;
			
		case "senate-party-loyalty-page.html":
			if (localStorage.getItem("senateNytJson") !== null) {
				functionManager2("senate");
				addTable("#least", "loyal", statistics.stats[3].least_loyal);
				addTable("#most", "loyal", statistics.stats[3].most_loyal);
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function(json) {
					localStorage.setItem("senateNytJson", JSON.stringify(json));
					functionManager2("senate");
					addTable("#least", "loyal", statistics.stats[3].least_loyal);
					addTable("#most", "loyal", statistics.stats[3].most_loyal);
				});
			}
			break;
			
		case "house-attendance-page.html":
			if (localStorage.getItem("houseNytJson") !== null) {
				functionManager2("house");
				addTable("#least", "engaged", statistics.stats[3].least_engaged);
				addTable("#most", "engaged", statistics.stats[3].most_engaged);
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function(json) {
					localStorage.setItem("houseNytJson", JSON.stringify(json));
					functionManager2("house");
					addTable("#least", "engaged", statistics.stats[3].least_engaged);
					addTable("#most", "engaged", statistics.stats[3].most_engaged);
				});
			}
			break;
			
		case "house-party-loyalty-page.html":
			if (localStorage.getItem("houseNytJson") !== null) {
				functionManager2("house");
				addTable("#least", "loyal", statistics.stats[3].least_loyal);
				addTable("#most", "loyal", statistics.stats[3].most_loyal);
			} else {
				$.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function(json) {
					localStorage.setItem("houseNytJson", JSON.stringify(json));
					functionManager2("house");
					addTable("#least", "loyal", statistics.stats[3].least_loyal);
					addTable("#most", "loyal", statistics.stats[3].most_loyal);
				});
			}
			break;
	}
});