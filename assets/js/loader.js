// Preloader

window.addEventListener("load", function () {

    var loader = document.getElementById("loader");
    var loader_wrapper = document.getElementById("loader-wrapper");

    loader.style.transition = "all 0.3s ease-out";
    loader.style.webkitTransition = "all 0.3s ease-out";
    loader.style.opacity = 0;

    loader_wrapper.style.transition = "all 1s ease-out";
    loader_wrapper.style.webkitTransition = "all 1s ease-out";
    loader_wrapper.style.opacity = 0;

    // render map right before the hero image slide in animation
    makeMap1(mapDataFetchError, usFeatures, districts);
    makeMap2(mapDataFetchError, usFeatures, districts);

    setTimeout(function () {
        document.body.removeChild(loader_wrapper);
    }, 1500);

});
