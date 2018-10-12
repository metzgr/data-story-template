// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function

    getSize();

    window.addEventListener("resize", makeChart);

    function makeChart() {
        getSize();
        makeMap1(null, usFeatures, districts);
    }

    function getSize() {
        d3.select('#chart4_content_1').selectAll("svg").remove();

        div_width = parseInt(d3.select('#chart4_content_1').style('width'));
        div_height = $(window).height() - 100; //add padding for top menu 

        //actual map size 
        var width = div_width,
            height = div_width * 2 / 3;

        //resize if view port height is the limiting factor
        if (height > div_height) {
            width = div_height * 4 / 3,
                height = div_height;
        }

        //Define map projection
        var projection = albersUsaPr()
            .scale(1200 * width / 940)
            .translate([div_width / 2, (height) / 2.2]);

        /* color scheme */
        var color = d3.scaleThreshold()
            .domain([0.01, 25, 50, 75, 99.99])
            .range(["#C1E7F2", "#74CAE2", "#2EB4E7", "#099ACC", "#0883A0", "#046B99"]);



        var formatDecimalComma = d3.format(",");

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

        //moves tooltip depending on x and y position in map\
        total_width = parseInt(d3.select('body').style('width'))

        function position_tip(x, y) {
            if (x > total_width / 2) {
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


        //set up interactive functionality for tooltip
        // get the correct container for map1
        var div = d3.select("body").append("div")
            .attr("class", "map1_tooltip").style("opacity", .9);


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

        /* Function to generate maps via json arguments */
        window.makeMap1 = function (error, us, districts) {

            //Define path generator
            var path = d3.geoPath()
                .projection(projection);

            var svg_legend = d3.select("#map1")
                .append("svg")
                .attr("width", div_width)
                .attr("height", function (x) {
                    if (div_width < 485) {
                        return 120;
                    } else {
                        return 95;
                    }
                }) //pad for legend
            ;


            //set up legend seperatly for small and large screens
            if (div_width < 485) {
                var legend_data = [
                    [div_width / 2, 15, "#C1E7F2", "null", "1", "1"],
                    [div_width / 2, 37, "#74cae2", "0,25", "2", "2"],
                    [div_width / 2, 49, "#2EB4E7", "25,50", "3", "3"],
                    [div_width / 2, 61, "#099ACC", "50,75", "4", "4"],
                    [div_width / 2, 73, "#0883A0", "75,99.99", "5", "5"],
                    [div_width / 2, 95, "#046B99", "99.99,100", "7", "7"],
                    [div_width / 2, 110, "#909090", "missing", "8", "8"]
                ];

                var legend_label_data = [
                    [div_width / 2 - 3, 23, "No schools offered it", "1"],
                    [div_width / 2 - 3, 45, "0-25", "2"],
                    [div_width / 2 - 3, 57, "25-50", "3"],
                    [div_width / 2 - 3, 69, "50-75", "4"],
                    [div_width / 2 - 3, 81, "75-100", "5"],
                    [div_width / 2 - 3, 103, "All schools offered it", "7"],
                    [div_width / 2 - 3, 118, "Missing data", "8"]
                ];

            } else {
                var legend_data = [
                    [div_width / 2 - 200, 13, "#C1E7F2", "null", "1", "1"],
                    [div_width / 2 - 100, 13, "#74cae2", "0,25", "2", "3"],
                    [div_width / 2 - 50, 13, "#2EB4E7", "25,50", "3", "4"],
                    [div_width / 2, 13, "#099ACC", "50,75", "4", "5"],
                    [div_width / 2 + 50, 13, "#0883A0", "75,99.99", "5", "6"],
                    [div_width / 2 + 150, 13, "#046B99", "99.99,100", "7", "7"],
                    [div_width / 2 - 25, 68, "#909090", "missing", "8", "8"]
                ];

                var legend_label_data = [
                    [div_width / 2 - 152, 35, "No schools offered it", "1"],
                    [div_width / 2 - 100, 35, ">0", "2"],
                    [div_width / 2 - 50, 35, "25", "3"],
                    [div_width / 2, 35, "50", "4"],
                    [div_width / 2 + 50, 35, "75", "5"],
                    [div_width / 2 + 100, 35, "<100", "6"],
                    [div_width / 2 + 150, 35, "All schools offered it", "7"],
                    [div_width / 2, 89, "Missing data", "8"]
                ];


                var triangle = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(25);

                var triangle = svg_legend.selectAll("map1Leg")
                    .data(legend_data)
                    .enter().append("path")
                    .attr("d", triangle)
                    .attr("stroke", "white")
                    .attr("fill", "white")
                    .attr("class", "triangle")
                    .attr("id", d => d[4])
                    // .attr("x",d=>d[0])
                    // .attr("y",10)
                    .attr("transform", function (d) {
                        return "translate(" + (d[0] + 24) + "," + (d[1] - 8) + ") rotate(-60)";
                    });;

            }
            var legend = svg_legend.selectAll("map1Leg")
                .data(legend_data)
                .enter()
                .append("rect");

            legend.attr("x", d => d[0])
                .attr("y", d => d[1])
                .attr("width", 48)
                .attr("height", 10)
                .attr("fill", d => d[2])
                .attr("data-value", d => d[3])
                .attr("class", "legendButton")
                .attr("id", d => d[4])
                .attr("idtwo", d => d[5]);


            var legend_text = svg_legend.selectAll("map1Leg")
                .data(legend_label_data)
                .enter()
                .append("text");

            legend_text.attr("x", d => d[0])
                .attr("y", d => d[1])
                .style("fill", "white")
                .text(d => d[2])
                .style("text-anchor", function (d) {
                    if (div_width > 485) {
                        if (d[2] == "All schools offered it" | d[2] == "<100") {
                            return "start";
                        } else if (d[2] == "No schools offered it") {
                            return "end";
                        } else {
                            return "middle";
                        };
                    } else {
                        return "end"
                    }
                })
                .style("font-size", "12px")
                .style("font-family", "Chivo")
                .attr("class", "legendButtonText")
                .attr("id", d => d[3])
                .attr("idtwo", d => d[3]);


            //Create main SVG element
            // get the corrext container for map1
            var svg = d3.select("#map1")
                .append("svg")
                .attr("width", div_width)
                .attr("height", height) //pad for legend
            ;



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
            var map_base = svg.append("g")
                .attr("id", "map");

            //Bind data and create one path per GeoJSON feature
            map = map_base.selectAll("path")
                .data(districts.features)
                .enter()
                .append("path")
                .style('stroke', "white")
                .style('stroke-width', ".15px")
                .attr("d", path)
                .attr("fill", get_fill)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

            /*Buttons in legend - capture click on radio, then based on selection, filters data to display fills*/
            // get the correct elements for map1
            var legendButtons = $('#map1 .legendButton');
            var legendButtonsText = $('#map1 .legendButtonText');
            var nolegendButtons = $('#map1 .nolegendButton');
            var triangles = $('#map1 .triangle')

            /* Design of the legend iteractivity was based off the implementaiton by WeStat available at: 
            https://github.com/Westat-Transportation/Westat-Transportation.github.io/blob/9293c1c382757e8a08eed80852812c2f7eee99b2/EnglishLearners/demo/index.html */
            legendButtons.on("click", function () {
                triangles.each(function () {
                    $(this).removeClass("highlightButton");
                })

                legendButtonsText.each(function () {
                    $(this).removeClass("highlightButton");
                })

                triangles.each(function () {
                    $(this).removeClass("highlightButton");
                })

                legendButtonsText.each(function () {
                    $(this).addClass("hasSelector");
                });


                legendButtons.each(function () {
                    $(this).addClass("hasSelector");
                });

                triangles.each(function () {
                    $(this).addClass("hasSelector");
                });


                if ($(this).hasClass("highlightButton")) {
                    legendButtons.each(function () {
                        $(this).removeClass("highlightButton").removeClass("hasSelector");
                    });
                    legendButtonsText.each(function () {
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


                    var selector = '#map1 .triangle#' + $(this).attr("id");
                    var selectorTriangle = $(selector);
                    selectorTriangle.addClass("highlightButton");

                    var textSelector = '#map1 .legendButtonText#' + $(this).attr("id");
                    var textSelectorText = $(textSelector);
                    textSelectorText.addClass("highlightButton");

                    var textSelectortwo = '#map1 .legendButtonText#' + $(this).attr("idtwo");
                    var textSelectorTexttwo = $(textSelectortwo);
                    textSelectorTexttwo.addClass("highlightButton");


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

            map_base.attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path);

            map_base.append("path")
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
    }
})();