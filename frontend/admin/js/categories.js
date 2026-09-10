import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin categories page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const categoryForm =
document.getElementById("category-form");

const categoryNameInput =
document.getElementById("category-name");

const categoriesContainer =
document.getElementById("categories-container");

const message =
document.getElementById("categories-message");

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
// LOAD CATEGORIES
// ==========================================

const loadCategories = async () => {


try {

    showMessage(
        "Loading categories..."
    );

    categoriesContainer.innerHTML =
        "";

    const data =
        await apiFetch(
            "/api/admin/categories"
        );

    console.log(
        "Admin categories response:",
        data
    );

    const categories =
        data.categories || [];

    renderCategories(
        categories
    );

    showMessage(
        `${categories.length} category(s) loaded.`
    );

} catch (error) {

    console.error(
        "Failed to load categories:",
        error
    );

    showMessage(
        error.message ||
        "Failed to load categories.",
        true
    );

}


};

// ==========================================
// RENDER CATEGORIES
// ==========================================

const renderCategories = (
categories
) => {


categoriesContainer.innerHTML =
    "";

if (!categories.length) {

    categoriesContainer.innerHTML =
        "<p>No categories found.</p>";

    return;
}

categories.forEach(
    (category) => {

        const categoryElement =
            document.createElement(
                "div"
            );

        categoryElement.dataset.id =
            category._id;

        const status =
            category.isActive
                ? "ACTIVE"
                : "DISABLED";

        categoryElement.innerHTML = `

            <hr>

            <div>

                <h3>
                    ${category.name}
                </h3>

                <p>
                    Slug:
                    ${category.slug}
                </p>

                <p>
                    Order:
                    ${category.order}
                </p>

                <p>
                    Total Products:
                    ${category.totalProducts}
                </p>

                <p>
                    Active Products:
                    ${category.activeProducts}
                </p>

                <p>
                    Status:
                    <strong>
                        ${status}
                    </strong>
                </p>

                <button
                    type="button"
                    class="edit-category-button"
                    data-id="${category._id}"
                    data-name="${category.name}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="toggle-category-button"
                    data-id="${category._id}"
                    data-active="${category.isActive}"
                >
                    ${
                        category.isActive
                            ? "Disable"
                            : "Activate"
                    }
                </button>

            </div>

        `;

        categoriesContainer.appendChild(
            categoryElement
        );

    }
);


};

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (
name
) => {


try {

    showMessage(
        "Creating category..."
    );

    const data =
        await apiFetch(
            "/api/admin/categories",
            {
                method: "POST",

                body: JSON.stringify({
                    name
                })
            }
        );

    console.log(
        "Create category response:",
        data
    );

    showMessage(
        data.message ||
        "Category created successfully."
    );

    categoryNameInput.value =
        "";

    await loadCategories();

} catch (error) {

    console.error(
        "Failed to create category:",
        error
    );

    showMessage(
        error.message ||
        "Failed to create category.",
        true
    );

}


};

// ==========================================
// EDIT CATEGORY
// ==========================================

const editCategory = async (
categoryId,
currentName
) => {


const newName =
    prompt(
        "Enter the new category name:",
        currentName
    );

if (
    newName === null
) {

    return;
}

const cleanName =
    newName.trim();

if (!cleanName) {

    showMessage(
        "Category name is required.",
        true
    );

    return;
}

if (
    cleanName ===
    currentName
) {

    return;
}

try {

    showMessage(
        "Updating category..."
    );

    const data =
        await apiFetch(
            `/api/admin/categories/${categoryId}`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    name:
                        cleanName
                })
            }
        );

    console.log(
        "Update category response:",
        data
    );

    showMessage(
        data.message ||
        "Category updated successfully."
    );

    await loadCategories();

} catch (error) {

    console.error(
        "Failed to update category:",
        error
    );

    showMessage(
        error.message ||
        "Failed to update category.",
        true
    );

}


};

// ==========================================
// TOGGLE CATEGORY STATUS
// ==========================================

const toggleCategoryStatus = async (
categoryId,
currentStatus
) => {


const newStatus =
    !currentStatus;

const confirmation =
    confirm(
        newStatus
            ? "Activate this category?"
            : "Disable this category?"
    );

if (!confirmation) {

    return;
}

try {

    showMessage(
        "Updating category status..."
    );

    const data =
        await apiFetch(
            `/api/admin/categories/${categoryId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    isActive:
                        newStatus
                })
            }
        );

    console.log(
        "Category status response:",
        data
    );

    showMessage(
        data.message ||
        "Category status updated."
    );

    await loadCategories();

} catch (error) {

    console.error(
        "Failed to update category status:",
        error
    );

    showMessage(
        error.message ||
        "Failed to update category status.",
        true
    );

}


};

// ==========================================
// ADD CATEGORY FORM
// ==========================================

categoryForm.addEventListener(
"submit",
async (event) => {


    event.preventDefault();

    const name =
        categoryNameInput.value.trim();

    if (!name) {

        showMessage(
            "Category name is required.",
            true
        );

        return;
    }

    await createCategory(
        name
    );

}


);

// ==========================================
// BUTTON EVENTS
// ==========================================

categoriesContainer.addEventListener(
"click",
async (event) => {

    const button =
        event.target.closest(
            "button"
        );

    if (!button) {

        return;
    }

    const categoryId =
        button.dataset.id;

    // ----------------------------------
    // EDIT
    // ----------------------------------

    if (
        button.classList.contains(
            "edit-category-button"
        )
    ) {

        await editCategory(
            categoryId,
            button.dataset.name
        );

        return;
    }

    // ----------------------------------
    // TOGGLE STATUS
    // ----------------------------------

    if (
        button.classList.contains(
            "toggle-category-button"
        )
    ) {

        const currentStatus =
            button.dataset.active ===
            "true";

        await toggleCategoryStatus(
            categoryId,
            currentStatus
        );

    }

}


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

await loadCategories();


};

initialize();
