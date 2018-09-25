// social share buttons
(function () {
    "use strict";
    document.querySelector("#share-facebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
    document.querySelector("#share-twitter").href = "https://twitter.com/intent/tweet?status=STEM Data Story: +" + window.location.href;
})();
