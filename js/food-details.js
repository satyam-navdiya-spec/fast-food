/* =========================================================
   FASTBITE - FOOD DETAILS
   ========================================================= */


   let currentFood = null;
   let selectedQuantity = 1;
   
   
   /* =========================================================
      GET PRODUCTS
      ========================================================= */
   
   function getFoodProducts() {
   
       const storedProducts = getStorage(
           STORAGE_KEYS.PRODUCTS,
           null
       );
   
       if (storedProducts && Array.isArray(storedProducts)) {
           return storedProducts;
       }
   
       return defaultProducts;
   }
   
   
   /* =========================================================
      GET PRODUCT ID FROM URL
      ========================================================= */
   
   function getProductIdFromURL() {
   
       const params = new URLSearchParams(
           window.location.search
       );
   
       return params.get("id");
   }
   
   
   /* =========================================================
      FIND PRODUCT
      ========================================================= */
   
   function findFoodProduct() {
   
       const productId = getProductIdFromURL();
   
       if (!productId) {
           return null;
       }
   
       const products = getFoodProducts();
   
       return products.find(
           product => String(product.id) === String(productId)
       );
   }
   
   
   /* =========================================================
      GENERATE STARS
      ========================================================= */
   
   function generateStars(rating) {
   
       const roundedRating = Math.round(Number(rating) || 0);
   
       let stars = "";
   
       for (let i = 1; i <= 5; i++) {
   
           if (i <= roundedRating) {
               stars += "★";
           } else {
               stars += "☆";
           }
   
       }
   
       return stars;
   }
   
   
   /* =========================================================
      LOAD PRODUCT DETAILS
      ========================================================= */
   
   function loadFoodDetails() {
   
       currentFood = findFoodProduct();
   
       const loading = document.getElementById("detailsLoading");
       const details = document.getElementById("foodDetails");
       const notFound = document.getElementById("detailsNotFound");
   
       if (!currentFood) {
   
           loading.style.display = "none";
           details.style.display = "none";
           notFound.style.display = "block";
   
           return;
       }
   
   
       /* Hide loading */
   
       loading.style.display = "none";
   
       /* Show details */
   
       details.style.display = "grid";
   
       notFound.style.display = "none";
   
   
       /* =====================================================
          BASIC INFORMATION
          ===================================================== */
   
       const foodImage = document.getElementById("foodImage");
       const foodName = document.getElementById("foodName");
       const foodCategory = document.getElementById("foodCategory");
       const foodPrice = document.getElementById("foodPrice");
       const foodDescription =
           document.getElementById("foodDescription");
   
       const foodRating =
           document.getElementById("foodRating");
   
       const foodStars =
           document.getElementById("foodStars");
   
       const breadcrumbProduct =
           document.getElementById("breadcrumbProduct");
   
   
       /* Image */
   
       if (currentFood.image) {
   
           foodImage.src = currentFood.image;
   
           foodImage.alt = currentFood.name;
   
       } else {
   
           foodImage.style.display = "none";
   
           const imageBox =
               document.querySelector(
                   ".food-details-image-box"
               );
   
           imageBox.classList.add(
               "food-details-no-image"
           );
   
           imageBox.innerHTML += `
               <div class="details-image-placeholder">
                   🍔
               </div>
           `;
       }
   
   
       /* Name */
   
       foodName.textContent = currentFood.name;
   
   
       /* Category */
   
       foodCategory.textContent =
           currentFood.category || "Food";
   
   
       /* Price */
   
       foodPrice.textContent =
           Number(currentFood.price).toFixed(0);
   
   
       /* Description */
   
       foodDescription.textContent =
           currentFood.description ||
           "A delicious food item prepared with fresh ingredients.";
   
   
       /* Rating */
   
       const rating =
           Number(currentFood.rating || 0);
   
       foodRating.textContent =
           rating.toFixed(1);
   
       foodStars.textContent =
           generateStars(rating);
   
   
       /* Breadcrumb */
   
       breadcrumbProduct.textContent =
           currentFood.name;
   
   
       /* Page title */
   
       document.title =
           `${currentFood.name} | FastBite`;
   
   
       /* =====================================================
          POPULAR BADGE
          ===================================================== */
   
       const badge =
           document.getElementById("foodBadge");
   
       if (currentFood.popular) {
   
           badge.style.display = "inline-flex";
   
       } else {
   
           badge.style.display = "none";
   
       }
   
   
       /* =====================================================
          AVAILABILITY
          ===================================================== */
   
       updateFoodAvailability();
   
   
       /* =====================================================
          RESET QUANTITY
          ===================================================== */
   
       selectedQuantity = 1;
   
       updateQuantity();
   
   
       /* =====================================================
          RELATED PRODUCTS
          ===================================================== */
   
       loadRelatedProducts();
   }
   
   
   /* =========================================================
      AVAILABILITY
      ========================================================= */
   
   function updateFoodAvailability() {
   
       const availability =
           document.getElementById(
               "foodAvailability"
           );
   
       const addButton =
           document.getElementById(
               "addDetailsCartBtn"
           );
   
       if (currentFood.available) {
   
           availability.textContent =
               "✓ Available";
   
           availability.className =
               "food-availability available";
   
           addButton.disabled = false;
   
           addButton.innerHTML =
               "🛒 Add to Cart";
   
       } else {
   
           availability.textContent =
               "✕ Currently Unavailable";
   
           availability.className =
               "food-availability unavailable";
   
           addButton.disabled = true;
   
           addButton.innerHTML =
               "Unavailable";
   
       }
   }
   
   
   /* =========================================================
      QUANTITY
      ========================================================= */
   
   function updateQuantity() {
   
       const quantityElement =
           document.getElementById("quantity");
   
       quantityElement.textContent =
           selectedQuantity;
   
   
       const decreaseButton =
           document.getElementById("decreaseQty");
   
       decreaseButton.disabled =
           selectedQuantity <= 1;
   }
   
   
   /* =========================================================
      INCREASE QUANTITY
      ========================================================= */
   
   function increaseQuantity() {
   
       if (selectedQuantity >= 20) {
   
           showToast(
               "Maximum quantity is 20",
               "warning"
           );
   
           return;
       }
   
       selectedQuantity++;
   
       updateQuantity();
   }
   
   
   /* =========================================================
      DECREASE QUANTITY
      ========================================================= */
   
   function decreaseQuantity() {
   
       if (selectedQuantity <= 1) {
           return;
       }
   
       selectedQuantity--;
   
       updateQuantity();
   }
   
   
   /* =========================================================
      ADD TO CART
      ========================================================= */
   
   function addFoodToCart() {
   
       if (!currentFood) {
           return;
       }
   
   
       if (!currentFood.available) {
   
           showToast(
               "This item is currently unavailable",
               "error"
           );
   
           return;
       }
   
   
       const cart = getCart();
   
   
       const existingItem =
           cart.find(
               item =>
                   String(item.id) ===
                   String(currentFood.id)
           );
   
   
       if (existingItem) {
   
           existingItem.quantity +=
               selectedQuantity;
   
       } else {
   
           cart.push({
   
               id: currentFood.id,
   
               name: currentFood.name,
   
               price: Number(currentFood.price),
   
               image: currentFood.image || "",
   
               quantity: selectedQuantity
   
           });
   
       }
   
   
       saveCart(cart);
   
   
       showToast(
           `${selectedQuantity} × ${currentFood.name} added to cart`,
           "success"
       );
   
   
       /* Update cart count */
   
       if (typeof updateCartCount === "function") {
           updateCartCount();
       }
   }
   
   
   /* =========================================================
      RELATED PRODUCTS
      ========================================================= */
   
   function loadRelatedProducts() {
   
       const relatedSection =
           document.getElementById(
               "relatedSection"
           );
   
       const relatedContainer =
           document.getElementById(
               "relatedProducts"
           );
   
       const products = getFoodProducts();
   
   
       const relatedProducts =
           products
               .filter(product => {
   
                   return (
                       String(product.id) !==
                           String(currentFood.id) &&
   
                       product.category ===
                           currentFood.category &&
   
                       product.available !== false
                   );
   
               })
               .slice(0, 4);
   
   
       if (relatedProducts.length === 0) {
   
           relatedSection.style.display =
               "none";
   
           return;
       }
   
   
       relatedSection.style.display =
           "block";
   
   
       relatedContainer.innerHTML =
           relatedProducts
               .map(createRelatedProductCard)
               .join("");
   }
   
   
   /* =========================================================
      RELATED PRODUCT CARD
      ========================================================= */
   
   function createRelatedProductCard(product) {
   
       const imageHTML = product.image
           ? `
               <img
                   src="${product.image}"
                   alt="${product.name}"
                   loading="lazy"
               >
           `
           : `
               <div class="related-image-placeholder">
                   🍔
               </div>
           `;
   
   
       return `
   
           <article class="related-product-card">
   
               <a
                   href="food-details.html?id=${product.id}"
                   class="related-product-image"
               >
   
                   ${imageHTML}
   
               </a>
   
   
               <div class="related-product-info">
   
                   <span class="related-product-category">
                       ${product.category || "Food"}
                   </span>
   
                   <h3>
                       <a
                           href="food-details.html?id=${product.id}"
                       >
                           ${product.name}
                       </a>
                   </h3>
   
   
                   <div class="related-rating">
   
                       <span>
                           ${generateStars(product.rating)}
                       </span>
   
                       <strong>
                           ${Number(product.rating || 0).toFixed(1)}
                       </strong>
   
                   </div>
   
   
                   <div class="related-bottom">
   
                       <strong class="related-price">
                           ₹${Number(product.price).toFixed(0)}
                       </strong>
   
                       <button
                           type="button"
                           class="related-add-btn"
                           onclick="addRelatedProductToCart('${product.id}')"
                       >
                           + Add
                       </button>
   
                   </div>
   
               </div>
   
           </article>
   
       `;
   }
   
   
   /* =========================================================
      ADD RELATED PRODUCT
      ========================================================= */
   
   function addRelatedProductToCart(productId) {
   
       const products = getFoodProducts();
   
       const product =
           products.find(
               item =>
                   String(item.id) ===
                   String(productId)
           );
   
   
       if (!product) {
           return;
       }
   
   
       if (!product.available) {
   
           showToast(
               "This item is currently unavailable",
               "error"
           );
   
           return;
       }
   
   
       const cart = getCart();
   
   
       const existingItem =
           cart.find(
               item =>
                   String(item.id) ===
                   String(product.id)
           );
   
   
       if (existingItem) {
   
           existingItem.quantity++;
   
       } else {
   
           cart.push({
   
               id: product.id,
   
               name: product.name,
   
               price: Number(product.price),
   
               image: product.image || "",
   
               quantity: 1
   
           });
   
       }
   
   
       saveCart(cart);
   
   
       showToast(
           `${product.name} added to cart`,
           "success"
       );
   
   
       if (typeof updateCartCount === "function") {
           updateCartCount();
       }
   }
   
   
   /* =========================================================
      SETUP QUANTITY CONTROLS
      ========================================================= */
   
   function setupQuantityControls() {
   
       const decrease =
           document.getElementById(
               "decreaseQty"
           );
   
       const increase =
           document.getElementById(
               "increaseQty"
           );
   
   
       decrease.addEventListener(
           "click",
           decreaseQuantity
       );
   
   
       increase.addEventListener(
           "click",
           increaseQuantity
       );
   }
   
   
   /* =========================================================
      SETUP ADD TO CART
      ========================================================= */
   
   function setupDetailsCart() {
   
       const button =
           document.getElementById(
               "addDetailsCartBtn"
           );
   
   
       button.addEventListener(
           "click",
           addFoodToCart
       );
   }
   
   
   /* =========================================================
      INITIALIZE
      ========================================================= */
   
   document.addEventListener(
       "DOMContentLoaded",
       function () {
   
           loadFoodDetails();
   
           setupQuantityControls();
   
           setupDetailsCart();
   
       }
   );