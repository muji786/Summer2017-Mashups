var app = {
	
	itpURL: "https://itp.nyu.edu/ranch/api/itp-yearbook/",

	initialize: function() {
		$("#search").click(function(){
			console.log("Clicked search");
			$("#resultsTarget").html("");
			var newSearchTerm = $("#query").val();
			console.log(newSearchTerm);
			app.itpSearch(newSearchTerm);
		});

		$("#query").keypress(function(e){
			if (e.which == 13){
				$("#search").trigger('click');
			}
		});
	},

	itpSearch: function(searchTerm) {
		currentYear = new Date().getFullYear() + 2;
		if (searchTerm == "" || searchTerm < 1981 || searchTerm > currentYear)
		{
			searchTerm = currentYear;
		}
		$.ajax({
			url: this.itpURL + searchTerm,
			type: 'GET',
			dataType: 'json',
			error: function(data){
				console.log("We got problems");
				//console.log(data.status);
			},
			success: function(data){
				console.log("WooHoo!");
				console.log(data);
				$("#searchTerm").html("Class of " + searchTerm);

					var htmlString = '';
					var len = data.length;
					var urlResults = data[3];
				//Loop through the array of results
					for (var i = 0; i < len; i++){
					htmlString =	"<p class='itpResults'>" +
											data[i].name +
										"</p>";
					$("#resultsTarget").append(htmlString);
				}
			}
		});
	}
}

//Code to be executed once the page has fully loaded
$(document).ready(function(){
		console.log("LOADED!!!!");
	app.initialize();
});
