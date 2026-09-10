import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin users page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const usersContainer =
document.getElementById("users-container");

const paginationContainer =
document.getElementById("pagination-container");

const searchInput =
document.getElementById("user-search");

const roleFilter =
document.getElementById("role-filter");

const statusFilter =
document.getElementById("status-filter");

const searchButton =
document.getElementById("search-button");

const refreshButton =
document.getElementById("refresh-button");

const message =
document.getElementById("users-message");

// ==========================================
// STATE
// ==========================================

let currentPage = 1;

const limit = 20;

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

        alert("Admin access only.");

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
// LOAD USERS
// ==========================================

const loadUsers = async (
page = 1
) => {


try {

    showMessage(
        "Loading users..."
    );

    usersContainer.innerHTML =
        "";

    paginationContainer.innerHTML =
        "";

    currentPage =
        page;

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

    const search =
        searchInput.value.trim();

    const role =
        roleFilter.value;

    const status =
        statusFilter.value;

    if (search) {

        params.set(
            "search",
            search
        );

    }

    if (role) {

        params.set(
            "role",
            role
        );

    }

    if (status) {

        params.set(
            "status",
            status
        );

    }

    const data =
        await apiFetch(
            `/api/admin/users?${params.toString()}`
        );

    console.log(
        "Admin users response:",
        data
    );

    const users =
        data.users || [];

    renderUsers(
        users
    );

    renderPagination(
        data.pagination
    );

    showMessage(
        `${data.pagination?.totalUsers || users.length} user(s) found.`
    );

} catch (error) {

    console.error(
        "Failed to load users:",
        error
    );

    showMessage(
        error.message ||
        "Failed to load users.",
        true
    );

}


};

// ==========================================
// RENDER USERS
// ==========================================

const renderUsers = (
users
) => {


usersContainer.innerHTML =
    "";

if (!users.length) {

    usersContainer.innerHTML =
        "<p>No users found.</p>";

    return;
}

users.forEach(
    (user) => {

        const userElement =
            document.createElement(
                "div"
            );

        userElement.dataset.id =
            user._id;

        const status =
            user.isActive
                ? "ACTIVE"
                : "DISABLED";

        userElement.innerHTML = `

            <hr>

            <div>

                ${
                    user.profilePicture
                        ? `
                            <img
                                src="${user.profilePicture}"
                                alt="${user.fullName}"
                                width="80"
                            >
                        `
                        : ""
                }

                <h3>
                    ${user.fullName}
                </h3>

                <p>
                    Email:
                    ${user.email}
                </p>

                <p>
                    Role:
                    ${user.role}
                </p>

                <p>
                    Status:
                    <strong>
                        ${status}
                    </strong>
                </p>

                <p>
                    Joined:
                    ${
                        user.createdAt
                            ? new Date(
                                user.createdAt
                            ).toLocaleDateString()
                            : "Unknown"
                    }
                </p>

                <button
                    type="button"
                    class="view-user-button"
                    data-id="${user._id}"
                >
                    View
                </button>

                <button
                    type="button"
                    class="toggle-user-button"
                    data-id="${user._id}"
                    data-active="${user.isActive}"
                >
                    ${
                        user.isActive
                            ? "Disable"
                            : "Activate"
                    }
                </button>

            </div>

        `;

        usersContainer.appendChild(
            userElement
        );

    }
);


};

// ==========================================
// VIEW USER
// ==========================================

const viewUser = (
userId
) => {


window.location.href =
    `user.html?id=${userId}`;


};

// ==========================================
// TOGGLE USER STATUS
// ==========================================

const toggleUserStatus = async (
userId,
currentStatus
) => {


const newStatus =
    !currentStatus;

const confirmation =
    confirm(
        newStatus
            ? "Activate this user?"
            : "Disable this user?"
    );

if (!confirmation) {

    return;
}

try {

    showMessage(
        "Updating user..."
    );

    const data =
        await apiFetch(
            `/api/admin/users/${userId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    isActive:
                        newStatus
                })
            }
        );

    console.log(
        "User status update:",
        data
    );

    showMessage(
        data.message ||
        "User status updated."
    );

    await loadUsers(
        currentPage
    );

} catch (error) {

    console.error(
        "Failed to update user status:",
        error
    );

    showMessage(
        error.message ||
        "Failed to update user status.",
        true
    );

}


};

// ==========================================
// BUTTON EVENTS
// ==========================================

usersContainer.addEventListener(
"click",
async (event) => {


    const button =
        event.target.closest(
            "button"
        );

    if (!button) {

        return;
    }

    const userId =
        button.dataset.id;

    // ----------------------------------
    // VIEW
    // ----------------------------------

    if (
        button.classList.contains(
            "view-user-button"
        )
    ) {

        viewUser(
            userId
        );

        return;
    }

    // ----------------------------------
    // TOGGLE STATUS
    // ----------------------------------

    if (
        button.classList.contains(
            "toggle-user-button"
        )
    ) {

        const currentStatus =
            button.dataset.active ===
            "true";

        await toggleUserStatus(
            userId,
            currentStatus
        );

    }

}


);

// ==========================================
// SEARCH
// ==========================================

searchButton.addEventListener(
"click",
() => {


    loadUsers(1);

}


);

searchInput.addEventListener(
"keydown",
(event) => {

    if (
        event.key === "Enter"
    ) {

        loadUsers(1);

    }

}


);

// ==========================================
// FILTERS
// ==========================================

roleFilter.addEventListener(
"change",
() => {


    loadUsers(1);

}


);

statusFilter.addEventListener(
"change",
() => {


    loadUsers(1);

}


);

// ==========================================
// REFRESH
// ==========================================

refreshButton.addEventListener(
"click",
() => {


    loadUsers(
        currentPage
    );

}


);

// ==========================================
// PAGINATION
// ==========================================

const renderPagination = (
pagination
) => {


paginationContainer.innerHTML =
    "";

if (!pagination) {

    return;
}

const {
    page,
    totalPages
} = pagination;

if (totalPages <= 1) {

    return;
}

const previousButton =
    document.createElement(
        "button"
    );

previousButton.type =
    "button";

previousButton.textContent =
    "Previous";

previousButton.disabled =
    page <= 1;

previousButton.addEventListener(
    "click",
    () => {

        loadUsers(
            page - 1
        );

    }
);

const pageText =
    document.createElement(
        "span"
    );

pageText.textContent =
    ` Page ${page} of ${totalPages} `;

const nextButton =
    document.createElement(
        "button"
    );

nextButton.type =
    "button";

nextButton.textContent =
    "Next";

nextButton.disabled =
    page >= totalPages;

nextButton.addEventListener(
    "click",
    () => {

        loadUsers(
            page + 1
        );

    }
);

paginationContainer.appendChild(
    previousButton
);

paginationContainer.appendChild(
    pageText
);

paginationContainer.appendChild(
    nextButton
);


};

// ==========================================
// INITIALIZE
// ==========================================

const initialize = async () => {


const allowed =
    await checkAdminAccess();

if (!allowed) {

    return;
}

await loadUsers(1);


};

initialize();
