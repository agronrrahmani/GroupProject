
const CART_KEY = "vantaCart";

// Get cart products from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Save cart products
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add products to the cart from shop.html
document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
    };

    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);

    button.textContent = "Added to Cart!";

    setTimeout(function () {
        button.textContent = "Add to Cart";
    }, 1000);
});

// Display cart products on cart.html
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const emptyCart = document.getElementById("empty-cart");

    if (!cartItems || !cartTotal) return;

    const cart = getCart();

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        if (emptyCart) {
            emptyCart.hidden = false;
        }

        cartTotal.textContent = "$0.00";
        return;
    }

    if (emptyCart) {
        emptyCart.hidden = true;
    }

    cart.forEach(function (product) {
        const item = document.createElement("div");
        item.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const details = document.createElement("div");
        details.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "$" + product.price.toFixed(2);

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + product.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.dataset.action = "increase";
        increase.dataset.id = product.id;
        increase.className = "quantity-btn";

        const decrease = document.createElement("button");
        decrease.textContent = "-";
        decrease.dataset.action = "decrease";
        decrease.dataset.id = product.id;
        decrease.className = "quantity-btn";

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.dataset.action = "remove";
        remove.dataset.id = product.id;
        remove.className = "remove-btn";

        const subtotal = document.createElement("p");
        subtotal.textContent =
            "Subtotal: $" +
            (product.price * product.quantity).toFixed(2);

        details.append(
            name,
            price,
            quantity,
            increase,
            decrease,
            remove,
            subtotal
        );

        item.append(image, details);
        cartItems.appendChild(item);
    });

 // totali i cmimit
    const total = cart.reduce(function (sum, product) {
        return sum + product.price * product.quantity;
    }, 0);

    cartTotal.textContent = "$" + total.toFixed(2);
}

document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    let cart = getCart();
    const product = cart.find(item => item.id === id);

    if (!product) return;

    if (action === "increase") {
        product.quantity++;
    }

    if (action === "decrease") {
        product.quantity--;

        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart(cart);
    renderCart();
});

document.addEventListener("click", function (event) {
    if (event.target.id === "clear-cart") {
        localStorage.removeItem(CART_KEY);
        renderCart();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});
