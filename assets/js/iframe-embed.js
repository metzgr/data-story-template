// responsive vizs via iframe
// scale iframe (and its content) up and down
function resizeIframe(iframeEl) {
    "use strict";

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
    // apply the scaling ratio with CSS transform
    let iframeScaling = iframeEl.style;
    iframeScaling.setProperty("-webkit-transform-origin", "0 0");
    iframeScaling.setProperty("-webkit-transform", "scale(" + contentContainerRatio + ")");
    iframeScaling.setProperty("-moz-transform-origin",  "0 0"); 
    iframeScaling.setProperty("-moz-transform", "scale(" + contentContainerRatio + ")");
    iframeScaling.setProperty("-ms-transform-origin", "0 0");
    iframeScaling.setProperty("-ms-transform", "scale(" + contentContainerRatio + ")"); 
    iframeScaling.setProperty("-o-transform-origin", "0 0"); 
    iframeScaling.setProperty("-o-transform", "scale(" + contentContainerRatio + ")"); 
    iframeScaling.setProperty("transform-origin", "0 0"); 
    iframeScaling.setProperty("transform", "scale(" + contentContainerRatio + ")");

    // set the parent container height to show the entire iframe
    // get the scaled up height
    let newParentHeight = contentContainerRatio * contentHeight;
    iframeEl.parentElement.style.height = newParentHeight + "px";
}

function apply_resize() {
    "use strict";

    document.querySelectorAll("iframe").forEach(function(ele) {
        resizeIframe(ele);
    })
}

// resize on initial page load
window.onload = function () {
    "use strict";

    apply_resize();
};

// resize on window resize
window.onresize = function () {
    "use strict";

    apply_resize();
};
