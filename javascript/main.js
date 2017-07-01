// --------------- DATA MANAGEMENT FUNCTIONS

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function createName(obj) {
	var midName = (obj.middle_name == null) ? "" : obj.middle_name;
	var firstName = obj.first_name.replace(/&#x27;/g, "'");
	return firstName + " " + midName + " " + obj.last_name;
}

function modifyMemberList(list) {
	$.each(list, function(i, member) {
		member.name = createName(member);
		member.votes = (member.votes_with_party_pct != undefined) ? member.votes_with_party_pct + " %" : "-";
		member.url = (member.url != undefined) ? member.url : member.website;
		member.seniority = (member.seniority != undefined) ? member.seniority : "-";
	});
	return list;
}

function mergedList(list, list2) {
	var mergedList = [];
	
	$.each(list, function(i, member) {
		var newMember = {
			name: member.name,
			party: member.party,
			state: member.state,
			votes: member.votes,
			seniority: member.seniority,
			birthday: "-",
			url: member.url,
			src: "nyt"
		};
		mergedList.push(newMember);
	});
	
	$.each(list2, function(i, member) {
		var memberName = createName(member);
		var idx = arrayObjectIndexOf(mergedList, memberName, "name");
		
		if (idx != -1) {
			mergedList[idx].birthday = member.birthday;
			mergedList[idx].src = "both";
		} else {
			var newMember = {
				name: memberName,
				party: member.party,
				state: member.state,
				votes: member.votes,
				seniority: member.seniority,
				birthday: member.birthday,
				url: member.website,
				src: "sl"
			};
			mergedList.push(newMember);
		}
	});
	return mergedList;
}

function createStateArray() {
	var members = data1;
	var stateArray = [];
	
	for (var i=0; i<members.length; i++) {
		var state = members[i].state;
		if (stateArray.indexOf(state) == -1) {
			stateArray.push(state);
		}
	};
	stateArray.sort();
	return stateArray;
}


// --------------- CHECKBOX FUNCTIONS

function getPartyValues() {
	var partyArray = [];
	if (document.getElementById("d").checked) {
		partyArray.push('D');
	}
	if (document.getElementById("r").checked) {
		partyArray.push('R');
	}
	if (document.getElementById("i").checked) {
		partyArray.push('I');
	}
	return partyArray;
}

function getSources() {
	var sources = [];
	if ($('#nyt').prop('checked')) {
		sources.push('nyt');
	}
	if ($('#sl').prop('checked')) {
		sources.push('sl');
	}
	return sources;
}


// --------------- DISPLAY FUNCTIONS

function displayTableColumns() {
	var checked = getSources();
	
	if (checked.length == 0 || checked.length == 2) {
		$('td:nth-child(4),th:nth-child(4)').show();
		$('td:nth-child(5),th:nth-child(5)').show();
		$('td:nth-child(6),th:nth-child(6)').show();
	} else if (checked.indexOf('nyt') != -1) {
		$('td:nth-child(4),th:nth-child(4)').show();
		$('td:nth-child(5),th:nth-child(5)').show();
		$('td:nth-child(6),th:nth-child(6)').hide();
	} else if (checked.indexOf('sl') != -1) {
		$('td:nth-child(6),th:nth-child(6)').show();
		$('td:nth-child(4),th:nth-child(4)').hide();
		$('td:nth-child(5),th:nth-child(5)').hide();
	}
}

function isVisible(member) {
	var party = member.party;
	var state = member.state;
	var source = member.src;
	var selector = document.getElementById("state-selector");
	var selectedState = selector.value;
	
	// These variables are the conditions to check if a row should be made
	var checkParty = (getPartyValues().length == 0 || getPartyValues().indexOf(party) !== -1);
	var checkState = (state == selectedState || selectedState == "all");
	var checkSource = (getSources().length == 0 || getSources().indexOf(source) !== -1);
	return checkParty && checkState && checkSource;
}

function noResults(elementId) {
	var element = document.getElementById(elementId);
	var row = document.createElement("tr");
	var cell = document.createElement("td");
	var rowLength = $("#table-head").find("tr td").length;
	cell.innerHTML = "No results found. Are you freaking out?";
	cell.setAttribute("colspan", rowLength);
	cell.style.textAlign = "center";
	row.append(cell);
	element.append(row);
}

function addRows() {
	var template = $('#data-template').html();
	var array = data3;
	// Iterating through the array
	$.each(array, function(i, member) {
		if (isVisible(member)) {
			$('#table-body').append(Mustache.render(template, member));
		}
	});
}

// ---------- MAIN FUNCTIONS

function addStateFilter() {
	var filter = document.getElementById("state-selector");
	var arr = createStateArray();
	for (var i=0; i<arr.length; i++) {
		var opt = document.createElement("option");
		opt.value = arr[i];
		opt.text = arr[i];
		filter.appendChild(opt);
	}
}

function addTable() {
	// Making our table empty
	
	$("#table-body").empty();
	
	// Making the table
	addRows();

	// If there is no row to show, we return "No results found"
	if ($('#table-body tr').length == 0) {
		noResults("table-body");
	}
}