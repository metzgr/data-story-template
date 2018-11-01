(function () {
  "use strict";

  // ---
  // scroll progress bar
  // ---

  var pixelsTag = document.querySelector("div.pixels");
  var bodyTag = document.querySelector("body");
  var progressTag = document.querySelector("div.progress");
  var sections = Array.prototype.slice.call(document.querySelectorAll("section")); // IE patch
  var clientTag = document.querySelector("div.client");
  var pageTag = document.querySelector("div.page");
  var headerTag = document.querySelector("header");

  // when we scroll the page, update the pixels tag to be how far we've scrolled
  window.addEventListener("scroll", function () {
    var pixels = window.pageYOffset;

    if (pixelsTag) {
      pixelsTag.innerHTML = pixels;
    }
  });

  // when we scroll the page, make a progress bar that track of the distance
  window.addEventListener("scroll", function () {
    var pixels = window.pageYOffset;
    var pageHeight = bodyTag.getBoundingClientRect().height;
    var totalScrollableDistance = pageHeight - window.innerHeight;
    var percentage = pixels / totalScrollableDistance;

    progressTag.style.width = 100 * percentage + "%";
  });

  // when we scroll the page, see how far down the page we've scrolled
  // then for each section, check whether we've passed it and if we have...
  // then updated the text in the header
  window.addEventListener("scroll", function () {
    var pixels = window.pageYOffset;

    sections.forEach(function (section) {
      if (section.offsetTop - 60 <= pixels) {
        if (clientTag) {
          clientTag.innerHTML = section.getAttribute("data-client");
        }
        if (pageTag) {
          pageTag.innerHTML = section.getAttribute("data-page");
        }
        if (section.hasAttribute("data-is-dark")) {
          headerTag.classList.add("white");
          progressTag.classList.add("white");
        } else {
          headerTag.classList.remove("white");
          progressTag.classList.remove("white");
        }
      }
    });
  });

  // when user scrolls the page, make things parallax
  // we want to move certain tags, based on how far they are from an anchor point
  // what is the anchor? well its the middle of the section
  // how far should we parallax? well, it's a ratio of the middle distance scrolled to the middle point of the anchor
  window.addEventListener("scroll", function () {
    var topViewport = window.pageYOffset;
    var midViewport = topViewport + (window.innerHeight / 2);

    sections.forEach(function (section) {
      var topSection = section.offsetTop;
      var midSection = topSection + (section.offsetHeight / 2);
      var distanceToSection = midViewport - midSection;
      var parallaxTags = Array.prototype.slice.call(section.querySelectorAll("[data-parallax]")); // IE patch

      // loop over each parallaxed tag
      parallaxTags.forEach(function (tag) {
        var speed = parseFloat(tag.getAttribute("data-parallax"));
        tag.style.transform = "translate(0, " + distanceToSection * speed + "px)";
      });
    });
  });

  // ---
  // shrink header when scroll
  // ---

  var header = document.querySelector("header");
  var mainHome = document.querySelector(".main-home");
  // get a copy of the default edu title link
  var eduLinkClone = document.querySelector("div.header-content nav a").cloneNode(true);
  // create the list of nav items with a ul
  var linkList = document.createElement("ul");
  var hrLine = document.createElement("hr");
  var linkText = ["WHY ALGEBRA I", "WHO HAS ACCESS & WHERE", "WHO ENROLLS & WHERE"];

  linkList.appendChild(hrLine);

  linkText.forEach(function (text, index) {
    var listItem = document.createElement("li");
    var listLink = document.createElement("a");
    var textNode = document.createTextNode(text);

    if (index === 0) {
      listItem.setAttribute('class', 'active-nav');
    } else {
      listItem.setAttribute('class', 'not-active-nav');
    }
    listLink.style.lineHeight = "0px";
    listLink.setAttribute('href', "#" + text.replace(/\s/g, '').replace(/&/g, ""));
    listLink.appendChild(textNode);
    listItem.appendChild(listLink);
    linkList.appendChild(listItem);
  });

  // IE polifill
  // Create Element.remove() function if not exist
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  function changeHeader() {
    // three social icons
    var socialLinks = Array.prototype.slice.call(document.querySelectorAll(".header-content .social-links")); // IE patch
    // the default edu title link
    var eduLink = document.querySelector(".main-home .edu-link");
    // appended list of nav items
    var linkListElem = document.querySelector(".main-home ul");

    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      socialLinks.forEach(function (elm) {
        // shrink the header (dictated by social links height)
        elm.style.lineHeight = "65px";
      });
      header.setAttribute("class", "shrinked");

      // if EDU link exist, remove it
      eduLink ? eduLink.remove() : null;
      // if list of links does not exit, append it
      !linkListElem ? mainHome.appendChild(linkList) : null;
    } else {
      socialLinks.forEach(function (elm) {
        // expand the header (dictated by social links height)
        elm.style.lineHeight = "120px";
      });
      header.setAttribute("class", "");

      // if list of links exist, remove it
      linkListElem ? linkListElem.remove() : null;
      // if EDU link does not exist, append it
      !eduLink ? mainHome.appendChild(eduLinkClone) : null;
    }
  }

  window.addEventListener('scroll', changeHeader);


  // ---
  // scroll spy
  // ---

  var sectionClasses = document.querySelectorAll(".section");
  var sectionTopHeights = {};
  var i = 0;

  Array.prototype.forEach.call(sectionClasses, function (e) {
    sectionTopHeights[e.id] = getPosition(e);
  });

  function getPosition(element) {
    var yPosition = 0;

    while (element) {
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
    }

    return yPosition;
  }

  function spyOnScroll() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      for (i in sectionTopHeights) {
        if (sectionTopHeights[i] <= scrollPosition) {

          if (document.querySelector('.active-nav')) {
            document.querySelector('.active-nav').setAttribute('class', 'not-active-nav');
          }
          if (document.querySelector("a[href='#" + i + "']")) {
            document.querySelector("a[href='#" + i + "']").parentElement.setAttribute('class', 'active-nav');
          }

          // might improve on this to make it more scalable
          switch (i) {
            case "WHOHASACCESSWHERE":
              hrLine.setAttribute('class', 'onWHOHASACCESSWHERE')
              break;
            case "WHOENROLLSWHERE":
              hrLine.setAttribute('class', 'onWHOENROLLSWHERE');
              break;
            default:
              hrLine.setAttribute('class', 'onWHYALGEBRAI');
          }
        }
      }
    }
  }

  window.addEventListener('scroll', spyOnScroll);

})();