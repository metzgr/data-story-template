// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function

    //this  sets up the appearance of the loading spinner
    var loader_appearance = {
        length: 10,
        radius: 20,
        color: '#046B99',
        lines: 10,
        trail: 50,
        className: 'loader',
    };

    var target = document.getElementById('map1_content'); // this <section> element ID is "map2_content" for map2

    //actual map size 
    var width = 937,
        height = 580;

    //Define map projection
    var projection = albersUsaPr()
        .scale(1200)
        .translate([width / 2, (height) / 2 - 15]);

    /* color scheme */
    var color = d3.scaleThreshold()
        .domain([0.01, 25, 50, 75, 99.99])
        .range(["#C1E7F2", "#74CAE2", "#2EB4E7", "#099ACC", "#0883A0", "#046B99"]);

    //set up interactive functionality for tooltip
    // get the correct container for map1
    var div = d3.select("#map1").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    var formatDecimalComma = d3.format(",");

    var stateAbbData;
    d3.json("viz/data/stateAbb.json", function (data) {
        stateAbbData = data;
    });

    /* ```````````````````` CONVIENIENCE FUNCTIONS ```````````````````` */
    function get_fill(d) {
        if (d.properties.tbl2pct === null || d.properties.tbl2pct == "?") {
            return "#909090";
        } else {
            return color(+d.properties.tbl2pct);
        }
    }

    function reportable_p(d) {
        if (d == null) {
            return "Not Reported";
        } else {
            return Math.round(+d) + "%";
        }
    }

    function reportable(d) {
        if (d == null) {
            return "Not Reported";
        } else {
            return formatDecimalComma(Math.round(+d));
        }
    }

    function reportable_s(d) {
        if (d == null) {
            return "Not Reported";
        } else {
            return formatDecimalComma(+d) + " schools";
        }
    }

    //moves tooltip depending on x and y position in map
    function position_tip(x, y) {
        if (x > width / 2) {
            x = x - 450; //move tooltip to left of mouse for elements in the right of page
        }
        if (y > height / 2) {
            y = y - 150;
        }
        return ([x, y]);
    }

    function stateAbb(d) {
        for (var i = 0; i < stateAbbData.length; i++) {
            if (d == stateAbbData[i].fips) {
                return stateAbbData[i].abbrev;
            }
        }
    }

    function mouseover(d) {
        //highlight selected school district 
        d3.select(this).style('stroke', 'black').style('stroke-width', '1px');
        div.transition().duration(100)
            .style("display", "inline-block");
        div.html(hoverText(d))
            .style("left", (position_tip(d3.event.pageX, d3.event.pageY)[0]) + "px")
            .style("top", (position_tip(d3.event.pageX, d3.event.pageY)[1]) + "px");
    }

    function hoverText(d) {
        if (d.properties.tbl4pct_alg == null) {
            return "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; font-size: 15px; color: white;'>" + d.properties
                .NAME + "</span>" +
                "<span style='line-height: 2;float:right; font-family: 'Chivo', sans-serif; font-weight: 700; font-size: 15px;'>" + stateAbb(
                    d.properties.STATEFP) +
                "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; color: white;'>Not Reported</span>";
        } else if (d.properties.tbl4pct_alg == "?") {
            return "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; font-size: 15px; color: white;'>" + d.properties
                .NAME + "</span>" +
                "<span style='line-height: 2;float:right; font-family: 'Chivo', sans-serif; font-weight: 700; font-size: 15px;'>" + stateAbb(
                    d.properties.STATEFP) +
                "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; color: white;'Not Applicable</span><br>" +
                "<span style='font-family: 'Chivo', sans-serif; font-weight: 400;'>0 out of 0 schools</span>";
        } else {
            return "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; font-size: 15px; color: white;'>" + d.properties
                .NAME + "</span>" +
                "<span style='line-height: 2;float:right; font-family: 'Chivo', sans-serif; font-weight: 700; font-size: 15px;'>" + stateAbb(
                    d.properties.STATEFP) +
                "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                "<span style='line-height: 2;font-family: 'Chivo', sans-serif; font-weight: 400; color: white;'>" + reportable_p(d.properties.tbl2pct) +
                " offered Algebra I in 8th grade" + "</span><br>" +
                "<span style='font-family: 'Chivo', sans-serif; font-weight: 400;'>" + reportable(d.properties.tbl2n_alg_sch) + " out of " +
                reportable_s(d.properties.tbl2n_sch) + "</span>";
        }
    }

    function mouseout(d) {
        div.transition().duration(200).style("display", "none");
        d3.select(this).style('stroke', 'grey').style('stroke-width', ".15px");
    }

    /*create loader that will be stopped in map function */
    var loader = new Spinner(loader_appearance).spin(target);

    /* Load GEOjson via queue */
    d3.queue()
        .defer(d3.json, 'viz/data/us.json')
        .defer(d3.json, 'viz/data/with_attributes_v8.json')
        .await(makeMap);

    /* Function to generate maps via json arguments */
    function makeMap(error, us, districts) {

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        //Create SVG element
        // get the corrext container for map1
        var svg = d3.select("#map1")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var zoom = d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed);
        svg.call(zoom).on("wheel.zoom", null);

        function zoomed() {
            map.attr('transform',
                'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
            mapOverlay.attr('transform',
                'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
        };

        function transition(zoomLevel) {
            svg.transition()
                .delay(50)
                .duration(500)
                .call(zoom.scaleBy, zoomLevel);
        }

        //Create a container in which all zoom-able elements exist
        var map = svg.append("g")
            .attr("id", "map");

        //Bind data and create one path per GeoJSON feature
        map = map.selectAll("path")
            .data(districts.features)
            .enter()
            .append("path")
            .style('stroke', "gray")
            .style('stroke-width', ".15px")
            .attr("d", path)
            .attr("fill", get_fill)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        // At this point the map has loaded and appending, time to stop the loading icon
        loader.stop();

        /*Buttons in legend - capture click on radio, then based on selection, filters data to display fills*/
        // get the correct elements for map1
        var legendButtons = $('#map1 .legendButton');
        var nolegendButtons = $('#map1 .nolegendButton');
        var triangles = $('#map1 div.triangle')

        /* Design of the legend iteractivity was based off the implementaiton by WeStat available at: 
        https://github.com/Westat-Transportation/Westat-Transportation.github.io/blob/9293c1c382757e8a08eed80852812c2f7eee99b2/EnglishLearners/demo/index.html */
        legendButtons.on("click", function () {
            triangles.each(function () {
                $(this).removeClass("highlightButton");
            })

            legendButtons.each(function () {
                $(this).addClass("hasSelector");
            });
            nolegendButtons.each(function () {
                $(this).addClass("hasSelector");
            });
            if ($(this).hasClass("highlightButton")) {
                legendButtons.each(function () {
                    $(this).removeClass("highlightButton").removeClass("hasSelector");
                });
                nolegendButtons.each(function () {
                    $(this).removeClass("hasSelector");
                });


                map.attr("fill", get_fill);
            } else {
                legendButtons.each(function () {
                    $(this).removeClass("highlightButton");
                });


                var selector = '#map1 div.triangle#' + $(this).attr("id");
                var selectorTriangle = $(selector);
                selectorTriangle.addClass("highlightButton");


                $(this).addClass("highlightButton");
                var buttonValue = $(this).attr("data-value");
                var buttonValueSplit = buttonValue.split(',')
                var buttonValue0 = +buttonValueSplit[0]
                var buttonValue1 = +buttonValueSplit[1]

                map.attr("fill", function (d) {
                    if (buttonValue1 == "100") {
                        if (+d.properties.tbl2pct > buttonValue0) {
                            return color(+d.properties.tbl2pct);
                        } else {
                            return "white";
                        }
                    } else if (buttonValue == "missing") {

                        if (d.properties.tbl2pct === null || d.properties.tbl2pct == "?") {
                            return "#909090"
                        } else {
                            return "white"
                        }

                    } else if (buttonValueSplit[0] === "null") {
                        if (d.properties.tbl2pct < 0.01 && d.properties.tbl2pct !== null) {
                            return color(0);
                        } else {
                            return "white";
                        }
                    } else if (buttonValue0 >= 0) {
                        if (d.properties.tbl2pct > buttonValue0 && d.properties.tbl2pct < buttonValue1) {
                            return color(+d.properties.tbl2pct);
                        } else {
                            return "white";
                        }
                    }
                });
            }
        });

        /* STATE BORDERS - state mesh added onto the district */
        var mapOverlay = svg.append("g")
            .attr("id", "map");

        mapOverlay.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path);

        mapOverlay.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                return a !== b;
            }))
            .attr("id", "state-borders")
            .attr("d", path);

        //Create zoom buttons
        var createZoomButtons = function () {
            //Create the clickable groups
            //Zoom in button
            var zoomIn = svg.append("g")
                .attr("class", "zoomButton") //All share the 'zoom' class
                .attr("id", "zoom_in") //The ID will tell us which direction to head
                .attr("transform", "translate(" + (5) + "," + (5) + ")");

            zoomIn.append("svg:image").attr('x', 0)
                .attr('y', 0)
                .attr('width', 23)
                .attr('height', 23)
                .attr("xlink:href", "viz/plus.svg")

            //Zoom out button
            var zoomOut = svg.append("g")
                .attr("class", "zoomButton")
                .attr("id", "zoom_out")
                .attr("transform", "translate(" + (5) + "," + (32) + ")");

            zoomOut.append("svg:image").attr('x', 0)
                .attr('y', 0)
                .attr('width', 23)
                .attr('height', 23)
                .attr("xlink:href", "viz/minus.svg")
            //Zooming interaction
        };

        createZoomButtons();
        
        // select the correct element
        d3.selectAll('#map1 g[class="zoomButton"]').on('click', function () {
            if (this.id === 'zoom_in') {
                transition(1.2); // increase on 0.2 each time
            }
            if (this.id === 'zoom_out') {
                transition(0.8); // deacrease on 0.2 each time
            }
        });
    }
})();