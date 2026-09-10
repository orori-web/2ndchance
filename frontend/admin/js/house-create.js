import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin create house page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const form =
document.getElementById("create-house-form");

const message =
document.getElementById("house-message");

const submitButton =
document.getElementById("create-house-button");

const imagesInput =
document.getElementById("images");

// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
text,
isError = false
) => {


message.textContent = text;

message.style.color =
    isError
        ? "red"
        : "green";


};

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
// IMAGE VALIDATION
// ==========================================

const validateImages = () => {


const files =
    Array.from(
        imagesInput.files
    );

if (files.length === 0) {

    throw new Error(
        "At least one house image is required."
    );

}

if (files.length > 5) {

    throw new Error(
        "You can upload a maximum of 5 images."
    );

}

const maxSize =
    5 * 1024 * 1024;

for (const file of files) {

    if (file.size > maxSize) {

        throw new Error(
            `${file.name} is larger than 5MB.`
        );

    }

    if (!file.type.startsWith("image/")) {

        throw new Error(
            "Only image files are allowed."
        );

    }

}

return files;


};

// ==========================================
// CREATE HOUSE
// ==========================================

const createHouse = async (event) => {


event.preventDefault();

try {

    submitButton.disabled = true;

    submitButton.textContent =
        "Creating...";

    showMessage(
        "Creating house listing..."
    );


    // ==================================
    // VALIDATE IMAGES
    // ==================================

    const files =
        validateImages();


    // ==================================
    // CREATE FORMDATA
    // ==================================

    const formData =
        new FormData();


    formData.append(
        "title",
        document.getElementById(
            "title"
        ).value.trim()
    );


    formData.append(
        "houseType",
        document.getElementById(
            "houseType"
        ).value
    );


    formData.append(
        "description",
        document.getElementById(
            "description"
        ).value.trim()
    );


    formData.append(
        "rent",
        document.getElementById(
            "rent"
        ).value
    );


    formData.append(
        "deposit",
        document.getElementById(
            "deposit"
        ).value
    );


    formData.append(
        "area",
        document.getElementById(
            "area"
        ).value.trim()
    );


    formData.append(
        "landmark",
        document.getElementById(
            "landmark"
        ).value.trim()
    );


    formData.append(
        "distanceFromCampus",
        document.getElementById(
            "distanceFromCampus"
        ).value.trim()
    );


    formData.append(
        "bathroomType",
        document.getElementById(
            "bathroomType"
        ).value.trim()
    );


    formData.append(
        "waterAvailability",
        document.getElementById(
            "waterAvailability"
        ).value.trim()
    );


    formData.append(
        "electricityType",
        document.getElementById(
            "electricityType"
        ).value.trim()
    );


    formData.append(
        "securityFeatures",
        document.getElementById(
            "securityFeatures"
        ).value.trim()
    );


    formData.append(
        "parkingAvailable",
        document.getElementById(
            "parkingAvailable"
        ).checked
    );


    formData.append(
        "caretakerName",
        document.getElementById(
            "caretakerName"
        ).value.trim()
    );


    formData.append(
        "caretakerPhone",
        document.getElementById(
            "caretakerPhone"
        ).value.trim()
    );


    formData.append(
        "exactLocation",
        document.getElementById(
            "exactLocation"
        ).value.trim()
    );


    // ==================================
    // ADD IMAGES
    // ==================================

    files.forEach(
        (file) => {

            formData.append(
                "images",
                file
            );

        }
    );


    // ==================================
    // SEND REQUEST
    // ==================================

    const data =
        await apiFetch(
            "/api/admin/houses",
            {
                method: "POST",
                body: formData
            }
        );


    console.log(
        "Create house response:",
        data
    );


    // ==================================
    // SUCCESS
    // ==================================

    showMessage(
        data.message ||
        "House created successfully."
    );


    form.reset();


    // ==================================
    // OPTIONAL REDIRECT
    // ==================================

    setTimeout(
        () => {

            window.location.href =
                "houses.html";

        },
        1000
    );


} catch (error) {

    console.error(
        "Failed to create house:",
        error
    );

    showMessage(
        error.message ||
        "Failed to create house.",
        true
    );

} finally {

    submitButton.disabled = false;

    submitButton.textContent =
        "Create House";

}


};

// ==========================================
// EVENT
// ==========================================

form.addEventListener(
"submit",
createHouse
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


};

initialize();
