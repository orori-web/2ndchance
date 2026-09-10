/* =====================================================
   MOBILE PRODUCT PAGE
   FILTER SIDEBAR INTERACTION
===================================================== */

console.log("Second Chance Store mobile product filters running");


/* =====================================================
   DOM ELEMENTS
===================================================== */

const filtersSection = document.querySelector(".filters-section");

const filterGroups = document.querySelectorAll(".filter-group");

const filterTitles = document.querySelectorAll(".filter-group-title");


/* =====================================================
   MOBILE CHECK
===================================================== */

const isMobile = () => {
    return window.matchMedia("(max-width: 600px)").matches;
};


/* =====================================================
   CLOSE ALL FILTERS
===================================================== */

const closeAllFilters = () => {

    filterGroups.forEach((group) => {
        group.classList.remove("is-open");
    });

    filtersSection?.classList.remove("is-expanded");
};


/* =====================================================
   OPEN / CLOSE FILTER
===================================================== */

const toggleFilter = (group) => {

    if (!filtersSection || !isMobile()) {
        return;
    }

    const alreadyOpen = group.classList.contains("is-open");


    /* ---------------------------------------------
       Close everything first
    --------------------------------------------- */

    closeAllFilters();


    /* ---------------------------------------------
       If it wasn't already open, open it
    --------------------------------------------- */

    if (!alreadyOpen) {

        group.classList.add("is-open");

        filtersSection.classList.add("is-expanded");
    }
};


/* =====================================================
   FILTER CLICK EVENTS
===================================================== */

filterTitles.forEach((title) => {

    title.addEventListener("click", () => {

        const group = title.closest(".filter-group");

        if (!group) {
            return;
        }

        toggleFilter(group);
    });

});


/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

filterTitles.forEach((title) => {

    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");

    title.addEventListener("keydown", (event) => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            const group = title.closest(".filter-group");

            if (!group) {
                return;
            }

            toggleFilter(group);
        }

    });

});


/* =====================================================
   RESPONSIVE RESET
===================================================== */

window.addEventListener("resize", () => {

    if (!isMobile()) {
        closeAllFilters();
    }

});