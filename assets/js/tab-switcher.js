// switch tabs for chart containers
// adapted from https://rudrastyh.com/javascript/tabs.html

(function () {
    "use strict";

    window.TabSwitcher = function (tab_id, tab_content, content_class, tab_class) {
        // first of all we get all tab content blocks (I think the best way to get them by class names)
        let all_content = document.getElementsByClassName(content_class);
        let i;
        for (i = 0; i < all_content.length; i++) {
            all_content[i].style.display = 'none'; // hide all tab content
        }
        document.getElementById(tab_content).style.display = 'block'; // display the content of the tab we need

        // now we get all tab menu items by class names (use the next code only if you need to highlight current tab)
        let all_tab = document.getElementsByClassName(tab_class);
        let j;
        for (j = 0; j < all_tab.length; j++) {
            all_tab[j].className = tab_class;
        }
        document.getElementById(tab_id).className = tab_class + ' active';
    };
})();
