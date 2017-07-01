// --------------- DATA MANAGEMENT FUNCTIONS

function filterMemberList(param) {
	var myList = members.filter(function(key) {
		return key.party == param;
	});
	return myList;
}

function sortList(sortType, param) {
	var list = members.sort(function(a,b) {
		if (sortType == "normal") {
			return a[param] - b[param];
		} else {
			return b[param] - a[param];
		}
	});
	return list;
}

function makeListTenPercent(param, list) {
	var k = list.length / 10;
	var last = "";
	var result = [];
	
	for (var i=0; i<list.length; i++) {
		if (i >= k) {
			if (list[i][param] == last) {
				result.push(list[i]);
				continue;
			} else {
				break;
			}
		}
		result.push(list[i]);
		var last = list[i][param];
	}
	return result;
}

// WE CREATE THE ORDERED LIST OF 10% MEMBERS
function createList(sortType, param){
	myList = sortList(sortType, param);
	return makeListTenPercent(param, myList);
}

// WE CALCULATE THE AVERAGE VOTES % WITH PARTY OF A LIST
function averageVotesWithParty(list) {
	var sum = 0;
	for (var i=0; i<list.length; i++) {
		var currentVotes = list[i].votes_with_party_pct;
		sum += parseFloat(currentVotes);
	}
	var result = sum / list.length;
	return result.toFixed(2);
}

function fillStatistics(congress) {
	members = data.results[0].members;
	var democrats = statistics.stats[0];
	var republicans = statistics.stats[1];
	var independents = statistics.stats[2];
	var all = statistics.stats[3];
	
	// Creating the lists
	var republicanList = filterMemberList("R");
	var democratList = filterMemberList("D");
	var independentList = filterMemberList("I");
	
	// Filling our statistics object
	democrats.number = democratList.length;
	republicans.number = republicanList.length;
	independents.number = independentList.length;
	all.number = members.length;
	democrats.average_votes = averageVotesWithParty(democratList);
	republicans.average_votes = averageVotesWithParty(republicanList);
	independents.average_votes =  averageVotesWithParty(independentList);
	all.average_votes = averageVotesWithParty(members);
	// most loyal -> sort reversed numerically; most engaged -> sort numerically
	all.least_loyal = createList("normal", "votes_with_party_pct");
	all.most_loyal = createList("reverse", "votes_with_party_pct");
	all.least_engaged = createList("reverse", "missed_votes_pct");
	all.most_engaged = createList("normal", "missed_votes_pct");
}

function createName(obj) {
	var midName = (obj.middle_name == null) ? "" : obj.middle_name;
	var fullName = obj.first_name + " " + midName + " " + obj.last_name;
	var a = document.createElement("a");
	$(a).attr("href", obj.url);
	$(a).attr("class", "iframe");
	$(a).html(fullName);
	return a;
}

// GETTING THE REAL NUMBER OF VOTES WITH PARTY
function getNumberPartyVotes(obj) {
	var totalVotes = obj.total_votes;
	var missedVotes = obj.missed_votes;
	var votesWPartyPct = obj.votes_with_party_pct;
	var realVotes = totalVotes - missedVotes;
	var numberPartyVotes = (realVotes * votesWPartyPct)/100;
	return Math.floor(numberPartyVotes);
}


// --------------- MAIN FUNCTIONS

function addGlanceTable() {
	var stats = statistics.stats;
	for (var i=0; i<stats.length; i++) {
		var row = document.createElement("tr");
		row.insertCell().innerHTML = stats[i].group;
		row.insertCell().innerHTML = stats[i].number;
		row.insertCell().innerHTML = stats[i].average_votes + " %";
		$('#glance').append(row);
	}
}

// CREATING THE TABLE ADAPTED FOR LOYALTY OR ATTENDANCE
function addTable(id, type, list) {
	for (var i=0; i<list.length; i++) {
		var row = document.createElement("tr");
		row.insertCell().append(createName(list[i]));
		if (type == "loyal") {
			row.insertCell().innerHTML = getNumberPartyVotes(list[i]);
			row.insertCell().innerHTML = list[i].votes_with_party_pct + " %";
		} else if (type == "engaged") {
			row.insertCell().innerHTML = list[i].missed_votes;
			row.insertCell().innerHTML = list[i].missed_votes_pct + " %";
		}
		$(id).append(row);
	}
}