import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin houses page running");


// ==========================================
// DOM ELEMENTS
// ==========================================

const housesContainer =
    document.getElementById("houses-container");

const searchInput =
    document.getElementById("house-search");

const searchButton =
    document.getElementById("search-button");

const refreshButton =
    document.getElementById("refresh-button");

const availabilityFilter =
    document.getElementById("availability-filter");

const houseTypeFilter =
    document.getElementById("house-type-filter");

const areaFilter =
    document.getElementById("area-filter");

const filterButton =
    document.getElementById("filter-button");

const message =
    document.getElementById("houses-message");


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const checkAdminAccess = async () => {

    try {

        const user =
            await getCurrentUser();

        if (!user) {

            window.location.href =
                "../home.html";

            return false;

        }

        if (user.role !== "admin") {

            alert(
                "Admin access only."
            );

            window.location.href =
                "../home.html";

            return false;

        }

        return true;

    } catch (error) {

        console.error(
            "Admin authentication failed:",
            error
        );

        window.location.href =
            "../home.html";

        return false;

    }

};


// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    text,
    isError = false
) => {

    message.textContent =
        text;

    message.style.color =
        isError
            ? "red"
            : "green";

};


// ==========================================
// LOAD HOUSES
// ==========================================

const loadHouses = async () => {

    try {

        showMessage(
            "Loading houses..."
        );

        housesContainer.innerHTML =
            "";

        const params =
            new URLSearchParams();


        // Search

        const search =
            searchInput.value.trim();

        if (search) {

            params.append(
                "search",
                search
            );

        }


        // Availability

        const availability =
            availabilityFilter.value;

        if (availability) {

            params.append(
                "availabilityStatus",
                availability
            );

        }


        // House type

        const houseType =
            houseTypeFilter.value;

        if (houseType) {

            params.append(
                "houseType",
                houseType
            );

        }


        // Area

        const area =
            areaFilter.value.trim();

        if (area) {

            params.append(
                "area",
                area
            );

        }


        const query =
            params.toString();


        const endpoint =
            query
                ? `/api/admin/houses?${query}`
                : "/api/admin/houses";


        const data =
            await apiFetch(
                endpoint
            );


        console.log(
            "Admin houses response:",
            data
        );


        const houses =
            data.houses || [];


        renderHouses(
            houses
        );


        showMessage(
            `${houses.length} house(s) loaded.`
        );


    } catch (error) {

        console.error(
            "Failed to load houses:",
            error
        );

        showMessage(
            error.message ||
            "Failed to load houses.",
            true
        );

    }

};



// ==========================================
// RENDER HOUSES
// ==========================================

const renderHouses = (houses) => {

    housesContainer.innerHTML = "";

    if (!houses.length) {

        housesContainer.innerHTML = `
            <div class="admin-houses-empty">

                <span class="material-symbols-outlined">
                    home_work
                </span>

                <h3>
                    No houses found
                </h3>

                <p>
                    There are no house listings matching your search or filters.
                </p>

            </div>
        `;

        return;
    }


    const grid =
        document.createElement("div");

    grid.className =
        "admin-houses-grid";


    houses.forEach((house) => {

        const houseElement =
            document.createElement("article");

        houseElement.className =
            "admin-house-card";

        houseElement.dataset.id =
            house._id;


        // ==================================
        // DATA
        // ==================================

        const image =
            house.images?.[0]?.url || "";

        const title =
            house.title ||
            "Untitled House";

        const houseCode =
            house.houseCode ||
            "N/A";

        const houseType =
            house.houseType ||
            "N/A";

        const area =
            house.area ||
            "N/A";

        const availability =
            house.availabilityStatus ||
            "Unknown";

        const rent =
            Number(
                house.rent || 0
            ).toLocaleString();

        const deposit =
            Number(
                house.deposit || 0
            ).toLocaleString();

        const caretaker =
            house.caretakerName ||
            "N/A";

        const caretakerPhone =
            house.caretakerPhone ||
            "N/A";

        const distance =
            house.distanceFromCampus ||
            "N/A";


        const isActive =
            house.isActive;


        // ==================================
        // STATUS CLASSES
        // ==================================

        const availabilityClass =
            availability
                .toLowerCase()
                .replace(/\s+/g, "-");


        const activeClass =
            isActive
                ? "active"
                : "inactive";


        // ==================================
        // CARD
        // ==================================

        houseElement.innerHTML = `

            <!-- ==================================
                 IMAGE
            ================================== -->

            <div class="admin-house-image">

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                alt="${title}"
                                loading="lazy"
                            >
                        `
                        : `
                            <div class="admin-house-no-image">

                                <span class="material-symbols-outlined">
                                    home_work
                                </span>

                                <span>
                                    No image
                                </span>

                            </div>
                        `
                }


                <!-- AVAILABILITY -->

                <span
                    class="
                        admin-house-availability
                        ${availabilityClass}
                    "
                >

                    ${availability}

                </span>


                <!-- ACTIVE STATUS -->

                <span
                    class="
                        admin-house-active
                        ${activeClass}
                    "
                >

                    ${
                        isActive
                            ? "ACTIVE"
                            : "INACTIVE"
                    }

                </span>

            </div>


            <!-- ==================================
                 BODY
            ================================== -->

            <div class="admin-house-body">


                <!-- TITLE -->

                <div class="admin-house-heading">

                    <div>

                        <h3>
                            ${title}
                        </h3>

                        <span class="admin-house-code">

                            ${houseCode}

                        </span>

                    </div>

                </div>


                <!-- ==================================
                     RENT
                ================================== -->

                <div class="admin-house-price">

                    <span>
                        KSh
                    </span>

                    ${rent}

                    <small>
                        / month
                    </small>

                </div>


                <!-- ==================================
                     DETAILS
                ================================== -->

                <div class="admin-house-details">


                    <!-- TYPE -->

                    <div class="admin-house-detail">

                        <span class="material-symbols-outlined">
                            apartment
                        </span>

                        <div>

                            <small>
                                House Type
                            </small>

                            <strong>
                                ${houseType}
                            </strong>

                        </div>

                    </div>


                    <!-- AREA -->

                    <div class="admin-house-detail">

                        <span class="material-symbols-outlined">
                            location_on
                        </span>

                        <div>

                            <small>
                                Area
                            </small>

                            <strong>
                                ${area}
                            </strong>

                        </div>

                    </div>


                    <!-- DEPOSIT -->

                    <div class="admin-house-detail">

                        <span class="material-symbols-outlined">
                            payments
                        </span>

                        <div>

                            <small>
                                Deposit
                            </small>

                            <strong>
                                KSh ${deposit}
                            </strong>

                        </div>

                    </div>


                    <!-- DISTANCE -->

                    <div class="admin-house-detail">

                        <span class="material-symbols-outlined">
                            directions_walk
                        </span>

                        <div>

                            <small>
                                From Campus
                            </small>

                            <strong>
                                ${distance}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ==================================
                     CARETAKER
                ================================== -->

                <div class="admin-house-caretaker">

                    <div class="admin-house-caretaker-icon">

                        <span class="material-symbols-outlined">
                            person
                        </span>

                    </div>


                    <div>

                        <small>
                            Caretaker
                        </small>

                        <strong>
                            ${caretaker}
                        </strong>

                        <span>
                            ${caretakerPhone}
                        </span>

                    </div>

                </div>

            </div>


            <!-- ==================================
                 ACTIONS
            ================================== -->

            <div class="admin-house-actions">


                <!-- VIEW -->

                <button
                    type="button"
                    class="view-house-button"
                    data-id="${house._id}"
                >

                    <span class="material-symbols-outlined">
                        visibility
                    </span>

                    View

                </button>


                <!-- EDIT -->

                <button
                    type="button"
                    class="edit-house-button"
                    data-id="${house._id}"
                >

                    <span class="material-symbols-outlined">
                        edit
                    </span>

                    Edit

                </button>


                <!-- AVAILABILITY -->

                <button
                    type="button"
                    class="availability-house-button"
                    data-id="${house._id}"
                >

                    <span class="material-symbols-outlined">
                        sync
                    </span>

                    Availability

                </button>


                <!-- DEACTIVATE -->

                <button
                    type="button"
                    class="delete-house-button"
                    data-id="${house._id}"
                >

                    <span class="material-symbols-outlined">
                        ${
                            isActive
                                ? "visibility_off"
                                : "visibility"
                        }
                    </span>

                    ${
                        isActive
                            ? "Deactivate"
                            : "Activate"
                    }

                </button>

            </div>

        `;


        grid.appendChild(
            houseElement
        );

    });


    housesContainer.appendChild(
        grid
    );

};




// ==========================================
// VIEW HOUSE
// ==========================================

const viewHouse = (
    houseId
) => {

    console.log(
        "View house:",
        houseId
    );


    /*
        We'll connect this to the
        public house detail page
        once that page exists.
    */

    window.location.href =
        `house-detail.html?id=${houseId}`;

};


// ==========================================
// EDIT HOUSE
// ==========================================

const editHouse = (
    houseId
) => {

    console.log(
        "Edit house:",
        houseId
    );


    window.location.href =
        `house-edit.html?id=${houseId}`;

};


// ==========================================
// CHANGE AVAILABILITY
// ==========================================

const changeAvailability = async (
    houseId
) => {

    const status =
        prompt(
            "Enter availability:\nAvailable\nOccupied\nUnknown"
        );


    if (!status) {

        return;

    }


    const allowedStatuses = [
        "Available",
        "Occupied",
        "Unknown"
    ];


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        alert(
            "Invalid availability status."
        );

        return;

    }


    try {

        showMessage(
            "Updating availability..."
        );


        const data =
            await apiFetch(
                `/api/admin/houses/${houseId}/availability`,
                {
                    method: "PATCH",

                    body: JSON.stringify({
                        availabilityStatus:
                            status
                    })
                }
            );


        console.log(
            "Availability update:",
            data
        );


        showMessage(
            data.message ||
            "Availability updated."
        );


        await loadHouses();


    } catch (error) {

        console.error(
            "Failed to update availability:",
            error
        );


        showMessage(
            error.message ||
            "Failed to update availability.",
            true
        );

    }

};


// ==========================================
// DELETE / DEACTIVATE HOUSE
// ==========================================

const deactivateHouse = async (
    houseId
) => {

    const confirmation =
        confirm(
            "Deactivate this house listing?"
        );


    if (!confirmation) {

        return;

    }


    try {

        showMessage(
            "Deactivating house..."
        );


        const data =
            await apiFetch(
                `/api/admin/houses/${houseId}`,
                {
                    method: "DELETE"
                }
            );


        console.log(
            "Deactivate house response:",
            data
        );


        showMessage(
            data.message ||
            "House listing deactivated."
        );


        await loadHouses();


    } catch (error) {

        console.error(
            "Failed to deactivate house:",
            error
        );


        showMessage(
            error.message ||
            "Failed to deactivate house.",
            true
        );

    }

};


// ==========================================
// BUTTON EVENTS
// ==========================================

housesContainer.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {

            return;

        }


        const houseId =
            button.dataset.id;


        // VIEW

        if (
            button.classList.contains(
                "view-house-button"
            )
        ) {

            viewHouse(
                houseId
            );

            return;

        }


        // EDIT

        if (
            button.classList.contains(
                "edit-house-button"
            )
        ) {

            editHouse(
                houseId
            );

            return;

        }


        // AVAILABILITY

        if (
            button.classList.contains(
                "availability-house-button"
            )
        ) {

            await changeAvailability(
                houseId
            );

            return;

        }


        // DEACTIVATE

        if (
            button.classList.contains(
                "delete-house-button"
            )
        ) {

            await deactivateHouse(
                houseId
            );

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

searchButton.addEventListener(
    "click",
    loadHouses
);


searchInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            loadHouses();

        }

    }
);


// ==========================================
// FILTER
// ==========================================

filterButton.addEventListener(
    "click",
    loadHouses
);


// ==========================================
// REFRESH
// ==========================================

refreshButton.addEventListener(
    "click",
    loadHouses
);


// ==========================================
// INITIALIZE
// ==========================================

const initialize = async () => {

    const allowed =
        await checkAdminAccess();


    if (!allowed) {

        return;

    }


    await loadHouses();

};


initialize();