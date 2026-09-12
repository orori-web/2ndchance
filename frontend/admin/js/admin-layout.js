console.log("Admin layout running");

import { getCurrentUser } from "../../js/auth.js";



// ==========================================
// ADMIN PROFILE
// ==========================================

const renderAdminProfile = (user) => {

    const profileAvatar =
        document.getElementById("admin-profile-avatar");

    const profileName =
        document.getElementById("admin-profile-name");

    const profileRole =
        document.getElementById("admin-profile-role");


    const fullName =
        user.fullName ||
        user.name ||
        "Admin";


    const role =
        user.role ||
        "admin";


    // ==========================================
    // NAME
    // ==========================================

    if (profileName) {

        profileName.textContent =
            fullName;

    }


    // ==========================================
    // ROLE
    // ==========================================

    if (profileRole) {

        profileRole.textContent =
            role;

    }


    // ==========================================
    // AVATAR
    // ==========================================

    if (!profileAvatar) {

        return;

    }


    if (user.profilePicture) {

        profileAvatar.innerHTML = "";


        const image =
            document.createElement("img");


        image.src =
            user.profilePicture;


        image.alt =
            `${fullName} profile picture`;


        image.className =
            "admin-profile-image";


        image.onerror = () => {

            showAvatarInitial(
                fullName,
                profileAvatar
            );

        };


        profileAvatar.appendChild(image);

    } else {

        showAvatarInitial(
            fullName,
            profileAvatar
        );

    }

};



// ==========================================
// AVATAR FALLBACK
// ==========================================

const showAvatarInitial = (
    name,
    avatarElement
) => {

    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase() || "A";


    avatarElement.innerHTML = `
        <span class="admin-profile-letter">
            ${initial}
        </span>
    `;

};



// ==========================================
// SHARED ADMIN HEADER
// ==========================================

const renderAdminHeader = () => {

    const headerContainer =
        document.getElementById("admin-header");


    if (!headerContainer) {

        return;

    }


    headerContainer.innerHTML = `
        <header class="admin-topbar">

            <!-- LOGO -->

            <a
                href="dashboard.html"
                class="admin-logo"
            >

                <img
                    src="../images/Gemini_Generated_Image_rynewvrynewvryne.png"
                    alt="Second Chance Store"
                >

            </a>


            <!-- TOPBAR ACTIONS -->

            <div class="admin-topbar-actions">


                <!-- NOTIFICATIONS -->

                <button
                    type="button"
                    class="admin-icon-button"
                    aria-label="Notifications"
                >

                    <span class="material-symbols-outlined">
                        notifications
                    </span>

                </button>


                <!-- ADMIN PROFILE -->

                <button
                    type="button"
                    class="admin-profile-button"
                    id="admin-profile-button"
                    aria-label="Admin profile"
                >

                    <span
                        class="admin-profile-avatar"
                        id="admin-profile-avatar"
                    >
                    </span>


                    <span class="admin-profile-info">

                        <strong
                            id="admin-profile-name"
                        >
                            Admin
                        </strong>

                        <span
                            id="admin-profile-role"
                        >
                            Administrator
                        </span>

                    </span>


                    <span
                        class="material-symbols-outlined admin-profile-arrow"
                    >
                        keyboard_arrow_down
                    </span>

                </button>

            </div>

        </header>
    `;

};



// ==========================================
// SHARED ADMIN SIDEBAR
// ==========================================

const renderAdminSidebar = () => {

    const sidebarContainer =
        document.getElementById("admin-sidebar");


    if (!sidebarContainer) {

        return;

    }


    sidebarContainer.innerHTML = `
        <aside class="admin-sidebar">


            <!-- BRAND -->

            <div class="admin-brand">

                <a
                    href="dashboard.html"
                    class="admin-brand-logo"
                >

                    <img
                        src="../images/Gemini_Generated_Image_rynewvrynewvryne.png"
                        alt="Second Chance Store"
                    >

                </a>


                <div class="admin-brand-text">

                    <strong>
                        Second Chance
                    </strong>

                    <span>
                        Store Admin
                    </span>

                </div>

            </div>


            <!-- NAVIGATION -->

            <nav class="admin-navigation">


                <!-- MAIN -->

                <p class="admin-nav-label">
                    Main
                </p>


                <a
                    href="dashboard.html"
                    class="admin-nav-link"
                    data-admin-page="dashboard"
                >

                    <span class="material-symbols-outlined">
                        dashboard
                    </span>

                    <span>
                        Dashboard
                    </span>

                </a>

                <a
    href="analytics.html"
    class="admin-nav-link"
    data-admin-page="analytics"
>
    <span class="material-symbols-outlined">
        analytics
    </span>
    <span>
        Analytics
    </span>
</a>


                <a
                    href="products.html"
                    class="admin-nav-link"
                    data-admin-page="products"
                >

                    <span class="material-symbols-outlined">
                        inventory_2
                    </span>

                    <span>
                        Products
                    </span>

                </a>


                <a
                    href="houses.html"
                    class="admin-nav-link"
                    data-admin-page="houses"
                >

                    <span class="material-symbols-outlined">
                        home
                    </span>

                    <span>
                        Houses
                    </span>

                </a>


                <!-- MANAGEMENT -->

                <p class="admin-nav-label">
                    Management
                </p>


                <a
                    href="users.html"
                    class="admin-nav-link"
                    data-admin-page="users"
                >

                    <span class="material-symbols-outlined">
                        group
                    </span>

                    <span>
                        Users
                    </span>

                </a>


                <a
                    href="categories.html"
                    class="admin-nav-link"
                    data-admin-page="categories"
                >

                    <span class="material-symbols-outlined">
                        category
                    </span>

                    <span>
                        Categories
                    </span>

                </a>


                <a
                    href="admin-posters.html"
                    class="admin-nav-link"
                    data-admin-page="admin-posters"
                >

                    <span class="material-symbols-outlined">
                        campaign
                    </span>

                    <span>
                        Posters
                    </span>

                </a>


                <!-- SYSTEM -->

                <p class="admin-nav-label">
                    System
                </p>


                <a
                    href="settings.html"
                    class="admin-nav-link"
                    data-admin-page="settings"
                >

                    <span class="material-symbols-outlined">
                        settings
                    </span>

                    <span>
                        Settings
                    </span>

                </a>

            </nav>


            <!-- SIDEBAR FOOTER -->

            <div class="admin-sidebar-footer">

                <button
                    type="button"
                    id="admin-logout-button"
                    class="admin-logout-button"
                >

                    <span class="material-symbols-outlined">
                        logout
                    </span>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    `;

};



// ==========================================
// ADMIN MOBILE BOTTOM NAVIGATION
// ==========================================

const renderAdminBottomNav = () => {

    const existingNav =
        document.getElementById(
            "admin-mobile-bottom-nav"
        );


    if (existingNav) {

        return;

    }


    const nav =
        document.createElement("nav");


    nav.id =
        "admin-mobile-bottom-nav";


    nav.className =
        "admin-mobile-bottom-nav";


    nav.setAttribute(
        "aria-label",
        "Mobile navigation"
    );


    nav.innerHTML = `

        <!-- STORE HOME -->

        <a
            href="../home.html"
            class="admin-mobile-bottom-nav-item"
            data-admin-bottom-page="home"
        >

            <span class="material-symbols-outlined">
                home
            </span>

            <span class="admin-mobile-bottom-nav-label">
                Home
            </span>

        </a>


        <!-- SELL -->

        <a
            href="../sell.html"
            class="admin-mobile-bottom-nav-item"
            data-admin-bottom-page="sell"
        >

            <span class="material-symbols-outlined">
                sell
            </span>

            <span class="admin-mobile-bottom-nav-label">
                Sell
            </span>

        </a>


        <!-- HOUSES -->

        <a
            href="../house.html"
            class="admin-mobile-bottom-nav-item"
            data-admin-bottom-page="houses"
        >

            <span class="material-symbols-outlined">
                home_work
            </span>

            <span class="admin-mobile-bottom-nav-label">
                Houses
            </span>

        </a>


        <!-- PRODUCTS -->

        <a
            href="../products.html"
            class="admin-mobile-bottom-nav-item"
            data-admin-bottom-page="products"
        >

            <span class="material-symbols-outlined">
                shopping_bag
            </span>

            <span class="admin-mobile-bottom-nav-label">
                Products
            </span>

        </a>


        <!-- ADMIN -->

        <a
            href="dashboard.html"
            class="admin-mobile-bottom-nav-item"
            data-admin-bottom-page="admin"
        >

            <span class="material-symbols-outlined">
                admin_panel_settings
            </span>

            <span class="admin-mobile-bottom-nav-label">
                Admin
            </span>

        </a>

    `;


    document.body.appendChild(nav);

};



// ==========================================
// ACTIVE ADMIN PAGE
// ==========================================

const setActiveAdminPage = () => {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");


    const navLinks =
        document.querySelectorAll(
            ".admin-nav-link"
        );


    navLinks.forEach((link) => {

        const page =
            link.dataset.adminPage;


        if (page === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

};



// ==========================================
// ACTIVE MOBILE BOTTOM NAV
// ==========================================

const setActiveAdminBottomNav = () => {

    const currentPath =
        window.location.pathname;


    const currentPage =
        currentPath
            .split("/")
            .pop()
            .replace(".html", "");


    const bottomNavLinks =
        document.querySelectorAll(
            ".admin-mobile-bottom-nav-item"
        );


    bottomNavLinks.forEach((link) => {

        const page =
            link.dataset.adminBottomPage;


        link.classList.remove("active");


        // ==========================================
        // ADMIN
        // ==========================================

        if (
            page === "admin" &&
            currentPath.includes("/admin/")
        ) {

            link.classList.add("active");

            return;

        }


        // ==========================================
        // STORE PAGES
        // ==========================================

        if (
            page === currentPage
        ) {

            link.classList.add("active");

        }

    });

};



// ==========================================
// LOGOUT
// ==========================================

const setupAdminLogout = () => {

    const logoutButton =
        document.getElementById(
            "admin-logout-button"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "accessToken"
            );


            window.location.href =
                "../home.html";

        }
    );

};



// ==========================================
// AUTHENTICATION
// ==========================================

const initializeAdminLayout = async () => {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "../home.html";

        return null;

    }


    if (user.role !== "admin") {

        alert(
            "Admin access only."
        );


        window.location.href =
            "../home.html";

        return null;

    }


    // ==========================================
    // RENDER SHARED UI
    // ==========================================

    renderAdminHeader();

    renderAdminSidebar();

    renderAdminBottomNav();


    // ==========================================
    // INITIALIZE SHARED FEATURES
    // ==========================================

    setActiveAdminPage();

    setActiveAdminBottomNav();

    renderAdminProfile(user);

    setupAdminLogout();


    return user;

};



// ==========================================
// START ADMIN LAYOUT
// ==========================================

const adminUser =
    await initializeAdminLayout();



export {
    adminUser,
    renderAdminProfile
};