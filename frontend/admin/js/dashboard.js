
import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin dashboard running");




// ==========================================
// RECENT PRODUCTS
// ==========================================

const renderRecentProducts = (products) => {

    const container =
        document.getElementById(
            "recent-products"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `
            <div class="panel-empty">
                No products have been listed yet.
            </div>
        `;

        return;
    }


    products.forEach((product) => {

        const div =
            document.createElement("div");


        const price =
            Number(product.price || 0)
                .toLocaleString();


        div.innerHTML = `
            <strong>
                ${product.name || "Unnamed product"}
            </strong>

            <span>
                ${product.listingCode || ""}
            </span>

            <span>
                KSh ${price}
            </span>
        `;


        container.appendChild(div);

    });

};


// ==========================================
// MOST VIEWED PRODUCTS
// ==========================================

const renderMostViewed = (products) => {

    const container =
        document.getElementById(
            "most-viewed"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `
            <div class="panel-empty">
                No product views available yet.
            </div>
        `;

        return;
    }


    products.forEach((product) => {

        const div =
            document.createElement("div");


        div.innerHTML = `
            <strong>
                ${product.name || "Unnamed product"}
            </strong>

            <span>
                ${Number(product.views || 0).toLocaleString()}
                views
            </span>
        `;


        container.appendChild(div);

    });

};


// ==========================================
// LOAD DASHBOARD
// ==========================================

const loadDashboard = async () => {

    try {

        const data =
            await apiFetch(
                "/api/admin/dashboard"
            );


        console.log(
            "Admin dashboard data:",
            data
        );


        const dashboard =
            data.dashboard;


        const stats =
            dashboard.stats;


        // ==================================
        // STATISTICS
        // ==================================

        document.getElementById(
            "total-users"
        ).textContent =
            stats.totalUsers ?? 0;


        document.getElementById(
            "total-products"
        ).textContent =
            stats.totalProducts ?? 0;


        document.getElementById(
            "active-products"
        ).textContent =
            stats.activeProducts ?? 0;


        document.getElementById(
            "products-today"
        ).textContent =
            stats.productsToday ?? 0;


        // ==================================
        // PRODUCT LISTS
        // ==================================

        renderRecentProducts(
            dashboard.recentProducts || []
        );


        renderMostViewed(
            dashboard.mostViewedProducts || []
        );

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        const message =
            error?.message ||
            "Failed to load dashboard.";


        const recentProducts =
            document.getElementById(
                "recent-products"
            );

        const mostViewed =
            document.getElementById(
                "most-viewed"
            );


        if (recentProducts) {

            recentProducts.innerHTML = `
                <div class="panel-empty">
                    Unable to load recent products.
                </div>
            `;

        }


        if (mostViewed) {

            mostViewed.innerHTML = `
                <div class="panel-empty">
                    Unable to load popular products.
                </div>
            `;

        }


        alert(message);

    }

};




// ==========================================
// AUTHENTICATION
// ==========================================

const user = await getCurrentUser();


if (!user) {

    window.location.href =
        "../home.html";

} else if (user.role !== "admin") {

    alert("Admin access only.");

    window.location.href =
        "../home.html";

} else {

    // Now all functions have already
    // been initialized.

    

    loadDashboard();

}

