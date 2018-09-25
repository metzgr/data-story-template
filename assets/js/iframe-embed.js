// responsive vizs via iframe
(function () {
    "use strict";

    // scale iframe (and its content) up and down, to fit in its parent container
    function resizeIframe(iframeEl) {
        // get iframe parent container width
        let parentContainerWidth = iframeEl.parentElement.clientWidth;

        // do nothing for iframe without content
        if (iframeEl.contentWindow.document.body.scrollWidth === null) {
            return;
        }

        // the inner content's actual width and height
        let contentWidth = iframeEl.contentWindow.document.body.scrollWidth;
        let contentHeight = iframeEl.contentWindow.document.body.style.height ? iframeEl.contentWindow.document.body.style.height.replace("px", "") : iframeEl.contentWindow.document.body.scollHeight;

        // set iframe to be the same size as the actual content
        iframeEl.style.width = contentWidth + "px";
        iframeEl.style.height = contentHeight + "px";

        // scale the 1-to-1 sized iframe down/up, to fit in its containing div's width
        // the scaling ratio
        let contentContainerRatio = parentContainerWidth / contentWidth;
        // apply the scaling ratio by transform
        let iframeStyles = iframeEl.style;
        iframeStyles.setProperty("-webkit-transform-origin", "0 0");
        iframeStyles.setProperty("-webkit-transform", "scale(" + contentContainerRatio + ")");
        iframeStyles.setProperty("-moz-transform-origin", "0 0");
        iframeStyles.setProperty("-moz-transform", "scale(" + contentContainerRatio + ")");
        iframeStyles.setProperty("-ms-transform-origin", "0 0");
        iframeStyles.setProperty("-ms-transform", "scale(" + contentContainerRatio + ")");
        iframeStyles.setProperty("-o-transform-origin", "0 0");
        iframeStyles.setProperty("-o-transform", "scale(" + contentContainerRatio + ")");
        iframeStyles.setProperty("transform-origin", "0 0");
        iframeStyles.setProperty("transform", "scale(" + contentContainerRatio + ")");
        // overflow hidden for better ux
        iframeStyles.setProperty("overflow", "hidden");

        // set the parent container height to show the entire iframe
        // get the scaled up height
        let newParentHeight = contentContainerRatio * contentHeight;
        iframeEl.parentElement.style.height = newParentHeight + "px";
    }

    // get all iframes
    let iframes = document.querySelectorAll("iframe");

    // attach resizer on initial page load
    window.onload = function () {
        iframes.forEach(function (ele) {
            ele.onload = function () {
                resizeIframe(this);
            };
        });
    };

    // resize on window resize
    window.onresize = function () {
        iframes.forEach(function (ele) {
            resizeIframe(ele);
        });
    };

})();