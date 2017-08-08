var itpYearBook = "https://itp.nyu.edu/ranch/api/itp-yearbook/";
var itpProjectsbyYear = "https://itp.nyu.edu/ranch/api/projects-finder-by-class/";
var itpProjectsperStudent = "https://itp.nyu.edu/ranch/api/projects-finder-by-creator/";
var itpProjects = "https://itp.nyu.edu/ranch/api/projects/";
var giphySearch = "https://api.giphy.com/v1/gifs/search?api_key=f83e46e2508b41bd954c4b821e8261ea&limit=1&offset=0&rating=G&lang=en&q=";

var studentsPerYear = {
    year: "2019",
    children: []
};

var projectsPerYear = [];
var projectsPerStudent = [];
var projectDetails = [];
var giphy = null;

function initialize() {
    $("#search").click(function () {
        $("#resultsTarget").html("");
        var newSearchTerm = $("#query").val();
        currentYear = new Date().getFullYear() + 2;
        studentsPerYear.year = newSearchTerm;

        if (newSearchTerm == "" || newSearchTerm < 1981 || newSearchTerm > currentYear) {
            newSearchTerm = currentYear;
            studentsPerYear.year = newSearchTerm;
        }
        itpYearBookSearch(newSearchTerm);
        createD3();
        //app.itpProjectsbyYearSearch(newSearchTerm);
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
        runGiphySearch(newSearchTerm);
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
}

function itpYearBookSearch(searchTerm) {
    $.ajax({
        url: this.itpYearBook + searchTerm,
        type: 'GET',
        dataType: 'json',
        error: function (data) {
            $("#searchTerm").html(data);
        },
        success: function (data) {
            studentsPerYear.children = data;
            $("#searchTerm").html("Class of " + searchTerm + " : " + studentsPerYear.children.length + " students.");
            //                var htmlString = '';
            //                for (var i = 0; i < studentsPerYear.length; i++) {
            //                    htmlString = "<div class='itpResults' " + "id ='" + i + "result'>" +
            //                        studentsPerYear[i].name +
            //                        "</div>";
            //                    $("#resultsTarget").append(htmlString);
            //app.itpProjectsperStudentSearch(studentsPerYear[i].netid);
        }
    });
}

function itpProjectsbyYearSearch(searchItem) {
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
}

function itpProjectsperStudentSearch(searchItem) {
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
}

function itpProjectDetails(searchItem) {
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
}

function runGiphySearch(searchItem) {
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

function createD3() { //inspired by many many many d3 examples out there
    $('#viz').html('');
    var margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 120
        },
        width = 960 - margin.right - margin.left,
        height = studentsPerYear.children.length * 15 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree();
    tree.size([height, width]);
    //tree.nodeSize([height, width]);
    //    tree.separation(function separation(a, b) {
    //    return (a.parent == b.parent ? 1 : 2) / a.depth;
    //    });

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var vis = d3.select("#viz").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "node")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nodes = tree.nodes(studentsPerYear);

    var link = vis.selectAll("pathlink")
        .data(tree.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = vis.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 3.5);

    node.append("text")
        .attr("x", function (d) {
            return d.children ? -10 : 10;
        })
        .attr("y", 3)
        .attr("text-anchor", function (d) {
            return d.children ? "end" : "start";
        })
        .text(function (d) {
            return d.name;
        });
}

$(document).ready(function () {
    initialize();
});
