var app = {
    itpYearBook: "https://itp.nyu.edu/ranch/api/itp-yearbook/",
    itpProjectsbyYear: "https://itp.nyu.edu/ranch/api/projects-finder-by-class/",
    itpProjectsperStudent: "https://itp.nyu.edu/ranch/api/projects-finder-by-creator/",
    itpProjects: "https://itp.nyu.edu/ranch/api/projects/",
    giphySearch: "https://api.giphy.com/v1/gifs/search?api_key=f83e46e2508b41bd954c4b821e8261ea&limit=1&offset=0&rating=G&lang=en&q=",

    studentsPerYear: [],
    projectsPerYear: [],
    projectsPerStudent: [],
    projectDetails: [],
    giphy: null,

    initialize: function () {
        $("#search").click(function () {
            $("#resultsTarget").html("");
            var newSearchTerm = $("#query").val();
            currentYear = new Date().getFullYear() + 2;
            if (newSearchTerm == "" || newSearchTerm < 1981 || newSearchTerm > currentYear) {
                newSearchTerm = currentYear;
            }
            app.itpYearBookSearch(newSearchTerm);
            app.itpProjectsbyYearSearch(newSearchTerm);
        });

        $("#query").keypress(function (e) {
            if (e.which == 13) {
                $("#search").trigger('click')
            }
        });

        $("#resultsTarget").on("click", ".itpResults", function () {
            var id = $(this).prop("id");
            var newSearchTerm = $($(id).text());
            console.log(newSearchTerm);
            app.runGiphySearch(newSearchTerm);
            //            app.itpProjectsperStudentSearch(studentsPerYear[id].netid);
            //            if (projectsPerStudent.length > 0 && projectsPerStudent != null) {
            //                for (var i = 0; i < projectsPerStudent.length; i++) {
            //                    app.itpProjectDetails(projectsPerStudent[i].id);
            //                    htmlString = "<div class='projectDetails' " + "id ='Project" + i + "'>" + projectDetails[0].name +
            //                        "</div>";
            //                    $(this).append(htmlString);
            //                    console.log("ProjectDetails" + projectDetails);
            //                        }
            //}
        });
    },

    itpYearBookSearch: function (searchTerm) {
        $.ajax({
            url: this.itpYearBook + searchTerm,
            type: 'GET',
            dataType: 'json',
            error: function (data) {
                $("#searchTerm").html(data);
            },
            success: function (data) {
                studentsPerYear = data;
                $("#searchTerm").html("Class of " + searchTerm + " : " + studentsPerYear.length + " students.");

                var htmlString = '';
                for (var i = 0; i < studentsPerYear.length; i++) {
                    htmlString = "<div class='itpResults' " + "id ='" + i + "result'>" +
                        studentsPerYear[i].name +
                        "</div>";
                    $("#resultsTarget").append(htmlString);
                    //app.itpProjectsperStudentSearch(studentsPerYear[i].netid);
                }
            }
        });
    },

    itpProjectsbyYearSearch: function (searchItem) {
        $.ajax({
            url: this.itpProjectsbyYear + searchTerm,
            type: 'GET',
            dataType: 'json',
            error: function (data) {
                $("#searchTerm").html(data);
            },
            success: function (data) {
                projectsPerYear = data;
            }
        });
    },

    itpProjectsperStudentSearch: function (searchItem) {
        $.ajax({
            url: this.itpProjectsperStudent + searchItem,
            type: 'GET',
            dataType: 'json',
            error: function (data) {
                $("#searchTerm").html(data);
            },
            success: function (data) {
                projectsPerStudent = data;
            }
        });
    },

    itpProjectDetails: function (searchItem) {
        $.ajax({
            url: this.itpProjects + searchItem,
            type: 'GET',
            dataType: 'json',
            error: function (data) {
                $("#searchTerm").html(data);
            },
            success: function (data) {
                projectDetails = data;
            }
        });
    },

    runGiphySearch: function (searchItem) {
        $.ajax({
            url: this.giphySearch + searchItem,
            type: 'GET',
            dataType: 'json',
            error: function (data) {
                $("#searchTerm").html(data);
            },
            success: function (data) {
                console.log(data);
            }
        });
    }
}
