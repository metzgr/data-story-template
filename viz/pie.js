// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function
    makeChart();
    window.addEventListener("resize",makeChart);

    function makeChart() {
        d3.select('#chart3_content_1').select("pie_chart").remove();

        div_width = parseInt(d3.select('#chart3_content_1').style('width'))

    /* Set up basic graph appearance parameters*/
    var formatSum = d3.format(".1s");

    //charts need atleast 50 radius and some padding for horizonal presentation, otherwise trigger vertical
        var vertical = false;

        if (div_width/4 <110){ //do 4 of graphs fit horizontally or not?
        vertical = true;
        }


         var max_r = (div_width-40)/8;

         if (vertical){
            max_r = 80;
         }

    var padding = 10;

    var radius = d3.scaleSqrt()
        .range([0, max_r]);


    var color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#F3F3F5", "#2EB4E7"]);


    var color_rural = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#22222a", "#22222a"]);



    var arc = d3.arc()
        .padRadius(5);

    var pie = d3.pie()
        .sort(null)
        .padAngle(0.02)
        .value(function (d) {
            return d.piePortion;
        });

    function rounding(d) {
        if (d.characteristic == "At suburban schools" || d.characteristic == "Urban") {
            return d3.format(".2s")(d.total)
        } else {
            return d3.format(".3s")(d.total).toUpperCase()
        }
    }

    /* Data load function*/
    d3.csv("viz/data/pie_data.csv", function (d, i, columns) {
        return {
            characteristic: d.characteristic,
            total: +d.total,
            number: +d.number,
            sum: d3.sum(columns.slice(3, 5), function (key) {
                return +d[key];
            }),
            portions: columns.slice(3).map(function (key) {
                return {
                    portion: key,
                    piePortion: +d[key]
                };
            })
        };
    }, function (error, data) {
        if (error) throw error;
        radius.domain([0, d3.max(data, function (d) {
            return d.number;
        })]);
        color.domain(data.columns.slice(1));


        var svg = d3.select("#pie_chart").selectAll(".pie")
            .data(data.sort(function (a, b) {
                return b.sum - a.sum;
            }))
            .enter().append("svg").attr("class", "pie")
            .each(multiple)
            .select("g");


        /* funciton that iterate through each school type pie chart adding chart and labels */
        function multiple(d) {
            var r = radius(+d.number);
            var pie_svg = d3.select(this)
                .attr("width", function(d){
                    if (!vertical){
                   return r * 2.2 + 30;
               }
                   else {
                    return div_width + 35;
                   }
                }
                    )
                .attr("height",function(d){
                    if (!vertical){
                   return max_r*2 + 85 ;
               }
                   else {

                    return r*2 + 105 ; //extra padding to create some vertical seperation
                   }
                }
                    )
                .append("g")
                .attr("transform", function(d){
                    if (!vertical){
                        return "translate(" + (1.1 * r + 15) + "," + ((max_r)*2 +20- r) + ")";
                    }
                    else {
                    return "translate(" + (div_width/4)*1.3  +"," + ((r)*2 +20- r) + ")";

                    }
                    }

                    );

            pie_svg.selectAll(".arc")
                .data(function (d) {
                    return pie(d.portions);
                })
                .enter().append("path")
                .attr("class", "arc")
                .attr("stroke",
                function (d) {
                    if( d.value == 75 | d.value == 25 ){ //selecting only the section of the rural graph
                      return  "#22222a";
                    } else {
                    return  "#2EB4E7";
                }

                } )
                .attr("d", arc.outerRadius(r).innerRadius(0))
                .style("fill", function (d) {
                    if( d.value == 75 ){ //selecting only the bigger section of the rural graph
                      return  color_rural(d.data.portion);
                    } else {
                    return  color(d.data.portion);
                }

                });

            pie_svg.append("text")
                .attr("class", "pieTextTitle")
                .attr("color", "white")
                .style("font-family", "Roboto")
                .style("font-family",500)
                .attr("x", 0)
                .attr("text-anchor", "middle")
                .attr("fill", "#474747")
                .attr("dy", function (d) {
                    return radius(+d.number)  *-1 -8
                })
                .text(function (d) {
                    return d.characteristic
                });


            var bottom_label = pie_svg.append("text")
                .attr("class", "pieText")
                .attr("x", 0)
                .attr("y", r + 25)
                .attr("text-anchor", "middle")
                .style("font-family", "Roboto")
                .style("font-weight",700)
                .text(function (d) {
                    return d3.format(",")(Math.round(d.portions[1].piePortion)) + "%";
                })
                .append("tspan")
                .text(" of ")
                .style("font-family", "Roboto")
                .style("font-weight",400)
                .append("tspan").
            text(function (d) {
                return rounding(d);
            }).style("font-family", "Roboto").style("font-weight",700);

            pie_svg.append("text")
                .attr("class", "pieText")
                .attr("x", 0)
                .attr("dy", function (d) {
                    return r + 44
                })
                .style("font-family", "Roboto")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    if (d.characteristic == "At suburban schools") {
                        return "8th graders could";
                    } else {
                        return "8th graders";
                    }
                })

            pie_svg.append("text")
                .attr("class", "pieText")
                .attr("x", 0)
                .attr("text-anchor", "middle")
                .attr("y", function (d) {
                    return r + 62
                })
                .text(function (d) {
                    if (d.characteristic == "At suburban schools") {
                        return "take Algebra I";
                    } else {
                        return "";
                    }
                })
                .style("font-family", "Roboto");
        }
    });
}
})();
