// ajax load hero image
var bg_img = new Image(); // Create new img element
bg_img.addEventListener('load', function () {
    // set background here
    $('.hero-right').css('background-image', 'url(web/img/Desktop-HD-photo-cropped700px.png)');
}, false);
bg_img.src = 'web/img/Desktop-HD-photo-cropped700px.png'; // Set source path

// fix social row to top
window.onscroll = function () {
    scrolled();
};

function getPosition(element) {
    var yPosition = 0;

    while (element) {
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return yPosition;
}

var header = document.getElementsByClassName("social-row")[0];
var sticky = header.offsetTop;
var iframe2_top = getPosition(document.getElementById("chart2-iframe"));
var iframe5_top = getPosition(document.getElementById("chart5-iframe"));


function scrolled() {
    var scrollDistance = window.pageYOffset;

    var map1_iframe = $('iframe#chart4-iframe');
    var map2_iframe = $('iframe#chart6-iframe');
    var map1_iframe_native = map1_iframe.get(0);
    var map2_iframe_native = map2_iframe.get(0);

    if (scrollDistance > sticky) {
        header.classList.add("fixed-top");
        $('.date').hide();
    } else {
        header.classList.remove("fixed-top");
        $('.date').show();
    }

    if (scrollDistance > iframe2_top) {
        if (map1_iframe.attr("src") === undefined) {
            map1_iframe.attr('src', 'visualizations/Map/index.html');
            map1_iframe.on("load", function () {
                resizeIframe(map1_iframe_native);
            });
        }
    }

    if (scrollDistance > iframe5_top) {
        if (map2_iframe.attr("src") === undefined) {
            map2_iframe.attr('src', 'visualizations/Map2/index.html');
            map2_iframe.on("load", function () {
                resizeIframe(map2_iframe_native);
            });
        }
    }
}

// particle effect
var config = {
    "particles": {
        "number": {
            "value": 30,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#2EB4E7", "#7EC255"]
        },
        "shape": {
            "type": "edge",
            "stroke": {
                "width": 0,
                "color": "#212121"
            }
        },
        "opacity": {
            "value": .8,
            "random": false,
            "anim": {
                "enable": false,
                "speed": .1,
                "opacity_min": 0,
                "sync": false
            }
        },
        "size": {
            "value": 6,
            "random": true
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": .5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "in",
            "attract": {
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "push": {
                "particles_nb": 3
            }
        }
    },
    "retina_detect": true
};

var hero_height = $(".hero-row").height();
$("#hero-bg").height(hero_height);
particlesJS('hero-bg', config);

// responsiveness: window resize re-apply particle
$(window).resize(function () {
    var hero_height = $(".hero-row").height();
    $("#hero-bg").height(hero_height);
    particlesJS('hero-bg', config);

});

// responsive/adaptive iframe
function resizeIframe(obj) {
    // get iframe parent container width
    var parent_container_width = $(obj).parent().width();

    if (obj.contentWindow.document.body.scrollWidth === null) {
        return;
    }

    var content_width = obj.contentWindow.document.body.scrollWidth;
    var content_height = obj.contentWindow.document.body.style.height ? obj.contentWindow.document.body.style.height.replace("px", "") : obj.contentWindow.document.body.scrollHeight;

    // set iframe size&dimension to just fit the actual content
    obj.style.width = content_width + "px";
    obj.style.height = content_height + "px";

    // scale down iframe
    var content_container_ratio = parent_container_width / content_width;
    $(obj).css({
        "-webkit-transform-origin": "0 0",
        "-webkit-transform": "scale(" + content_container_ratio + ")",
        "-moz-transform-origin": "0 0",
        "-moz-transform": "scale(" + content_container_ratio + ")",
        "-ms-transform-origin": "0 0",
        "-ms-transform": "scale(" + content_container_ratio + ")",
        "-o-transform-origin": "0 0",
        "-o-transform": "scale(" + content_container_ratio + ")",
        "transform-origin": "0 0",
        "transform": "scale(" + content_container_ratio + ")"
    });

    // reset the iframe paranet container height
    var newParentHeight = content_container_ratio * content_height;
    $(obj).parent().height(newParentHeight);
}

function apply_resize() {
    var chart_iframe = [];

    for (i = 1; i < 7; i++) {
        var iframe_id = "chart" + i + "-iframe";
        chart_iframe.push(document.getElementById(iframe_id));
        resizeIframe(chart_iframe[i - 1]);
    }
}

// iframe responsiveness
// window resize
$(window).resize(function () {
    apply_resize();
});

// initial page load calculation
window.onload = function () {
    apply_resize();
};

// tab switch
$(".chart-tab").click(
    function () {
        setTimeout(function () {
            apply_resize();
        }, 500);
    }
);

// social links
document.getElementById("share-facebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + window.location
    .href;
document.getElementById("share-twitter").href = "https://twitter.com/intent/tweet?status=STEM Data Story: +" +
    window.location
    .href;