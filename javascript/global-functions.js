function strrpos (haystack, needle) {
  var i = -1;
 	i = (haystack + '').lastIndexOf(needle);
  return i >= 0 ? i : false;
}

function getCurrentPage() {
	var current = window.location.pathname;
	return current.substring(strrpos(current,"/")+1);
}

function jsonReady() {
	$('.loader').remove();
	$('body').removeClass("disabled");
}

function addEventListeners() {
	$('#d').on("click", addTable);
	$('#r').on("click", addTable);
	$('#i').on("click", addTable);
	$('#nyt').on("click", function(){
		addTable();
		displayTableColumns();
	});
	$('#sl').on("click", function() {
		addTable();
		displayTableColumns();
	});
	$('#state-selector').on("change", addTable);
}

function functionManager(congress) {
	jsonReady();
	switch (congress) {
		case "senate":
			var dataNYT = JSON.parse(localStorage.getItem("senateNytJson"));
			var dataSL = JSON.parse(localStorage.getItem("senateSlJson"));
			break;
		case "house":
			var dataNYT = JSON.parse(localStorage.getItem("houseNytJson"));
			var dataSL = JSON.parse(localStorage.getItem("houseSlJson"));
			break;
	}
	data1 = modifyMemberList(dataNYT.results[0].members);
	data2 = modifyMemberList(dataSL.results);
	data3 = mergedList(data1, data2);
	addTable();
	addStateFilter();
	addEventListeners();
	sortTable();
}

function functionManager2 (congress) {
	jsonReady();
	switch (congress) {
		case "senate":
			data = JSON.parse(localStorage.getItem("senateNytJson"));
			break;
		case "house":
			data = JSON.parse(localStorage.getItem("houseNytJson"));
			break;
	}
	fillStatistics();
	addGlanceTable();
}

function sortTable() {
	 $('#main-table').dataTable( {
    "bPaginate": false,
	  "sScrollY": "550px",  
	  "bScrollCollapse": true
  } );
}
