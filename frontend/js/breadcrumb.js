// ==========================================
// SHARED BREADCRUMB
// ==========================================

const renderBreadcrumb = (items = []) => {
    const container =
        document.getElementById("breadcrumb");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    items.forEach((item, index) => {

        // ==========================================
        // BREADCRUMB ITEM
        // ==========================================

        const isLast =
            index === items.length - 1;

        if (item.href && !isLast) {

            const link =
                document.createElement("a");

            link.href = item.href;
            link.textContent = item.label;

            container.appendChild(link);

        } else {

            const current =
                document.createElement("span");

            current.textContent =
                item.label;

            container.appendChild(current);
        }


        // ==========================================
        // CHEVRON
        // ==========================================

        if (!isLast) {

            const separator =
                document.createElement("span");

            separator.className =
                "material-symbols-outlined";

            separator.textContent =
                "chevron_right";

            container.appendChild(
                separator
            );
        }
    });
};


export {
    renderBreadcrumb
};