// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function

    makeChart();
    window.addEventListener("resize", makeChart);

    function makeChart() {
        //remove old chart
        d3.select('#chart1_content_1').select("svg").remove();
        div_width = parseInt(d3.select('#chart1_content_1').style('width'))

        //temporary x for margin calc
        var temp_x = d3.scaleLinear()
            .domain([1.0, 0])
            .range([div_width-80, 0]);


         //calculate necessary right margin to maximzie chart space while ensuring enough annotation space
         if ((temp_x(.3))<120){
            margin_right = 200 -temp_x(.3)
         } else {
         margin_right = 80
        }
        var margin_bottom= 0;

        //reset margin for mobile version
        if (div_width < 380) {
            margin_right = 0;
            margin_bottom: 15;
        }


        //set the margin attributes
        var margin = {
                top: -10,
                right: margin_right,
                bottom: margin_bottom,
                left: 0
            },
            width = div_width- margin.left - margin.right,
            height = 280;

        //set the appropriate bar padding
        var y = d3.scaleBand().rangeRound([0, height]).paddingOuter(1).paddingInner(.5);


        //set the domain and range for the x axis
        var x = d3.scaleLinear()
            .domain([1.0, 0])
            .range([width, 0]);

        //y axis variable using the scale created above based on selected chart type
        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(0);


        //tip variable to format the tip using the class defined earlier, offset, and html function to return give the correct labels and info in the correct font
        function position_tip(y) {
            if (y > height / 2) {
                y = y - 150
            }
            return (100)
        }


        //svg is the standard name for the d3 bar chart graphic, this creates it and sets some attributes, append appends to it
        var svg = d3.select("#grade_bar").append("svg")
            .attr("width", width + margin.left + margin.right + 10) //extra padding for annotation
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        var dataFile = "viz/data/grade.txt";



        //read in the data tsv and recreate the y domain to only include characteristic variables based on the selected chart data
        d3.tsv(dataFile, type, function (error, data) {
            y.domain(data.map(function (d) {
                return d.characteristic;
            }));

            //append the bars to the chart
            var barBackground = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "barBackground")
                .attr("fill", function (d) {
                    return "#F3F3F5"
                })
                .attr("x", function (d) {
                    return x(0);
                })
                .attr("height", function (d) {
                    return y.bandwidth();
                })
                .attr("y", function (d) {
                    return y(d.characteristic);
                })
                .attr("width", width);

            //append the bars to the chart
            var bar = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", function (d) {
                    return "#2EB4E7"
                })
                .attr("x", function (d) {
                    return x(0);
                })
                .attr("height", function (d) {
                    return y.bandwidth();
                })
                .attr("y", function (d) {
                    return y(d.characteristic);
                }) //align bar with proper y axis characteristic
                .attr("width", function (d) {
                    return x(d.percentageEnrolledInAlgebra);
                }) //extend as far as the percentage enrolled in algebra 1
                .on('mouseover', mouseover) //show / hide the tip based on where the mouse is
                .on('mouseout', mouseout);

            //append the bars to the chart
            svg.selectAll("text")
                .data(data)
                .enter().append("text")
                .text(function (d) {
                    if (d.percentageEnrolledInAlgebra == 0 | d.percentageEnrolledInAlgebra == "") {
                        return ""
                    } else {
                        if (d.characteristic == "8th grade") {
                            return Math.round((d.percentageEnrolledInAlgebra) * 100) + "%"
                        } else {
                            return Math.round((d.percentageEnrolledInAlgebra) * 100)
                        }
                    }
                })
                .attr("x", function (d) {
                    return x(d.percentageEnrolledInAlgebra) + 5;
                }) //coordinates start at 0
                .attr("y", function (d) {
                    return y(d.characteristic) + 21;
                })
                .attr("text-anchor", "right")
                .style("font-size", "16px")
                .style("font-weight", 600)
                .style("font-family", function (d) {
                    if (d.characteristic == "8th grade") {
                        return "Roboto";
                    } else {
                        return "Roboto";
                    }
                })
                .style("fill", function (d) {
                    if (d.characteristic == "8th grade") {
                        return "#474747";
                    } else {
                        return "#616161";
                    }
                })       .style("font-weigth", function (d) {
                    if (d.characteristic == "8th grade") {
                        return 700;
                    } else {
                        return  600;
                    }
                });


            //append the y axis
            var appendYAxis = svg.append("g")
                .attr("class", "yAxis")
                .call(yAxis)
                .selectAll("text")
                .style("text-anchor", "start")
                .attr("dx", ".2em")
                .attr("dy", "-1.5em")
                .style("font-size", "14px")
                .style("font-family", "Roboto")
                .style("fill", "#2e2e2e")

            //append the custom annotations
            var annotation = svg.append("text")
                .attr("x", x(0))
                .attr("y", 25)
                .attr("text-anchor", "start")
                .style("font-size", "15px")
                .style("font-family", "Roboto")
                .style("fill", "#2e2e2e")
                .style("font-weight", 700)
                .text("% of schools offering Algebra I in...");

            const type = d3.annotationLabel

            //annotation are above text

            if (div_width < 380) {

            var annotations = [{
                    connector: {
                        type: "curve",
                        points: [
                            [x(.1), -5]
                        ]
                    },
                    className: "showAnnotation",
                    x: x(.65),
                    y: 60,
                    dx: x(.1),
                    dy: -10
                },
                {
                    note: {
                        label: "Early access to algebra is not commonplace",
                        wrap: 135,
                        bgPadding: 0,
                        align: "left",
                        lineType: "none"
                    },
                    className: "showAnnotation",
                    x: div_width-185,
                    y: 18,
                },
                {
                    note: {
                        label: "Juniors and seniors have limited access, but Algebra I is often required to graduate",
                        wrap: 180,
                        bgPadding: 0,
                        align: "left",
                        lineType: "none"
                    },
                    className: "showAnnotation2",
                    x: div_width -205,
                    y: 205,
                },
                {
                    connector: {
                        type: "curve",
                        points: [
                            [x(.1), 0]
                        ]
                    },
                    className: "showAnnotation",
                    x: x(.7),
                    y: 195,
                    dx: 30,
                    dy: 15
                }
            ].map(function (d) {
                d.color = "#2e2e2e";
                return d
            });
              } else {

            var annotations = [{
                    connector: {
                        type: "curve",
                        points: [
                            [x(.1), -30]
                        ]
                    },
                    className: "showAnnotation",
                    x: x(.65),
                    y: 55,
                    dx: x(.88)-x(.65),
                    dy: -30
                },
                {
                    note: {
                        label: "Early access to algebra is not commonplace",
                        wrap: 125,
                        bgPadding: 0,
                        align: "left",
                        lineType: "none"
                    },
                    className: "showAnnotation",
                    x: x(.9),
                    y: 15,
                },
                {
                    note: {
                        label: "Juniors and seniors have limited access, but Algebra I is often required to graduate",
                        wrap: 180,
                        bgPadding: 0,
                        align: "left",
                        lineType: "none"
                    },
                    className: "showAnnotation2",
                    x: x(.8),
                    y: 185,
                },
                {
                    connector: {
                        type: "curve",
                        points: [
                            [(x(.8)-x(.65))/2, 10]
                        ]
                    },
                    className: "showAnnotation",
                    x: x(.65),
                    y: 205,
                    dx: x(.8)-x(.65),
                    dy: 0
                }
            ].map(function (d) {
                d.color = "#2e2e2e";
                return d
            });

        }

            const makeAnnotations = d3.annotation()
                .type(type)
                .annotations(annotations)

            d3.select("svg")
                .append("g")
                .call(makeAnnotations)

            /* shift position of tool tip from left to right */
            total_width = parseInt(d3.select('body').style('width'))

            function position_tip(x, y) {
                if (div_width>400){
                if (x > ( div_width / 2) ) {
                    x = d3.max([x - 140, 140]) //move tooltip to left of mouse for elements in the right of page
                }
                if (y > height / 2) {
                    y = y - 75
                }
                return ([x, y]);
            } else{
                x = 10
                if (y > height / 2) {
                    y = y - 75
                }
                return ([x, y]);

            }

            }




            //set up interactive funcaitonality
            var div = d3.select("body").append("div").attr("class", "grade_tooltip").style("display","none");


            function mouseover(d) {
                div.transition().duration(100)
                .style("display","inline-block")
                    .style("opacity", .9);

                div.html("<span style='font-family: Roboto; font-size: 14px; color: #ffffff;'>" + d.characteristic +
                        "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                        "<span style='font-family: Roboto; font-size: 13px; color: #FFFFFF; line-height: 16px;'>" +
                        d3.format(",.0f")(d.percentageEnrolledInAlgebra * 100) +
                        "% of schools offered Algebra I</span><br/>" +
                        "<span style='font-family: Roboto; line-height: 15px;'>" +
                        d3.format(",.0f")(d.n_sch_w_alg) + " out of " + d3.format(",.0f")(d.total) + " schools</span>")
            .style("left",  (position_tip(d3.event.pageX, d3.event.pageY)[0]) + "px")
                .style("top",  (position_tip(d3.event.pageX, d3.event.pageY)[1]) + "px");
            }



            function mouseout(d) {
                div.transition().duration(200).style("display", "none");

            }


        });

        //define d as a type to be used
        function type(d) {
            d.percentageEnrolledInAlgebra = +d.percentageEnrolledInAlgebra;
            return d;
        }
    };

})();
