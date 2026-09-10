/* =====================================================
   MOBILE HOUSES PAGE
   FILTER SIDEBAR INTERACTION
===================================================== */

console.log("Second Chance Store mobile house filters running");


/* =====================================================
   DOM ELEMENTS
===================================================== */

const housesSidebar =
    document.querySelector(".houses-sidebar");

const houseFilterGroups =
    document.querySelectorAll(".house-filter-group");

const houseFilterLabels =
    document.querySelectorAll(".house-filter-group > label");


/* =====================================================
   MOBILE CHECK
===================================================== */

const isMobile = () => {
    return window.matchMedia("(max-width: 600px)").matches;
};


/* =====================================================
   CLOSE ALL FILTERS
===================================================== */

const closeAllHouseFilters = () => {

    houseFilterGroups.forEach((group) => {
        group.classList.remove("is-open");
    });

    housesSidebar?.classList.remove("is-expanded");
};


/* =====================================================
   OPEN / CLOSE FILTER
===================================================== */

const toggleHouseFilter = (group) => {

    if (!housesSidebar || !isMobile()) {
        return;
    }

    const alreadyOpen =
        group.classList.contains("is-open");


    /* ---------------------------------------------
       Close everything first
    --------------------------------------------- */

    closeAllHouseFilters();


    /* ---------------------------------------------
       If it wasn't already open, open it
    --------------------------------------------- */

    if (!alreadyOpen) {

        group.classList.add("is-open");

        housesSidebar.classList.add("is-expanded");
    }
};


/* =====================================================
   FILTER CLICK EVENTS
===================================================== */

houseFilterLabels.forEach((label) => {

    label.addEventListener("click", () => {

        const group =
            label.closest(".house-filter-group");

        if (!group) {
            return;
        }

        toggleHouseFilter(group);
    });

});


/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

houseFilterLabels.forEach((label) => {

    label.setAttribute("role", "button");
    label.setAttribute("tabindex", "0");

    label.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            const group =
                label.closest(".house-filter-group");

            if (!group) {
                return;
            }

            toggleHouseFilter(group);
        }

    });

});


/* =====================================================
   RESPONSIVE RESET
===================================================== */

window.addEventListener("resize", () => {

    if (!isMobile()) {
        closeAllHouseFilters();
    }

});