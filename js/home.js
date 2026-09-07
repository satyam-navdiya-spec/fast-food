/* =========================================
   FASTBITE - HOME PAGE
========================================= */


/* =========================================
   GET PRODUCTS
========================================= */

function getProducts() {

    return getStorage(
        STORAGE_KEYS.PRODUCTS,
        defaultProducts
    );

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `

        <article class="product-card">

            <div class="product-image">

                ${
                    product.image
                    ? `<img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.style.display='none'; this.parentElement.innerHTML='🍔';"
                    >`
                    : "🍔"
                }

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <div class="product-rating">
                    ⭐ ${product.rating}
                </div>


                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price}
                    </span>


                    <button
                        class="add-cart-btn"
                        onclick="addToCart('${product.id}')"
                        aria-label="Add ${product.name} to cart"
                    >
                        +
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   DISPLAY POPULAR PRODUCTS
========================================= */

function displayPopularProducts() {

    const container =
        document.getElementById("popularProducts");

    if (!container) {
        return;
    }


    const products = getProducts();


    const popularProducts =
        products
            .filter(product => product.popular)
            .filter(product => product.available)
            .slice(0, 4);


    if (popularProducts.length === 0) {

        container.innerHTML = `
            <p class="loading">
                No popular products available.
            </p>
        `;

        return;
    }


    container.innerHTML =
        popularProducts
            .map(createProductCard)
            .join("");

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId) {

    const products = getProducts();

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return;
    }


    if (!product.available) {

        showToast(
            "This product is currently unavailable.",
            "error"
        );

        return;
    }


    const cart = getCart();


    const existingItem =
        cart.find(
            item => item.id === productId
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
   TOAST NOTIFICATION
========================================= */

function showToast(message, type = "success") {

    const existingToast =
        document.querySelector(".toast");

    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${type}`;


    toast.innerHTML = `

        <span>
            ${type === "success" ? "✓" : "!"}
        </span>

        <p>
            ${message}
        </p>

    `;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);

}


/* =========================================
   HOME PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayPopularProducts();

    }
);