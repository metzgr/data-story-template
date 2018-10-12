// draw both map in this file after all data are loaded
(function () {
    "use strict";

    window.stateAbbData = {};
    window.districts = {};
    window.usFeatures = {};

    function makeMap(error, us, distr) {
        usFeatures = us;
        districts = distr;
        makeMap1(error, us, distr);
        makeMap2(error, us, distr);
    }

    d3.json("viz/data/stateAbb.json", function (data) {
        stateAbbData = data;
    });

    d3.queue()
        .defer(d3.json, 'viz/data/us.json')
        .defer(d3.json, 'viz/data//with_attributes_v8.json')
        .await(makeMap);

})();