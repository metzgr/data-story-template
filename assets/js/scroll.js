(function () {
  "use strict";

  // ---
  // scroll progress bar
  // ---

  const pixelsTag = document.querySelector("div.pixels")
  const bodyTag = document.querySelector("body")
  const progressTag = document.querySelector("div.progress")
  const sections = document.querySelectorAll("section")
  const clientTag = document.querySelector("div.client")
  const pageTag = document.querySelector("div.page")
  const headerTag = document.querySelector("header")

  // when we scroll the page, update the pixels tag to be how far we've scrolled
  window.addEventListener("scroll", function () {
    const pixels = window.pageYOffset

    if (pixelsTag) {
      pixelsTag.innerHTML = pixels
    }
  })

  // when we scroll the page, make a progress bar that track of the distance
  window.addEventListener("scroll", function () {
    const pixels = window.pageYOffset
    const pageHeight = bodyTag.getBoundingClientRect().height
    const totalScrollableDistance = pageHeight - window.innerHeight

    const percentage = pixels / totalScrollableDistance

    progressTag.style.width = `${100 * percentage}%`
  })

  // when we scroll the page, see how far down the page we've scrolled
  // then for each section, check whether we've passed it and if we have...
  // then updated the text in the header
  window.addEventListener("scroll", function () {
    const pixels = window.pageYOffset

    sections.forEach(section => {
      if (section.offsetTop - 60 <= pixels) {
        if (clientTag) {
          clientTag.innerHTML = section.getAttribute("data-client")
        }
        if (pageTag) {
          pageTag.innerHTML = section.getAttribute("data-page")
        }
        if (section.hasAttribute("data-is-dark")) {
          headerTag.classList.add("white")
          progressTag.classList.add("white")
        } else {
          headerTag.classList.remove("white")
          progressTag.classList.remove("white")
        }
      }
    })
  })

  // when user scrolls the page, make things parallax
  // we want to move certain tags, based on how far they are from an anchor point
  // what is the anchor? well its the middle of the section
  // how far should we parallax? well, it's a ratio of the middle distance scrolled to the middle point of the anchor
  window.addEventListener("scroll", function () {
    const topViewport = window.pageYOffset
    const midViewport = topViewport + (window.innerHeight / 2)

    sections.forEach(section => {
      const topSection = section.offsetTop
      const midSection = topSection + (section.offsetHeight / 2)

      const distanceToSection = midViewport - midSection

      const parallaxTags = section.querySelectorAll(`[data-parallax]`)

      // loop over each parallaxed tag
      parallaxTags.forEach(tag => {
        const speed = parseFloat(tag.getAttribute("data-parallax"))
        tag.style.transform = `translate(0, ${distanceToSection * speed}px)`
      })
    })
  })

  // ---
  // shrink header when scroll
  // ---

  // When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
  let header = document.querySelector("header");
  let mainHome = document.querySelector(".main-home");
  // get a copy of the default edu title link
  let eduLinkClone = document.querySelector("div.header-content nav a").cloneNode(true);
  // create the list of nav items with a ul
  let linkList = document.createElement("ul");
  let linkText = ["WHY ALGEBRA I", "WHO HAS ACCESS & WHERE", "WHO ENROLLS & WHERE"];
  linkText.forEach(function (text, index) {
    let listItem = document.createElement("li");
    if (index === 0) {
      listItem.setAttribute('class', 'active-nav');
    }
    let listLink = document.createElement("a");
    listLink.style.lineHeight = "0px";
    listLink.setAttribute('href', "#" + text.replace(/\s/g, '').replace(/&/g, ""));
    let textNode = document.createTextNode(text);
    listLink.appendChild(textNode);
    listItem.appendChild(listLink);
    linkList.appendChild(listItem);
  });

  window.changeHeader = function () {
    // three social icons
    let socialLinks = document.querySelectorAll(".header-content .social-links");
    // the default edu title link
    let eduLink = document.querySelector(".main-home .edu-link");
    // appended list of nav items
    let linkListElem = document.querySelector(".main-home ul");

    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      socialLinks.forEach(function (elm) {
        // shrink the header (dictated by social links height)
        elm.style.lineHeight = "80px";
      });
      header.setAttribute("class", "shrinked");
      if (eduLink) {
        // if EDU link exist, remove it
        eduLink.remove();
      }
      if (!linkListElem) {
        // if list of links does not exit, append it
        mainHome.appendChild(linkList);
      }
    } else {
      // expand the header (dictated by social links height)
      socialLinks.forEach(function (elm) {
        elm.style.lineHeight = "120px";
      });
      header.setAttribute("class", "");
      if (linkListElem) {
        // if list of links exist, remove it
        linkListElem.remove();
      }
      if (!eduLink) {
        // if EDU link does not exist, append it
        mainHome.appendChild(eduLinkClone);
      }
    }
  }

  // call once on page load
  changeHeader();
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
    let yPosition = 0;

    while (element) {
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
    }

    return yPosition;
  }

  function spyOnScroll() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      for (i in sectionTopHeights) {
        if (sectionTopHeights[i] <= scrollPosition) {
          document.querySelector('.active-nav').setAttribute('class', ' ');
          document.querySelector("a[href='#" + i + "']").parentElement.setAttribute('class', 'active-nav');
        }
      }
    }
  };

  window.addEventListener('scroll', spyOnScroll);

})();