var app = {
    itpYearBook: "https://itp.nyu.edu/ranch/api/itp-yearbook/",
    itpProjectsbyYear: "https://itp.nyu.edu/ranch/api/projects-finder-by-class/",
    itpProjectsperStudent: "https://itp.nyu.edu/ranch/api/projects-finder-by-creator/",
    itpProjects: "https://itp.nyu.edu/ranch/api/projects/",
    giphySearch: "https://api.giphy.com/v1/gifs/search?api_key=f83e46e2508b41bd954c4b821e8261ea&limit=25&offset=0&rating=G&lang=en&q=",
    //giphySearch: "https://api.giphy.com/v1/gifs/random?api_key=f83e46e2508b41bd954c4b821e8261ea&rating=G&tag=",

    studentsPerYear: [],
    projectsPerYear: [],
    projectsPerStudent: [],
    projectDetails: [],
    giphyURL: "itp.png",

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
            var newSearchTerm = $('#' + this.id).html();
            console.log(newSearchTerm);

            giphyURL = "itp.png";
            $.ajax({
                url: app.giphySearch + newSearchTerm,
                type: 'GET',
                dataType: 'json',
                async: false,
                error: function (data) {
                    $("#searchTerm").html(data);
                },
                success: function (data) {
                    console.log(data.data.length);
                    if (data.data.length > 0) {
                        giphyURL = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;
                        console.log(giphyURL);
                    }
                }
            });
            var img = $("<img />").attr('src', giphyURL).on('load', function () {});
            $('#' + this.id).append(img);
        });
    },

    //        $("#resultsTarget").on("click", ".itpResults", function () {
    //            console.log("myid:" + this.id);
    //            var newSearchTerm = $('#' + this.id).html();
    //            app.runGiphySearch(newSearchTerm, this.id);
    //            $('#' + this.id).append(img);
    //            //console.log($('#' + this.id).append(img));
    //            // console.log($('#' + id + "giphy").html(giphyURL));
    //            //var htmlString = "<div class='giphyResults' id ='" + id + "giphy>" + giphyURL + "</div>";
    //            //            $('#' + this.id).append('<img src="' + giphyURL + '">');
    //            //            console.log('<img src="' + giphyURL + '">');
    //            //            $('#' + this.id).load(giphyURL);
    //            //            $('<img src="' + giphyURL + '">').load(function () {
    //            //                $(this).appendTo('#' + this.id);
    //            //            });
    //            //$('#' + this.id).append(giphyURL);
    //
    //            //            app.itpProjectsperStudentSearch(studentsPerYear[id].netid);
    //            //            if (projectsPerStudent.length > 0 && projectsPerStudent != null) {
    //            //                for (var i = 0; i < projectsPerStudent.length; i++) {
    //            //                    app.itpProjectDetails(projectsPerStudent[i].id);
    //            //                    htmlString = "<div class='projectDetails' " + "id ='Project" + i + "'>" + projectDetails[0].name +
    //            //                        "</div>";
    //            //                    $(this).append(htmlString);
    //            //                    console.log("ProjectDetails" + projectDetails);
    //            //                        }
    //            //}
    //        });
    //    },

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
                    htmlString += "<div class='itpResults' id ='" + i + "result'>" + studentsPerYear[i].name + "</div>";
                    //app.itpProjectsperStudentSearch(studentsPerYear[i].netid);
                }
                $("#resultsTarget").append(htmlString);
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
}
