// responsive/adaptive iframe
function resizeIframe(obj) {
    // get iframe parent container width
    var parent_container_width = obj.parentElement.clientWidth;
    // console.log(parent_container_width)

    if (obj.contentWindow.document.body.scrollWidth === null) {
        return;
    }
    // obj.contentWindow.document.body.style.height ? obj.contentWindow.document.body.style.height.replace("px", "") : 
    var content_width = obj.contentWindow.document.body.scrollWidth;
    console.log(content_width)
    var content_height = obj.contentWindow.document.body.style.height ? obj.contentWindow.document.body.style.height.replace("px", "") : obj.contentWindow.document.body.scollHeight;
    console.log(content_height)
    // set iframe size&dimension to just fit the actual content
    obj.style.width = content_width + "px";

    obj.style.height = content_height + "px";
    console.log(obj, obj.style.width, obj.style.height)


    // scale down iframe
    var content_container_ratio = parent_container_width / content_width;
    var elStyles = obj.style;
    elStyles.setProperty("-webkit-transform-origin", "0 0");
    elStyles.setProperty("-webkit-transform", "scale(" + content_container_ratio + ")");
    elStyles.setProperty("-moz-transform-origin",  "0 0"); 
    elStyles.setProperty("-moz-transform", "scale(" + content_container_ratio + ")");
    elStyles.setProperty("-ms-transform-origin", "0 0");
    elStyles.setProperty("-ms-transform", "scale(" + content_container_ratio + ")"); 
    elStyles.setProperty("-o-transform-origin", "0 0"); 
    elStyles.setProperty("-o-transform", "scale(" + content_container_ratio + ")"); 
    elStyles.setProperty("transform-origin", "0 0"); 
    elStyles.setProperty("transform", "scale(" + content_container_ratio + ")");

    // reset the iframe parent container height
    var newParentHeight = content_container_ratio * content_height;
    // console.log("ratio ", content_container_ratio)
    // console.log("contenHeight ", content_height)
    // console.log("multiplyied ", newParentHeight)
    // console.log("objparenhei before ", obj.parentElement.style.height)
    obj.parentElement.style.height = newParentHeight + "px";
    // console.log("after conhei ", obj.parentElement.style.height)
}

function apply_resize() {
    document.querySelectorAll("iframe").forEach(function(ele) {
        resizeIframe(ele);
    })
}

// iframe responsiveness
// window resize
window.onresize = function () {
    apply_resize();
};

// initial page load calculation
window.onload = function () {
    apply_resize();
};

// tab switch
