var app = {
	itpYearBook: "https://itp.nyu.edu/ranch/api/itp-yearbook/",
	itpProjectsbyYear: "https://itp.nyu.edu/ranch/api/projects-finder-by-class/",
	itpProjectsperStudent: "https://itp.nyu.edu/ranch/api/projects-finder-by-creator/",

	studentsPerYear: null,
	projectsPerYear: null,
	projectsPerStudent: null,

	initialize: function() {
		$("#search").click(function(){
			$("#resultsTarget").html("");
			var newSearchTerm = $("#query").val();
			currentYear = new Date().getFullYear() + 2;
			if (newSearchTerm == "" || newSearchTerm < 1981 || newSearchTerm > currentYear)
			{
				newSearchTerm = currentYear;
			}
			app.itpYearBookSearch(newSearchTerm);
			app.itpProjectsbyYearSearch(newSearchTerm);
		});

		$("#query").keypress(function(e){
			if (e.which == 13){
				$("#search").trigger('click')
			}
		});
	},

	itpYearBookSearch: function(searchTerm) {
		$.ajax({
			url: this.itpYearBook + searchTerm,
			type: 'GET',
			dataType: 'json',
			error: function(data){
				$("#searchTerm").html(data);
			},
			success: function(data){
					studentsPerYear = data;
					$("#searchTerm").html("Class of " + searchTerm + " : " + studentsPerYear.length + " students.");

					var htmlString = '';
					for (var i = 0; i < studentsPerYear.length; i++){
					htmlString =	"<p class='itpResults'>" +
											studentsPerYear[i].name +
										"</p>";
					$("#resultsTarget").append(htmlString);
					 //app.itpProjectsperStudentSearch(studentsPerYear[i].netid);
				}
			}
		});
	},

	itpProjectsbyYearSearch: function(searchItem){
		$.ajax({
			url: this.itpProjectsbyYear + searchTerm,
			type: 'GET',
			dataType: 'json',
			error: function(data){
				$("#searchTerm").html(data);
			},
			success: function(data){
				projectsPerYear = data;
			}
		});
	},

	itpProjectsperStudentSearch: function(searchItem){
		$.ajax({
			url: this.itpProjectsperStudent + searchItem,
			type: 'GET',
			dataType: 'json',
			error: function(data){
				$("#searchTerm").html(data);
			},
			success: function(data){
				projectsPerStudent = data;
			}
		});
	}
}
