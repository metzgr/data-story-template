// draw both map in this file after all data are loaded
(function () {
    "use strict";

    window.stateAbbData = {};
    window.districts = {};
    window.usFeatures = {};
    window.mapDataFetchError = {};

    function passData(error, us, distr) {
        // store fetched data in two global variables that will be used later
        usFeatures = us;
        districts = distr;
        mapDataFetchError = error;
        // makeMap1(mapDataFetchError, usFeatures, districts);
        // makeMap2(mapDataFetchError, usFeatures, districts);
    }

    d3.json("viz/data/stateAbb.json", function (data) {
        stateAbbData = data;
    });

    d3.queue()
        .defer(d3.json, 'viz/data/us.json')
        .defer(d3.json, 'viz/data//with_attributes_v8.json')
        .await(passData);

})();