// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function

    makeChart();
    //window.addEventListener("resize",makeChart);

    function makeChart() {
        //d3.select('#chart5_content_1').select("svg").remove();

    div_width = parseInt(d3.select('#chart5_content_1').style('width'))

    mobile_cutoff = 500; //switch to space efficient version at 500 due to long axis text
    //set the margin attributes
    var margin = {
            top: 30,
            right: 0,
            bottom: 20,
            left: 215
        }

    if (div_width <  mobile_cutoff){ //at lower width the longest entries in the axiss are wrapped
        margin.left = 133;
    }

    var   width = div_width- margin.left-margin.right;
     var    height = 400 - margin.top - margin.bottom;


    //set the appropriate bar padding on y axis
    var y = d3.scaleBand().domain(['Total']).rangeRound([0, height]).padding([0.44]);


    //set up offset of gender part of the graph
    var offset = 15;

    var tooltipColor = d3.scaleOrdinal()
        .domain(["Male", "Female", "White", "Black", "Hispanic", "Asian students", "Pacific Islander",
            "American Indian/Alaska Native", "Two or more races"
        ])
        .range(["#CADD72", "#CADD72", "#74CAE2", "#74CAE2", "#74CAE2", "#74CAE2", "#74CAE2", "#74CAE2", "#74CAE2",
            "#74CAE2", "#74CAE2"
        ]);


    //set the domain and range for the x axis
      if (div_width <  mobile_cutoff){ //dont create bars that go up to 100 on mobile to give extra space
        var x = d3.scaleLinear()
        .domain([.4, 0])
        .range([width, 0]);
      } else {
    var x = d3.scaleLinear()
        .domain([1, 0])
        .range([width, 0]);
    }


    //y axis variable using the scale created above based on selected chart type
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(0);

    //specify how to format the percent
    var formatPercent = d3.format(".0%");

    //svg is the standard name for the d3 bar chart graphic, this creates it and sets some attributes, append appends to it
    var svg = d3.select("#eth_gen_bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + offset) //+20 is for the offset of lower bars
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dataFile = "viz/data/figure5Data.txt";

    //read in the data tsv and recreate the y domain to only include characteristic variables based on the selected chart data
    d3.tsv(dataFile, type, function (error, data) {

        var dataTotal = data.filter(function (d) {
            if (d.characteristic == "Total") {
                return d.characteristic
            }
        });

        //set up the value for the dashed line showing overall enrollment
        var totalLineData = +dataTotal[0].percentageEnrolledInAlgebra

        var data = data.filter(function (d) {
            if (d.characteristic != "Total" & d.characteristic != "") {
                return d.characteristic
            }
        });

        y.domain(data.map(function (d) {
            return d.characteristic;
        }));


        //add bar background up to 100%
        var barBackground = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "barBackground")
            .attr("fill", "#F3F3F5")
            .attr("x", function (d) {
                return x(0);
            }) //coordinates start at 0
            .attr("height", function (d) {
                return y.bandwidth();
            })
            .attr("y", function (d) {
                if (d.characteristic == "Male" | d.characteristic == "Female") {
                    return y(d.characteristic) + offset;
                } else {
                    return y(d.characteristic);
                }
            }) //align bar with proper y axis characteristic
            .attr("width", width);


        //append the bars to the chart
        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", function (d) {
                if (d.characteristic === " " | d.characteristic === "") {
                    return "transparent"
                } else {
                    if (d.characteristic == "Male" | d.characteristic == "Female")
                        return "#7EC255"
                    else {
                        return "#2EB4E7"
                    }
                }
            })
            .attr("x", function (d) {
                return x(0);
            }) //coordinates start at 0
            .attr("height", function (d) {
                return y.bandwidth();
            })
            .attr("y", function (d) {
                if (d.characteristic == "Male" | d.characteristic == "Female") {
                    return y(d.characteristic) + offset;
                } else {
                    return y(d.characteristic);
                }
            }) //align bar with proper y axis characteristic
            .attr("width", function (d) {
                return x(d.percentageEnrolledInAlgebra);
            }) //extend as far as the percentage enrolled in algebra 1
            .on('mouseover', mouseover) //show / hide the tip based on where the mouse is
            .on('mouseout', mouseout);

        //append the text to end of chart
        svg.selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function (d) {
                if (d.percentageEnrolledInAlgebra == 0 | d.percentageEnrolledInAlgebra == "") {
                    return ""
                } else {
                    if (d.characteristic == "Asian students" | d.characteristic == "Female")
                        return Math.round((d.percentageEnrolledInAlgebra) * 100) + "%"
                    else {
                        return Math.round((d.percentageEnrolledInAlgebra) * 100)
                    }
                }
            })
            .attr("x", function (d) {
                if (d.characteristic == "White" | d.characteristic == "Two or more races" | d.characteristic == "Male") {
                    return x(totalLineData) + 5;
                } else {
                    return x(d.percentageEnrolledInAlgebra) + 5;
                }
            }) //coordinates start at 0
            .attr("y", function (d) {
                if (d.characteristic == "Male" | d.characteristic == "Female") {
                    return y(d.characteristic) + offset + 16;
                } else {
                    return y(d.characteristic) + 16;
                }
            })
            .attr("text-anchor", "right")
            .style("font-size", "14px")
            .style("font-family", "Roboto")
            .style("fill", "#616161");


        //custom y axis not using y axis class to allow for the custom offset
        if (div_width <  mobile_cutoff){
        var custom_y = [["Asian students"],["White"],["Two or more races"],["Pacific Islander"],["Hispanic"],
    ["American Indian/"],["Alaska Native"],["Black"],["Female"],["Male"]]

} else {
         var custom_y = [["Asian students"],["White"],["Two or more races"],["Pacific Islander"],
         ["Hispanic"], ["American Indian/Alaska Native"],["Black"],["Female"],["Male"]]

 }

        svg.selectAll("custom_y_axis").data(custom_y)
            .enter().append("text")
            .attr("x", -7)
            .attr("y", function (d) {
                if (d[0] == "Male" | d[0] == "Female") {
                    return y(d[0]) + offset + 16;
                } else if (d[0] =="American Indian/") {
                    return(y("American Indian/Alaska Native")) +8
                } else if (d[0] =="Alaska Native"){
                    return(y("American Indian/Alaska Native")) + 24
                }
                else {
                    return y(d[0]) + 16;
                }
            })
            .attr("text-anchor", "end")
            .style("font-size", "14px")
            .style("font-family", "Roboto")
            .style("fill", "#2e2e2e")
            .text(function (d) {
                return d[0];
            }
            );


          if (div_width < mobile_cutoff){
        var annotation = svg.append("text")
            .attr("x", x(.4))
            .attr("y", -15)
            .attr("text-anchor", "end")
            .style("font-size", "14px")
            .style("font-family", "Roboto")
            .style("font-weight",600)
            .style("fill", "#2e2e2e")
            .text("24% of 8th graders took Algebra I");
        } else {
        var annotation = svg.append("text")
            .attr("x", x(totalLineData))
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .style("font-family", "Roboto")
            .style("font-weight",600)
            .style("fill", "#2e2e2e")
            .text("24% of 8th graders took Algebra I");

        }

        /* custom y axis lines for two seperate graphs */
        var axisLineData = [{
                'x': 0,
                'y': 0.26
            },
            {
                'x': 0,
                'y': 6.7
            },
        ];

        var axisLineData2 = [{
                'x': 0,
                'y': 7
            },

            {
                'x': 0,
                'y': 9
            },
        ];

        var axisLineData3 = [{
                'x': totalLineData,
                'y': 0
            },
            {
                'x': totalLineData,
                'y': 9.2
            },
        ];

        var y_scale = d3.scaleLinear().domain([0, 1]).range([0, height / 8.72]);

        var line = d3.line()
            .x(function (d) {
                return x(d['x']);
            })
            .y(function (d) {
                return y_scale(d['y']);
            });

        var path = svg.append('path').attr("class", "yAxisLine").attr('d', line(axisLineData));
        var path = svg.append('path').attr("class", "yAxisLine2").attr('d', line(axisLineData2));
        var path = svg.append('path').attr("class", "yAxisLine3").attr('d', line(axisLineData3));

        //move tooltip to left of mouse for elements in the right of page
           total_width = parseInt(d3.select('body').style('width'))
        function position_tip(x, y) {
            if (div_width > mobile_cutoff){
            if (x > (50 + total_width / 2)) {
                x = d3.max(x - total_width, 140)
            }
            if (y > height / 2) {
                y = y - 75
            }
            return ([x, y]);}
            else{
                x = 10
                if (y > height / 2) {
                    y = y - 75
                }
                return ([x, y]);

            }

        }

        //set up interactive funcaitonality
        var div = d3.select("body").append("div")
            .attr("class", "eth_gen_tooltip")
               .style("display","none");

        function mouseover(d) {
            //highlight selected school types

            d3.select(this)
                .classed("active", false)
                .attr('fill', function (d) {
                    return tooltipColor(d.characteristic);
                })

            div.transition().duration(100).style("display","inline-block")
                .style("opacity", .9);
            div.html("<span style='font-family: Roboto; font-size: 13px; color: #ffffff;'>" + d.characteristic +
                    "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                    "<span style='font-family: Roboto; font-size: 13px; color: #FFFFFF; line-height: 16px;'>" +
                    d3.format(",.0f")(d.percentageEnrolledInAlgebra_orig) +
                    "% took Algebra I in 8th grade</span><br/>" +
                    "<span style='font-family: Roboto; line-height: 15px;'>" +
                    d3.format(",.0f")(d.total * d.percentageEnrolledInAlgebra) + " out of " + d3.format(",.0f")(d.total) +
                    " students</span>")
                .style("left", (position_tip(d3.event.pageX, d3.event.pageY)[0]) + "px")
                .style("top", (position_tip(d3.event.pageX, d3.event.pageY)[1]) + "px");
        }



        function mouseout(d) {
            div.transition().duration(200).style("display","none");

            d3.select(this)
                .classed("active", false)
                .attr('fill', function (d) {
                    if (d.characteristic === " " | d.characteristic === "") {
                        return "transparent"
                    } else {
                        if (d.characteristic == "Male" | d.characteristic == "Female")
                            return "#7EC255"
                        else {
                            return "#2EB4E7"
                        }
                    }
                })
        }

    });

    //define d as a type to be used
    function type(d) {
        d.percentageEnrolledInAlgebra = +d.percentageEnrolledInAlgebra;
        return d;
    }
}
})();
