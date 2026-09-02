/* =========================================
   FASTBITE - MENU PAGE
========================================= */


/* =========================================
   MENU STATE
========================================= */

let currentCategory = "All";

let currentSearch = "";

let currentSort = "default";


/* =========================================
   GET PRODUCTS
========================================= */

function getMenuProducts() {

    return getStorage(
        STORAGE_KEYS.PRODUCTS,
        defaultProducts
    );

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createMenuProductCard(product) {

    const unavailable =
        product.available === false;


    const imageHTML = product.image

        ? `
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='block';
                "
            >

            <span
                class="menu-product-placeholder"
                style="display:none"
            >
                🍔
            </span>
        `

        : `
            <span class="menu-product-placeholder">
                🍔
            </span>
        `;


    return `

        <article
            class="menu-product-card"
            data-product-id="${product.id}"
        >


            <!-- Product Image -->

            <div class="menu-product-image">

                ${imageHTML}


                ${
                    product.popular
                    ? `
                        <span class="product-badge">
                            Popular
                        </span>
                    `
                    : ""
                }


                ${
                    unavailable
                    ? `
                        <span class="product-badge unavailable-badge">
                            Unavailable
                        </span>
                    `
                    : ""
                }

            </div>


            <!-- Product Information -->

            <div class="menu-product-info">

                <span class="menu-product-category">
                    ${product.category}
                </span>


                <h3>
                    ${product.name}
                </h3>


                <p class="menu-product-description">
                    ${product.description}
                </p>


                <div class="menu-product-rating">
                    ⭐ ${product.rating}
                </div>


                <div class="menu-product-bottom">


                    <span class="menu-product-price">
                        ₹${product.price}
                    </span>


                    <div class="menu-product-actions">


                        <a
                            href="food-details.html?id=${product.id}"
                            class="details-btn"
                        >
                            Details
                        </a>


                        <button
                            class="menu-add-btn"
                            onclick="addMenuProductToCart('${product.id}')"
                            ${unavailable ? "disabled" : ""}
                            aria-label="Add ${product.name} to cart"
                        >
                            +
                        </button>


                    </div>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   FILTER PRODUCTS
========================================= */

function filterMenuProducts(products) {

    let filteredProducts = [...products];


    /* ---------- CATEGORY ---------- */

    if (currentCategory !== "All") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category.toLowerCase()
                    === currentCategory.toLowerCase()
            );

    }


    /* ---------- SEARCH ---------- */

    if (currentSearch.trim() !== "") {

        const search =
            currentSearch
                .trim()
                .toLowerCase();


        filteredProducts =
            filteredProducts.filter(product => {

                return (

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    /* ---------- SORT ---------- */

    switch (currentSort) {

        case "price-low":

            filteredProducts.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            filteredProducts.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            filteredProducts.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "name":

            filteredProducts.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

            break;


        default:

            break;

    }


    return filteredProducts;

}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayMenuProducts() {

    const container =
        document.getElementById(
            "menuProducts"
        );

    const noProducts =
        document.getElementById(
            "noProducts"
        );


    if (!container) {
        return;
    }


    const products =
        getMenuProducts();


    const filteredProducts =
        filterMenuProducts(products);


    /* ---------- RESULT TEXT ---------- */

    updateResultText(
        filteredProducts.length,
        products.length
    );


    /* ---------- NO RESULTS ---------- */

    if (filteredProducts.length === 0) {

        container.innerHTML = "";

        noProducts.classList.add("show");

        return;

    }


    noProducts.classList.remove("show");


    /* ---------- DISPLAY ---------- */

    container.innerHTML =
        filteredProducts
            .map(createMenuProductCard)
            .join("");

}


/* =========================================
   RESULT TEXT
========================================= */

function updateResultText(
    resultCount,
    totalCount
) {

    const resultText =
        document.getElementById(
            "resultText"
        );


    if (!resultText) {
        return;
    }


    if (
        currentSearch.trim() !== ""
        &&
        currentCategory !== "All"
    ) {

        resultText.textContent =
            `${resultCount} item(s) found for "${currentSearch}" in ${currentCategory}`;

        return;

    }


    if (currentSearch.trim() !== "") {

        resultText.textContent =
            `${resultCount} item(s) found for "${currentSearch}"`;

        return;

    }


    if (currentCategory !== "All") {

        resultText.textContent =
            `${resultCount} item(s) in ${currentCategory}`;

        return;

    }


    resultText.textContent =
        `Showing all ${totalCount} food items`;

}


/* =========================================
   CATEGORY FILTER
========================================= */

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".category-filter-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category;


                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                displayMenuProducts();

            }
        );

    });

}


/* =========================================
   SEARCH
========================================= */

function setupMenuSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const clearButton =
        document.getElementById(
            "clearSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        event => {

            currentSearch =
                event.target.value;


            if (
                currentSearch.trim()
                !== ""
            ) {

                clearButton.classList.add(
                    "show"
                );

            } else {

                clearButton.classList.remove(
                    "show"
                );

            }


            displayMenuProducts();

        }
    );


    clearButton.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            currentSearch = "";

            clearButton.classList.remove(
                "show"
            );

            displayMenuProducts();

            searchInput.focus();

        }
    );

}


/* =========================================
   SORTING
========================================= */

function setupSorting() {

    const sortSelect =
        document.getElementById(
            "sortSelect"
        );


    if (!sortSelect) {
        return;
    }


    sortSelect.addEventListener(
        "change",
        event => {

            currentSort =
                event.target.value;


            displayMenuProducts();

        }
    );

}


/* =========================================
   ADD TO CART
========================================= */

function addMenuProductToCart(
    productId
) {

    const products =
        getMenuProducts();


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return;

    }


    if (product.available === false) {

        showToast(
            "This product is unavailable.",
            "error"
        );

        return;

    }


    const cart =
        getCart();


    const existingItem =
        cart.find(
            item =>
                item.id === productId
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart(cart);


    showToast(
        `${product.name} added to cart!`,
        "success"
    );

}


/* =========================================
   RESET FILTERS
========================================= */

function resetMenuFilters() {

    currentCategory = "All";

    currentSearch = "";

    currentSort = "default";


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const sortSelect =
        document.getElementById(
            "sortSelect"
        );


    const clearButton =
        document.getElementById(
            "clearSearch"
        );


    if (searchInput) {
        searchInput.value = "";
    }


    if (sortSelect) {

        sortSelect.value =
            "default";

    }


    if (clearButton) {

        clearButton.classList.remove(
            "show"
        );

    }


    updateActiveCategory("All");

    displayMenuProducts();

}


/* =========================================
   UPDATE ACTIVE CATEGORY
========================================= */

function updateActiveCategory(
    category
) {

    const buttons =
        document.querySelectorAll(
            ".category-filter-btn"
        );


    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category
                === category
        );

    });

}


/* =========================================
   URL CATEGORY
========================================= */

function readCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    if (!category) {
        return;
    }


    const validCategories = [

        "All",
        "Burgers",
        "Pizza",
        "Fries",
        "Chicken",
        "Drinks",
        "Desserts"

    ];


    const matchedCategory =
        validCategories.find(
            item =>
                item.toLowerCase()
                === category.toLowerCase()
        );


    if (matchedCategory) {

        currentCategory =
            matchedCategory;


        updateActiveCategory(
            matchedCategory
        );

    }

}


/* =========================================
   BEST SELLERS
========================================= */

function setupBestSellerButton() {

    const button =
        document.getElementById(
            "bestSellerBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            currentCategory = "All";

            currentSearch = "";

            currentSort = "default";


            const products =
                getMenuProducts();


            const popularProducts =
                products.filter(
                    product =>
                        product.popular
                        &&
                        product.available
                );


            const container =
                document.getElementById(
                    "menuProducts"
                );


            const noProducts =
                document.getElementById(
                    "noProducts"
                );


            updateActiveCategory(
                "All"
            );


            document
                .querySelectorAll(
                    ".category-filter-btn"
                )
                .forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


            document
                .querySelector(
                    '[data-category="All"]'
                )
                .classList.add("active");


            if (popularProducts.length) {

                container.innerHTML =
                    popularProducts
                        .map(
                            createMenuProductCard
                        )
                        .join("");

                noProducts.classList.remove(
                    "show"
                );


                updateResultText(
                    popularProducts.length,
                    products.length
                );

            }


            document
                .querySelector(
                    ".menu-section"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        readCategoryFromURL();

        setupCategoryFilters();

        setupMenuSearch();

        setupSorting();

        setupBestSellerButton();


        const resetButton =
            document.getElementById(
                "resetFilters"
            );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetMenuFilters
            );

        }


        displayMenuProducts();

    }
);