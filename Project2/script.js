var itpYearBook = "https://itp.nyu.edu/ranch/api/itp-yearbook/";
var itpPeople = "https://itp.nyu.edu/ranch/api/people/";
var giphySearch = "https://api.giphy.com/v1/gifs/search?api_key=f83e46e2508b41bd954c4b821e8261ea&limit=25&offset=0&rating=G&lang=en&q=";

var studentsPerYear = {
    year: "2019",
    children: []
};

var giphyURL = "itp.png";
var itpPhoto = "itp.png";

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
    });

    $("#query").keypress(function (e) {
        if (e.which == 13) {
            $("#search").trigger('click')
        }
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
            createD3();
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
            if (data.data.length > 0) {
                giphyURL = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;
            } else giphyURL = "itp.png";
            var img = $("<img />").attr('src', giphyURL).on('load', function () {});
            $("#giphy").html("How you see yourself...");
            $("#giphy").empty().append(img);

        }
    });
}

function itpPeopleSearch(netid) {
    $.ajax({
        url: this.itpPeople + netid + "/details",
        type: 'GET',
        dataType: 'json',
        error: function (data) {
            $("#searchTerm").html(data);
        },
        success: function (data) {
            console.log(data.misc.photo_url);
            if (data.misc.photo_url != null) {
                itpPhoto = data.misc.photo_url;
                var img = $("<img />").attr('src', "https://itp.nyu.edu/" + itpPhoto).on('load', function () {});
            } else {
                itpPhoto = "itp.png";
                var img = $("<img />").attr('src', itpPhoto).on('load', function () {});
            }
            $("#giphy").html("How others see you...");
            $("#giphy").empty().append(img);
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

    node.append("text").attr("data-name", function (d, i) {
            return "name" + i;
        })
        .attr("x", function (d) {
            return d.children ? -10 : 10;
        })
        .attr("y", 3)
        .attr("text-anchor", function (d) {
            return d.children ? "end" : "start";
        })
        .text(function (d) {
            return d.name;
        }).on('click', function (d) {
            itpPeopleSearch(d.netid);
            setTimeout(function () {
                runGiphySearch(d.name);
            }, 2000);

            d3.select(this)
                .transition()
                .attr("fill", "blue")
                .duration(1000);
        });
}

$(document).ready(function () {
    initialize();
});
