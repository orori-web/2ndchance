import {
    apiFetch
} from "../../js/api.js";



console.log(
    "Second Chance Store admin posters running"
);


// ==========================================
// DOM ELEMENTS
// ==========================================

// Posters
const postersContainer =
    document.getElementById(
        "posters-container"
    );

const postersLoading =
    document.getElementById(
        "posters-loading"
    );

const postersError =
    document.getElementById(
        "posters-error"
    );

const postersErrorMessage =
    document.getElementById(
        "posters-error-message"
    );

const postersEmpty =
    document.getElementById(
        "posters-empty"
    );

const retryPostersButton =
    document.getElementById(
        "retry-posters-button"
    );


// Add poster buttons
const addPosterButton =
    document.getElementById(
        "add-poster-button"
    );

const emptyAddPosterButton =
    document.getElementById(
        "empty-add-poster-button"
    );


// Poster modal
const posterModal =
    document.getElementById(
        "poster-modal"
    );

const posterModalOverlay =
    document.getElementById(
        "poster-modal-overlay"
    );

const closePosterModalButton =
    document.getElementById(
        "close-poster-modal"
    );

const cancelPosterButton =
    document.getElementById(
        "cancel-poster-button"
    );

const posterModalTitle =
    document.getElementById(
        "poster-modal-title"
    );

const posterModalDescription =
    document.getElementById(
        "poster-modal-description"
    );

const posterForm =
    document.getElementById(
        "poster-form"
    );

const posterImageInput =
    document.getElementById(
        "poster-image"
    );

const posterImagePreview =
    document.getElementById(
        "poster-image-preview"
    );

const posterTitleInput =
    document.getElementById(
        "poster-title"
    );

const posterLinkInput =
    document.getElementById(
        "poster-link"
    );

const posterPlacementInput =
    document.getElementById(
        "poster-placement"
    );

const posterDisplayOrderInput =
    document.getElementById(
        "poster-display-order"
    );

const posterFormError =
    document.getElementById(
        "poster-form-error"
    );

const savePosterButton =
    document.getElementById(
        "save-poster-button"
    );


// Delete modal
const deletePosterModal =
    document.getElementById(
        "delete-poster-modal"
    );

const deleteModalOverlay =
    document.getElementById(
        "delete-modal-overlay"
    );

const cancelDeleteButton =
    document.getElementById(
        "cancel-delete-button"
    );

const confirmDeleteButton =
    document.getElementById(
        "confirm-delete-button"
    );


// ==========================================
// STATE
// ==========================================

let editingPosterId = null;

let deletingPosterId = null;

let currentPosterImageUrl = "";


// ==========================================
// LOAD ALL POSTERS
// ADMIN
// ==========================================

async function loadPosters() {

    try {

        showLoading();

        const data =
            await apiFetch(
                "/api/posters/admin",
                {
                    method: "GET"
                }
            );


        console.log(
            "Admin posters API response:",
            data
        );


        const posters =
            data?.posters || [];


        renderPosters(
            posters
        );


    } catch (error) {

        console.error(
            "Failed to load admin posters:",
            error
        );


        showError(
            error.message ||
            "Failed to load posters."
        );

    }

}


// ==========================================
// RENDER POSTERS
// ==========================================

function renderPosters(posters) {

    hideLoading();

    hideError();


    postersContainer.innerHTML = "";


    if (
        posters.length === 0
    ) {

        postersEmpty.hidden =
            false;

        return;

    }


    postersEmpty.hidden =
        true;


    posters.forEach(
        poster => {

            const card =
                createPosterCard(
                    poster
                );

            postersContainer.appendChild(
                card
            );

        }
    );

}


// ==========================================
// CREATE POSTER CARD
// ==========================================

function createPosterCard(poster) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "admin-poster-card";


    // ==========================================
    // IMAGE
    // ==========================================

    const imageContainer =
        document.createElement(
            "div"
        );

    imageContainer.className =
        "admin-poster-image-container";


    const image =
        document.createElement(
            "img"
        );

    image.className =
        "admin-poster-image";

    image.src =
        poster.image?.url || "";

    image.alt =
        poster.title ||
        "Poster";


    image.loading =
        "lazy";


    imageContainer.appendChild(
        image
    );


    // ==========================================
    // CONTENT
    // ==========================================

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "admin-poster-content";


    // ==========================================
    // TITLE
    // ==========================================

    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        poster.title ||
        "Untitled Poster";


    // ==========================================
    // PLACEMENT
    // ==========================================

    const placement =
        document.createElement(
            "p"
        );

    placement.className =
        "admin-poster-placement";

    placement.textContent =
        `Placement: ${formatPlacement(
            poster.placement
        )}`;


    // ==========================================
    // DISPLAY ORDER
    // ==========================================

    const order =
        document.createElement(
            "p"
        );

    order.className =
        "admin-poster-order";

    order.textContent =
        `Display order: ${
            poster.displayOrder || 1
        }`;


    // ==========================================
    // STATUS
    // ==========================================

    const status =
        document.createElement(
            "span"
        );

    status.className =
        poster.isActive
            ? "poster-status active"
            : "poster-status inactive";

    status.textContent =
        poster.isActive
            ? "Active"
            : "Inactive";


    // ==========================================
    // ACTIONS
    // ==========================================

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "admin-poster-actions";


    // ==========================================
    // EDIT BUTTON
    // ==========================================

    const editButton =
        document.createElement(
            "button"
        );

    editButton.type =
        "button";

    editButton.className =
        "admin-secondary-button";

    editButton.innerHTML = `
        <span class="material-symbols-outlined">
            edit
        </span>

        Edit
    `;


    editButton.addEventListener(
        "click",
        () => {

            openEditPosterModal(
                poster
            );

        }
    );


    // ==========================================
    // STATUS BUTTON
    // ==========================================

    const statusButton =
        document.createElement(
            "button"
        );

    statusButton.type =
        "button";

    statusButton.className =
        poster.isActive
            ? "admin-secondary-button"
            : "admin-primary-button";


    statusButton.innerHTML =
        poster.isActive
            ? `
                <span class="material-symbols-outlined">
                    visibility_off
                </span>
                Deactivate
              `
            : `
                <span class="material-symbols-outlined">
                    visibility
                </span>
                Activate
              `;


    statusButton.addEventListener(
        "click",
        () => {

            togglePosterStatus(
                poster._id
            );

        }
    );


    // ==========================================
    // DELETE BUTTON
    // ==========================================

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "admin-danger-button";

    deleteButton.innerHTML = `
        <span class="material-symbols-outlined">
            delete
        </span>

        Delete
    `;


    deleteButton.addEventListener(
        "click",
        () => {

            openDeleteModal(
                poster._id
            );

        }
    );


    // ==========================================
    // BUILD ACTIONS
    // ==========================================

    actions.appendChild(
        editButton
    );

    actions.appendChild(
        statusButton
    );

    actions.appendChild(
        deleteButton
    );


    // ==========================================
    // BUILD CONTENT
    // ==========================================

    content.appendChild(
        title
    );

    content.appendChild(
        placement
    );

    content.appendChild(
        order
    );

    content.appendChild(
        status
    );

    content.appendChild(
        actions
    );


    // ==========================================
    // BUILD CARD
    // ==========================================

    card.appendChild(
        imageContainer
    );

    card.appendChild(
        content
    );


    return card;

}


// ==========================================
// FORMAT PLACEMENT
// ==========================================

function formatPlacement(
    placement
) {

    const placementNames = {

        "top-banner":
            "Top Banner",

        "banner-2":
            "Banner 2",

        "banner-3":
            "Banner 3",

        "banner-4":
            "Banner 4"

    };


    return (
        placementNames[placement] ||
        placement ||
        "Unknown"
    );

}


// ==========================================
// OPEN ADD POSTER MODAL
// ==========================================

function openAddPosterModal() {

    editingPosterId =
        null;

    currentPosterImageUrl =
        "";


    posterModalTitle.textContent =
        "Add Poster";

    posterModalDescription.textContent =
        "Add a new poster to the homepage.";


    posterForm.reset();


    posterDisplayOrderInput.value =
        "1";


    posterImageInput.required =
        true;


    clearPosterImagePreview();

    hideFormError();


    showPosterModal();

}


// ==========================================
// OPEN EDIT POSTER MODAL
// ==========================================

function openEditPosterModal(
    poster
) {

    editingPosterId =
        poster._id;


    currentPosterImageUrl =
        poster.image?.url || "";


    posterModalTitle.textContent =
        "Edit Poster";

    posterModalDescription.textContent =
        "Update this homepage poster.";


    posterForm.reset();


    posterTitleInput.value =
        poster.title || "";


    posterLinkInput.value =
        poster.link || "";


    posterPlacementInput.value =
        poster.placement || "";


    posterDisplayOrderInput.value =
        poster.displayOrder || 1;


    posterImageInput.required =
        false;


    hideFormError();


    if (currentPosterImageUrl) {

        showPosterImagePreview(
            currentPosterImageUrl
        );

    } else {

        clearPosterImagePreview();

    }


    showPosterModal();

}


// ==========================================
// SHOW POSTER MODAL
// ==========================================

function showPosterModal() {

    posterModal.hidden =
        false;

    document.body.classList.add(
        "modal-open"
    );

}


// ==========================================
// CLOSE POSTER MODAL
// ==========================================

function closePosterModal() {

    posterModal.hidden =
        true;

    document.body.classList.remove(
        "modal-open"
    );


    editingPosterId =
        null;

    currentPosterImageUrl =
        "";


    posterForm.reset();

    clearPosterImagePreview();

    hideFormError();

}


// ==========================================
// IMAGE PREVIEW
// ==========================================

function handlePosterImagePreview() {

    const file =
        posterImageInput.files?.[0];


    if (!file) {

        if (editingPosterId &&
            currentPosterImageUrl
        ) {

            showPosterImagePreview(
                currentPosterImageUrl
            );

        } else {

            clearPosterImagePreview();

        }

        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showFormError(
            "Please select a valid image file."
        );

        posterImageInput.value =
            "";

        return;

    }


    const objectUrl =
        URL.createObjectURL(
            file
        );


    showPosterImagePreview(
        objectUrl
    );

}


// ==========================================
// SHOW IMAGE PREVIEW
// ==========================================

function showPosterImagePreview(
    src
) {

    posterImagePreview.innerHTML = `
        <img
            src="${escapeHtmlAttribute(src)}"
            alt="Poster preview"
        >
    `;

}


// ==========================================
// CLEAR IMAGE PREVIEW
// ==========================================

function clearPosterImagePreview() {

    posterImagePreview.innerHTML =
        "";

}


// ==========================================
// CREATE / UPDATE POSTER
// ==========================================

async function savePoster(
    event
) {

    event.preventDefault();


    hideFormError();


    const placement =
        posterPlacementInput.value.trim();


    if (!placement) {

        showFormError(
            "Please select a homepage placement."
        );

        return;

    }


    const displayOrder =
        Number(
            posterDisplayOrderInput.value
        );


    if (
        !Number.isInteger(
            displayOrder
        ) ||
        displayOrder < 1
    ) {

        showFormError(
            "Display order must be a whole number greater than 0."
        );

        return;

    }


    const file =
        posterImageInput.files?.[0];


    if (
        !editingPosterId &&
        !file
    ) {

        showFormError(
            "Please select a poster image."
        );

        return;

    }


    try {

        setSaveButtonLoading(
            true
        );


        const formData =
            new FormData();


        if (file) {

            formData.append(
                "image",
                file
            );

        }


        formData.append(
            "title",
            posterTitleInput.value.trim()
        );


        formData.append(
            "link",
            posterLinkInput.value.trim()
        );


        formData.append(
            "placement",
            placement
        );


        formData.append(
            "displayOrder",
            String(
                displayOrder
            )
        );


        let data;


        if (editingPosterId) {

            data =
                await apiFetch(
                    `/api/posters/admin/${editingPosterId}`,
                    {
                        method: "PUT",
                        body: formData
                    }
                );

        } else {

            data =
                await apiFetch(
                    "/api/posters/admin",
                    {
                        method: "POST",
                        body: formData
                    }
                );

        }


        console.log(
            "Poster save response:",
            data
        );


        closePosterModal();


        await loadPosters();


    } catch (error) {

        console.error(
            "Failed to save poster:",
            error
        );


        showFormError(
            error.message ||
            "Failed to save poster."
        );


    } finally {

        setSaveButtonLoading(
            false
        );

    }

}


// ==========================================
// SAVE BUTTON LOADING
// ==========================================

function setSaveButtonLoading(
    loading
) {

    if (!savePosterButton) {
        return;
    }


    savePosterButton.disabled =
        loading;


    if (loading) {

        savePosterButton.dataset.originalText =
            savePosterButton.innerHTML;


        savePosterButton.innerHTML = `
            <span class="material-symbols-outlined">
                progress_activity
            </span>

            Saving...
        `;

    } else {

        savePosterButton.innerHTML =
            savePosterButton.dataset.originalText ||
            `
                <span class="material-symbols-outlined">
                    save
                </span>

                Save Poster
            `;

    }

}


// ==========================================
// TOGGLE POSTER STATUS
// ==========================================

async function togglePosterStatus(
    posterId
) {

    try {

        const data =
            await apiFetch(
                `/api/posters/admin/${posterId}/status`,
                {
                    method: "PATCH"
                }
            );


        console.log(
            "Poster status response:",
            data
        );


        await loadPosters();


    } catch (error) {

        console.error(
            "Failed to toggle poster status:",
            error
        );


        alert(
            error.message ||
            "Failed to update poster status."
        );

    }

}


// ==========================================
// OPEN DELETE MODAL
// ==========================================

function openDeleteModal(
    posterId
) {

    deletingPosterId =
        posterId;


    deletePosterModal.hidden =
        false;

    document.body.classList.add(
        "modal-open"
    );

}


// ==========================================
// CLOSE DELETE MODAL
// ==========================================

function closeDeleteModal() {

    deletePosterModal.hidden =
        true;

    document.body.classList.remove(
        "modal-open"
    );


    deletingPosterId =
        null;

}


// ==========================================
// DELETE POSTER
// ==========================================

async function deletePoster() {

    if (!deletingPosterId) {
        return;
    }


    try {

        confirmDeleteButton.disabled =
            true;


        confirmDeleteButton.innerHTML = `
            <span class="material-symbols-outlined">
                progress_activity
            </span>

            Deleting...
        `;


        const data =
            await apiFetch(
                `/api/posters/admin/${deletingPosterId}`,
                {
                    method: "DELETE"
                }
            );


        console.log(
            "Poster delete response:",
            data
        );


        closeDeleteModal();


        await loadPosters();


    } catch (error) {

        console.error(
            "Failed to delete poster:",
            error
        );


        alert(
            error.message ||
            "Failed to delete poster."
        );


    } finally {

        confirmDeleteButton.disabled =
            false;

        confirmDeleteButton.innerHTML = `
            Delete Poster
        `;

    }

}


// ==========================================
// FORM ERROR
// ==========================================

function showFormError(
    message
) {

    posterFormError.hidden =
        false;

    posterFormError.textContent =
        message;

}


function hideFormError() {

    posterFormError.hidden =
        true;

    posterFormError.textContent =
        "";

}


// ==========================================
// LOADING STATE
// ==========================================

function showLoading() {

    postersLoading.hidden =
        false;

    postersError.hidden =
        true;

    postersEmpty.hidden =
        true;

}


// ==========================================
// HIDE LOADING
// ==========================================

function hideLoading() {

    postersLoading.hidden =
        true;

}


// ==========================================
// ERROR STATE
// ==========================================

function showError(
    message
) {

    postersLoading.hidden =
        true;

    postersEmpty.hidden =
        true;

    postersError.hidden =
        false;

    postersErrorMessage.textContent =
        message;

}


// ==========================================
// HIDE ERROR
// ==========================================

function hideError() {

    postersError.hidden =
        true;

}


// ==========================================
// ESCAPE HTML ATTRIBUTE
// ==========================================

function escapeHtmlAttribute(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// EVENT LISTENERS
// ==========================================

// Add poster
if (addPosterButton) {

    addPosterButton.addEventListener(
        "click",
        openAddPosterModal
    );

}


// Empty state add poster
if (emptyAddPosterButton) {

    emptyAddPosterButton.addEventListener(
        "click",
        openAddPosterModal
    );

}


// Retry
if (retryPostersButton) {

    retryPostersButton.addEventListener(
        "click",
        loadPosters
    );

}


// Poster form
if (posterForm) {

    posterForm.addEventListener(
        "submit",
        savePoster
    );

}


// Image preview
if (posterImageInput) {

    posterImageInput.addEventListener(
        "change",
        handlePosterImagePreview
    );

}


// Close modal
if (closePosterModalButton) {

    closePosterModalButton.addEventListener(
        "click",
        closePosterModal
    );

}


if (cancelPosterButton) {

    cancelPosterButton.addEventListener(
        "click",
        closePosterModal
    );

}


if (posterModalOverlay) {

    posterModalOverlay.addEventListener(
        "click",
        closePosterModal
    );

}


// Delete modal
if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
        "click",
        closeDeleteModal
    );

}


if (deleteModalOverlay) {

    deleteModalOverlay.addEventListener(
        "click",
        closeDeleteModal
    );

}


if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        deletePoster
    );

}


// Escape key
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            if (
                !posterModal.hidden
            ) {

                closePosterModal();

            }


            if (
                !deletePosterModal.hidden
            ) {

                closeDeleteModal();

            }

        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadPosters();

