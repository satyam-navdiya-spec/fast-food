/* =========================================
   FASTBITE - MAIN JAVASCRIPT
========================================= */


/* =========================================
   LOCAL STORAGE KEYS
========================================= */

const STORAGE_KEYS = {

    CART: "fastfood_cart",

    ORDERS: "fastfood_orders",

    USERS: "fastfood_users",

    PRODUCTS: "fastfood_products",

    CURRENT_USER: "fastfood_current_user",

    ADMIN_SESSION: "fastfood_admin_logged_in"

};


/* =========================================
   LOCAL STORAGE HELPERS
========================================= */


/*
    Get data from localStorage
*/

function getStorage(key, defaultValue = null) {

    try {

        const data = localStorage.getItem(key);

        if (data === null) {
            return defaultValue;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("LocalStorage read error:", error);

        return defaultValue;
    }
}


/*
    Save data to localStorage
*/

function setStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error("LocalStorage save error:", error);

        return false;
    }
}


/*
    Remove data from localStorage
*/

function removeStorage(key) {

    localStorage.removeItem(key);

}


/* =========================================
   PRODUCT INITIALIZATION
========================================= */

function initializeProducts() {

    const existingProducts =
        localStorage.getItem(STORAGE_KEYS.PRODUCTS);

    /*
        Only create default products
        if products don't already exist.
    */

    if (!existingProducts) {

        setStorage(
            STORAGE_KEYS.PRODUCTS,
            defaultProducts
        );

    }

}


/* =========================================
   CART
========================================= */

function getCart() {

    return getStorage(
        STORAGE_KEYS.CART,
        []
    );

}


function saveCart(cart) {

    setStorage(
        STORAGE_KEYS.CART,
        cart
    );

    updateCartCount();

}


/*
    Calculate total quantity
*/

function getCartItemCount() {

    const cart = getCart();

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


/*
    Update cart icon count
*/

function updateCartCount() {

    const cartCount =
        document.querySelector(".cart-count");

    if (!cartCount) {
        return;
    }

    cartCount.textContent =
        getCartItemCount();

}


/* =========================================
   MOBILE NAVIGATION
========================================= */

function setupMobileNavigation() {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");


    if (!menuButton || !mobileNav) {
        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            mobileNav.classList.toggle("show");

        }
    );

}


/* =========================================
   CURRENT YEAR
========================================= */

function updateCurrentYear() {

    const yearElement =
        document.getElementById("currentYear");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProducts();

        updateCartCount();

        setupMobileNavigation();

        updateCurrentYear();

    }
);