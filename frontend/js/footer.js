// ==========================================
// LOAD SHARED FOOTER
// ==========================================

const loadFooter = async () => {

    const footerContainer =
        document.getElementById("site-footer");

    if (!footerContainer) {
        return;
    }

    try {

        const response =
            await fetch("./components/footer.html");

        if (!response.ok) {

            throw new Error(
                `Failed to load footer: ${response.status}`
            );

        }

        const footerHTML =
            await response.text();

        footerContainer.innerHTML =
            footerHTML;

    } catch (error) {

        console.error(
            "Failed to load shared footer:",
            error
        );

    }

};


// ==========================================
// START
// ==========================================

loadFooter();