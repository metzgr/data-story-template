// draw both map in this file after all data are loaded
(function () {
    "use strict";

    window.stateAbbData = {};
    d3.json("viz/data/stateAbb.json", function (data) {
        stateAbbData = data;
    });

    let districts;

    function makeMap(error, us) {
        makeMap1(error, us, districts);
        makeMap2(error, us, districts);
    }

    let jsonString = "";
    let readInDataAsStringFired = false;

    // recursively load up splitted data files
    function readInDataAsString(fileNumber) {
        readInDataAsStringFired = true;
        if (fileNumber === 19) {
            /* Load us shape via d3 queue */
            districts = JSON.parse(jsonString);
            d3.queue()
                .defer(d3.json, 'viz/data/us.json')
                .await(makeMap);
            return;
        }
        fileNumber++;
        let filePath = '';
        filePath = 'viz/data/attributed_shape/with_attributes_string' + fileNumber;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", filePath, true);
        xhr.onload = function () {
            jsonString = jsonString.concat(xhr.responseText);
            readInDataAsString(fileNumber);
        };
        xhr.send();
    }

    function getPosition(element) {
        let yPosition = 0;

        while (element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    let map1_top = getPosition(document.getElementsByClassName("map_containers")[0]);

    function scrolled() {
        let scrollDistance = window.pageYOffset;

        if (scrollDistance > (map1_top * 0.8) ) {
            if (readInDataAsStringFired === false) {
                readInDataAsString(-1);
            }
        }
    }

    window.onscroll = function () {
        scrolled();
    };

})();