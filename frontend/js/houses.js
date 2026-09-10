import { apiFetch } from "./api.js";

import { renderBreadcrumb } from "./breadcrumb.js";

renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "Housing"
    }
]);

console.log("Public houses page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const housesContainer =
    document.getElementById("houses-container");

const message =
    document.getElementById("houses-message");

const searchInput =
    document.getElementById("house-search");

const houseTypeSelect =
    document.getElementById("house-type");

const areaInput =
    document.getElementById("house-area");

const minRentInput =
    document.getElementById("min-rent");

const maxRentInput =
    document.getElementById("max-rent");

const sortSelect =
    document.getElementById("house-sort");

const searchButton =
    document.getElementById("search-houses-button");

const resetButton =
    document.getElementById("reset-houses-button");

const modal =
    document.getElementById("house-modal");

const modalContent =
    document.getElementById("house-modal-content");

const closeModalButton =
    document.getElementById("close-house-modal");






    // ==========================================
// HOUSE HEADER SEARCH
// ==========================================

document.addEventListener(
    "houseHeaderSearch",
    (event) => {

        const search =
            event.detail?.search || "";

        if (searchInput) {

            searchInput.value =
                search;

        }

        loadHouses(1);

    }
);





// ==========================================
// STATE
// ==========================================

let currentPage = 1;
const limit = 20;


// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    text,
    isError = false
) => {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.style.color =
        isError
            ? "red"
            : "green";
};


// ==========================================
// LOAD HOUSES
// ==========================================

const loadHouses = async (
    page = 1
) => {

    try {

        showMessage("Loading houses...");

        housesContainer.innerHTML = "";

        currentPage = page;

        const params =
            new URLSearchParams();

        params.set(
            "page",
            currentPage
        );

        params.set(
            "limit",
            limit
        );


        // ==================================
        // SEARCH
        // ==================================

        const search =
            searchInput?.value.trim();

        if (search) {

            params.set(
                "search",
                search
            );

        }


        // ==================================
        // HOUSE TYPE
        // ==================================

        const houseType =
            houseTypeSelect?.value;

        if (houseType) {

            params.set(
                "houseType",
                houseType
            );

        }


        // ==================================
        // AREA
        // ==================================

        const area =
            areaInput?.value.trim();

        if (area) {

            params.set(
                "area",
                area
            );

        }


        // ==================================
        // MIN RENT
        // ==================================

        const minRent =
            minRentInput?.value;

        if (minRent) {

            params.set(
                "minRent",
                minRent
            );

        }


        // ==================================
        // MAX RENT
        // ==================================

        const maxRent =
            maxRentInput?.value;

        if (maxRent) {

            params.set(
                "maxRent",
                maxRent
            );

        }


        // ==================================
        // SORT
        // ==================================

        const sort =
            sortSelect?.value;

        if (sort) {

            params.set(
                "sort",
                sort
            );

        }


        // ==================================
        // GET HOUSES
        // ==================================

        const data =
            await apiFetch(
                `/api/houses?${params.toString()}`
            );

        console.log(
            "Public houses response:",
            data
        );


        const houses =
            data.houses || [];


        renderHouses(
            houses
        );


        renderPagination(
            data.pagination
        );


        showMessage(
            `${data.pagination?.total || houses.length} house(s) found.`
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

const renderHouses = (
    houses
) => {

    housesContainer.innerHTML = "";


    if (!houses.length) {

        housesContainer.innerHTML = `
            <p class="no-houses-message">
                No houses found.
            </p>
        `;

        return;
    }


    houses.forEach(
        (house) => {

            const houseElement =
                document.createElement(
                    "article"
                );

            houseElement.className =
                "house-card";


            // ==================================
            // IMAGE
            // ==================================

            const image =
                house.images?.[0]?.url ||
                "";


            // ==================================
            // HOUSE TYPE
            // ==================================

            const houseType =
                house.houseType ||
                "House";


            // ==================================
            // RENT
            // ==================================

            const rent =
                Number(
                    house.rent
                ).toLocaleString();


            // ==================================
            // LOCATION
            // ==================================

            const location =
                house.area ||
                "Location not specified";


            // ==================================
            // HOUSE CARD
            // ==================================

            houseElement.innerHTML = `

                <div class="house-card-image">

                    ${
                        image
                            ? `
                                <img
                                    src="${image}"
                                    alt="${house.title || "House"}"
                                >
                            `
                            : `
                                <div class="house-no-image">
                                    No image available
                                </div>
                            `
                    }

                </div>


                <div class="house-card-content">

                    <p class="house-card-type">
                        ${houseType}
                    </p>


                    <p class="house-card-rent">

                        KSh ${rent}

                        <span>
                            / month
                        </span>

                    </p>


                    <p class="house-card-location">

                        <span class="material-symbols-outlined">
                            location_on
                        </span>

                        ${location}

                    </p>


                    <button
                        type="button"
                        class="house-interest-button"
                        data-house-id="${house._id}"
                    >
                        I'm Interested
                    </button>

                </div>

            `;


            // ==================================
            // OPEN MODAL WHEN CARD IS CLICKED
            // ==================================

            houseElement.addEventListener(
                "click",
                () => {

                    openHouseModal(
                        house._id
                    );

                }
            );


            housesContainer.appendChild(
                houseElement
            );

        }
    );

};


// ==========================================
// PAGINATION
// ==========================================

const renderPagination = (
    pagination
) => {

    if (!pagination) {
        return;
    }


    const existing =
        document.getElementById(
            "houses-pagination"
        );


    if (existing) {
        existing.remove();
    }


    if (
        pagination.totalPages <= 1
    ) {

        return;

    }


    const paginationElement =
        document.createElement(
            "div"
        );


    paginationElement.id =
        "houses-pagination";


    paginationElement.innerHTML = `

        <hr>

        <button
            type="button"
            id="previous-houses-page"
            ${
                pagination.page <= 1
                    ? "disabled"
                    : ""
            }
        >
            Previous
        </button>


        <span>

            Page
            ${pagination.page}
            of
            ${pagination.totalPages}

        </span>


        <button
            type="button"
            id="next-houses-page"
            ${
                pagination.page >=
                pagination.totalPages
                    ? "disabled"
                    : ""
            }
        >
            Next
        </button>

    `;


    housesContainer.appendChild(
        paginationElement
    );


    // ==================================
    // PREVIOUS
    // ==================================

    document
        .getElementById(
            "previous-houses-page"
        )
        ?.addEventListener(
            "click",
            () => {

                loadHouses(
                    pagination.page - 1
                );

            }
        );


    // ==================================
    // NEXT
    // ==================================

    document
        .getElementById(
            "next-houses-page"
        )
        ?.addEventListener(
            "click",
            () => {

                loadHouses(
                    pagination.page + 1
                );

            }
        );

};


// ==========================================
// OPEN HOUSE MODAL
// ==========================================

const openHouseModal = async (
    houseId
) => {

    try {

        modal.hidden = false;

        modalContent.innerHTML = `
            <p>
                Loading house details...
            </p>
        `;


        const data =
            await apiFetch(
                `/api/houses/${houseId}`
            );


        const house =
            data.house;


        if (!house) {

            throw new Error(
                "House details not found."
            );

        }


        renderHouseModal(
            house
        );


    } catch (error) {

        console.error(
            "Failed to load house details:",
            error
        );


        modalContent.innerHTML = `

            <div class="house-modal-error">

                <p>
                    ${
                        error.message ||
                        "Failed to load house details."
                    }
                </p>

            </div>

        `;

    }

};



// ==========================================
// HOUSE IMAGE GALLERY
// ==========================================

const setupHouseImageGallery = () => {

    const mainImage =
        modalContent.querySelector(
            "#house-main-image"
        );


    const thumbnails =
        modalContent.querySelectorAll(
            ".house-image-thumbnail"
        );


    if (
        !mainImage ||
        !thumbnails.length
    ) {

        return;

    }


    thumbnails.forEach(
        (thumbnail) => {

            thumbnail.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    const imageUrl =
                        thumbnail.dataset.image;


                    if (!imageUrl) {

                        return;

                    }


                    // ==================================
                    // CHANGE MAIN IMAGE
                    // ==================================

                    mainImage.src =
                        imageUrl;


                    // ==================================
                    // REMOVE ACTIVE STATE
                    // ==================================

                    thumbnails.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    // ==================================
                    // ACTIVATE SELECTED THUMBNAIL
                    // ==================================

                    thumbnail.classList.add(
                        "active"
                    );

                }
            );

        }
    );

};



// ==========================================
// RENDER HOUSE MODAL
// ==========================================

const renderHouseModal = (
    house
) => {

    const images =
        Array.isArray(house.images)
            ? house.images
            : [];



    // ==========================================
    // IMAGE GALLERY
    // ==========================================

    const imageGallery =
        document.createElement(
            "div"
        );


    imageGallery.className =
        "house-image-gallery";


    // ==========================================
    // MAIN IMAGE CONTAINER
    // ==========================================

    const mainImageContainer =
        document.createElement(
            "div"
        );


    mainImageContainer.className =
        "house-main-image-container";


    // ==========================================
    // MAIN IMAGE
    // ==========================================

    if (images.length) {

        const mainImage =
            document.createElement(
                "img"
            );


        mainImage.id =
            "house-main-image";


        mainImage.className =
            "house-main-image";


        mainImage.src =
            images[0].url;


        mainImage.alt =
            house.title ||
            house.houseType ||
            "House";


        mainImageContainer.appendChild(
            mainImage
        );

    } else {

        const noImage =
            document.createElement(
                "div"
            );


        noImage.className =
            "house-no-image";


        noImage.textContent =
            "No images available";


        mainImageContainer.appendChild(
            noImage
        );

    }


    imageGallery.appendChild(
        mainImageContainer
    );



    // ==========================================
    // THUMBNAILS
    // ==========================================

    if (
        images.length > 1
    ) {

        const thumbnailsContainer =
            document.createElement(
                "div"
            );


        thumbnailsContainer.className =
            "house-image-thumbnails";


        images.forEach(
            (
                image,
                index
            ) => {

                const thumbnailButton =
                    document.createElement(
                        "button"
                    );


                thumbnailButton.type =
                    "button";


                thumbnailButton.className =
                    "house-image-thumbnail";


                thumbnailButton.dataset.image =
                    image.url;


                thumbnailButton.setAttribute(
                    "aria-label",
                    `View house image ${index + 1}`
                );


                if (
                    index === 0
                ) {

                    thumbnailButton.classList.add(
                        "active"
                    );

                }


                const thumbnailImage =
                    document.createElement(
                        "img"
                    );


                thumbnailImage.src =
                    image.url;


                thumbnailImage.alt =
                    `${
                        house.title ||
                        house.houseType ||
                        "House"
                    } image ${index + 1}`;


                thumbnailButton.appendChild(
                    thumbnailImage
                );


                thumbnailsContainer.appendChild(
                    thumbnailButton
                );

            }
        );


        imageGallery.appendChild(
            thumbnailsContainer
        );

    }



    // ==========================================
    // DETAILS CONTAINER
    // ==========================================

    const detailsContainer =
        document.createElement(
            "div"
        );


    detailsContainer.className =
        "house-modal-details";



    // ==========================================
    // PRIMARY DETAILS
    // ==========================================

    const primaryDetails =
        document.createElement(
            "div"
        );


    primaryDetails.className =
        "house-primary-details";



    // ==========================================
    // TITLE
    // ==========================================

    const title =
        document.createElement(
            "h2"
        );


    title.textContent =
        house.title ||
        house.houseType ||
        "House";


    primaryDetails.appendChild(
        title
    );



    // ==========================================
    // RENT
    // ==========================================

    const rent =
        document.createElement(
            "p"
        );


    rent.className =
        "house-modal-rent";


    rent.innerHTML = `

        KSh ${
            Number(
                house.rent
            ).toLocaleString()
        }

        <span>
            / month
        </span>

    `;


    primaryDetails.appendChild(
        rent
    );



    // ==========================================
    // HOUSE INFORMATION GRID
    // ==========================================

    const houseInfo =
        document.createElement(
            "div"
        );


    houseInfo.className =
        "house-info-grid";



    // ==========================================
    // HELPER — CREATE INFO BOX
    // ==========================================

    const createInfoBox = (
        label,
        value
    ) => {

        const element =
            document.createElement(
                "p"
            );


        element.className =
            "house-modal-info";


        element.textContent =
            `${label}: ${value}`;


        return element;

    };



    // ==========================================
    // HOUSE CODE
    // ==========================================

    houseInfo.appendChild(
        createInfoBox(
            "House Code",
            house.houseCode || "N/A"
        )
    );



    // ==========================================
    // HOUSE TYPE
    // ==========================================

    houseInfo.appendChild(
        createInfoBox(
            "Type",
            house.houseType || "N/A"
        )
    );



    // ==========================================
    // DEPOSIT
    // ==========================================

    houseInfo.appendChild(
        createInfoBox(
            "Deposit",
            `KSh ${
                Number(
                    house.deposit || 0
                ).toLocaleString()
            }`
        )
    );



    // ==========================================
    // AVAILABILITY
    // ==========================================

    houseInfo.appendChild(
        createInfoBox(
            "Availability",
            house.availabilityStatus ||
            "Not specified"
        )
    );



    // ==========================================
    // VERIFIED
    // ==========================================

    if (
        house.isVerified
    ) {

        const verified =
            document.createElement(
                "p"
            );


        verified.className =
            "house-modal-verified";


        verified.innerHTML = `

            <span class="material-symbols-outlined">
                verified
            </span>

            Verified Listing

        `;


        houseInfo.appendChild(
            verified
        );

    }



    primaryDetails.appendChild(
        houseInfo
    );



    // ==========================================
    // DESCRIPTION SECTION
    // ==========================================

    const descriptionSection =
        document.createElement(
            "section"
        );


    descriptionSection.className =
        "house-modal-section";



    const descriptionTitle =
        document.createElement(
            "h3"
        );


    descriptionTitle.className =
        "house-modal-section-title";


    descriptionTitle.textContent =
        "Description";


    descriptionSection.appendChild(
        descriptionTitle
    );



    const descriptionText =
        document.createElement(
            "p"
        );


    descriptionText.className =
        "house-modal-section-text";


    descriptionText.textContent =
        house.description ||
        "No description available.";


    descriptionSection.appendChild(
        descriptionText
    );



    // ==========================================
    // LOCATION SECTION
    // ==========================================

    const locationSection =
        document.createElement(
            "section"
        );


    locationSection.className =
        "house-modal-section";



    const locationTitle =
        document.createElement(
            "h3"
        );


    locationTitle.className =
        "house-modal-section-title";


    locationTitle.textContent =
        "Location";


    locationSection.appendChild(
        locationTitle
    );



    const locationGrid =
        document.createElement(
            "div"
        );


    locationGrid.className =
        "house-info-grid";



    locationGrid.appendChild(
        createInfoBox(
            "Area",
            house.area ||
            "Not specified"
        )
    );


    locationGrid.appendChild(
        createInfoBox(
            "Landmark",
            house.landmark ||
            "Not specified"
        )
    );


    locationGrid.appendChild(
        createInfoBox(
            "Campus Distance",
            house.distanceFromCampus ||
            "Not specified"
        )
    );


    locationSection.appendChild(
        locationGrid
    );



    // ==========================================
    // EXACT LOCATION
    // ==========================================

    if (
        house.exactLocation
    ) {

        const exactLocation =
            document.createElement(
                "p"
            );


        exactLocation.className =
            "house-modal-detail";


        exactLocation.textContent =
            house.exactLocation;


        locationSection.appendChild(
            exactLocation
        );

    }



    // ==========================================
    // FEATURES SECTION
    // ==========================================

    const featuresSection =
        document.createElement(
            "section"
        );


    featuresSection.className =
        "house-modal-section";



    const featuresTitle =
        document.createElement(
            "h3"
        );


    featuresTitle.className =
        "house-modal-section-title";


    featuresTitle.textContent =
        "Features";


    featuresSection.appendChild(
        featuresTitle
    );



    const featuresGrid =
        document.createElement(
            "div"
        );


    featuresGrid.className =
        "house-info-grid";



    // ==========================================
    // BATHROOM
    // ==========================================

    featuresGrid.appendChild(
        createInfoBox(
            "Bathroom",
            house.bathroomType ||
            "Not specified"
        )
    );



    // ==========================================
    // WATER
    // ==========================================

    featuresGrid.appendChild(
        createInfoBox(
            "Water",
            house.waterAvailability ||
            "Not specified"
        )
    );



    // ==========================================
    // ELECTRICITY
    // ==========================================

    featuresGrid.appendChild(
        createInfoBox(
            "Electricity",
            house.electricityType ||
            "Not specified"
        )
    );



    // ==========================================
    // PARKING
    // ==========================================

    featuresGrid.appendChild(
        createInfoBox(
            "Parking",
            house.parkingAvailable
                ? "Available"
                : "Not available"
        )
    );



    // ==========================================
    // SECURITY
    // ==========================================

    if (
        house.securityFeatures
    ) {

        featuresGrid.appendChild(
            createInfoBox(
                "Security",
                house.securityFeatures
            )
        );

    }



    featuresSection.appendChild(
        featuresGrid
    );



    // ==========================================
    // WHATSAPP BUTTON
    // ==========================================

    const whatsappButton =
        document.createElement(
            "button"
        );


    whatsappButton.type =
        "button";


    whatsappButton.id =
        "whatsapp-house-button";


    whatsappButton.innerHTML = `

        <span class="material-symbols-outlined">
            chat
        </span>

        I'm Interested

    `;



    // ==========================================
    // BUILD DETAILS
    // ==========================================

    detailsContainer.appendChild(
        primaryDetails
    );


    detailsContainer.appendChild(
        descriptionSection
    );


    detailsContainer.appendChild(
        locationSection
    );


    detailsContainer.appendChild(
        featuresSection
    );


    detailsContainer.appendChild(
        whatsappButton
    );



    // ==========================================
    // BUILD MODAL BODY
    // ==========================================

    modalContent.innerHTML = "";


    modalContent.appendChild(
        imageGallery
    );


    modalContent.appendChild(
        detailsContainer
    );



    // ==========================================
    // SETUP IMAGE GALLERY
    // ==========================================

    setupHouseImageGallery();



    // ==========================================
    // SETUP WHATSAPP
    // ==========================================

    setupHouseWhatsAppButton(
        house
    );

};


// ==========================================
// WHATSAPP — HOUSE INQUIRY
// ==========================================

const setupHouseWhatsAppButton = (
    house
) => {

    const whatsappButton =
        document.getElementById(
            "whatsapp-house-button"
        );


    if (!whatsappButton) {

        return;

    }


    whatsappButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();


            const text =
                `Hi, I'm interested in house ${house.houseCode || ""} - ${house.title || ""} in ${house.area || ""}.`;


            const encodedMessage =
                encodeURIComponent(
                    text
                );


            const whatsappUrl =
                `https://wa.me/254710988812?text=${encodedMessage}`;


            window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

};


// ==========================================
// HOUSE CARD — WHATSAPP BUTTON
// ==========================================

housesContainer.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".house-interest-button"
            );


        if (!button) {

            return;

        }


        // Prevent the card click
        // from opening the modal

        event.preventDefault();

        event.stopPropagation();


        const houseId =
            button.dataset.houseId;


        const text =
            `Hi, I'm interested in house ${houseId}.`;


        const encodedMessage =
            encodeURIComponent(
                text
            );


        const whatsappUrl =
            `https://wa.me/254710988812?text=${encodedMessage}`;


        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


// ==========================================
// CLOSE MODAL
// ==========================================

const closeHouseModal = () => {

    modal.hidden = true;

    modalContent.innerHTML = "";

};


closeModalButton?.addEventListener(
    "click",
    closeHouseModal
);


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

modal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modal
        ) {

            closeHouseModal();

        }

    }
);


// ==========================================
// CLOSE MODAL WITH ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {

            closeHouseModal();

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

searchButton?.addEventListener(
    "click",
    () => {

        loadHouses(1);

    }
);


// ==========================================
// SEARCH WITH ENTER
// ==========================================

searchInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            loadHouses(1);

        }

    }
);


// ==========================================
// RESET
// ==========================================

resetButton?.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        houseTypeSelect.value = "";

        areaInput.value = "";

        minRentInput.value = "";

        maxRentInput.value = "";

        sortSelect.value = "latest";


        loadHouses(1);

    }
);



// ==========================================
// SYNC HOUSE SEARCH WITH HEADER
// ==========================================

document.addEventListener(
    "houseHeaderLoaded",
    () => {

        const headerSearch =
            document.getElementById(
                "house-header-search-input"
            );

        if (
            headerSearch &&
            searchInput
        ) {

            headerSearch.value =
                searchInput.value;

        }

    }
);




// ==========================================
// INITIALIZE PAGE
// ==========================================

loadHouses(1);