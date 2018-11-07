// draw both map in this file after all data are loaded
(function () {
    "use strict";

    window.stateAbbData = {};
    window.districts = {};
    window.usFeatures = {};
    window.mapDataFetchError = {};

    function passData(error, us, distr) {
        // store fetched data in global variables that will be used later
        usFeatures = us;
        districts = distr;
        mapDataFetchError = error;
    }

    // async fetch map data
    d3.json("viz/data/stateAbb.json", function (data) {
        stateAbbData = data;
    });
    d3.queue()
        .defer(d3.json, 'viz/data/us.json')
        .defer(d3.json, 'viz/data//with_attributes_v8.json')
        .await(passData);

    // get elemenet distance to page top
    function getPosition(element) {
        var yPosition = 0;

        while (element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    // map containers
    var map1_div = document.getElementById("map1");
    var map2_div = document.getElementById("map2");

    // map distance to page top
    var map1_top = getPosition(map1_div);
    var map2_top = getPosition(map2_div);

    // render map when scroll to it 
    window.addEventListener("scroll", function () {
        var scrolledDistance = window.pageYOffset;

        if (scrolledDistance > (map1_top - 150)) { // magic numbers to fine tune UX so that user see the spinner
            if (map1_div.getElementsByTagName("svg").length === 0) {
                makeMap1(mapDataFetchError, usFeatures, districts);
            }
        }

        if (scrolledDistance > (map2_top + 450)) { // magic numbers to fine tune UX so that user see the spinner
            if (map2_div.getElementsByTagName("svg").length === 0) {
                makeMap2(mapDataFetchError, usFeatures, districts);
            }
        }
    });

})();