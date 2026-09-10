// ==========================================
// SECOND CHANCE STORE
// REUSABLE SKELETONS
// ==========================================

console.log("Skeleton system running");


// ==========================================
// PRODUCT CARD SKELETON
// ==========================================

const createProductSkeleton = () => {

    const card =
        document.createElement("article");

    card.className =
        "product-card-skeleton";


    // ==========================================
    // IMAGE
    // ==========================================

    const image =
        document.createElement("div");

    image.className =
        "skeleton product-card-skeleton-image";


    // ==========================================
    // CONTENT
    // ==========================================

    const content =
        document.createElement("div");

    content.className =
        "product-card-skeleton-content";


    // ==========================================
    // PRODUCT NAME
    // ==========================================

    const name =
        document.createElement("div");

    name.className =
        "skeleton product-card-skeleton-name";


    // ==========================================
    // PRODUCT PRICE
    // ==========================================

    const price =
        document.createElement("div");

    price.className =
        "skeleton product-card-skeleton-price";


    // ==========================================
    // CONDITION
    // ==========================================

    const condition =
        document.createElement("div");

    condition.className =
        "skeleton product-card-skeleton-condition";


    // ==========================================
    // BUTTON
    // ==========================================

    const button =
        document.createElement("div");

    button.className =
        "skeleton product-card-skeleton-button";


    // ==========================================
    // BUILD CARD
    // ==========================================

    content.appendChild(name);

    content.appendChild(price);

    content.appendChild(condition);

    content.appendChild(button);

    card.appendChild(image);

    card.appendChild(content);


    return card;
};


// ==========================================
// PRODUCT GRID SKELETONS
// ==========================================

const showProductSkeletons = (
    container,
    count = 8
) => {

    if (!container) {
        console.error(
            "Skeleton container not found."
        );

        return;
    }


    container.innerHTML = "";


    for (
        let i = 0;
        i < count;
        i++
    ) {

        container.appendChild(
            createProductSkeleton()
        );

    }

};


// ==========================================
// REMOVE SKELETONS
// ==========================================

// ==========================================
// REMOVE SKELETONS
// ==========================================

const clearSkeletons = (
    container
) => {

    if (!container) {
        return;
    }

    const skeletons =
        container.querySelectorAll(
            ".product-card-skeleton"
        );

    skeletons.forEach(
        (skeleton) => {
            skeleton.remove();
        }
    );
};

export {
    createProductSkeleton,
    showProductSkeletons,
    clearSkeletons
};