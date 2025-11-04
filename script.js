// script.js - Main JavaScript file for the Elegant Fashion Shop

// Sample product data
const products = [
  {
    id: 1,
    name: "Leather Oxford Shoes",
    price: 129990,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80"
  },
  {
    id: 2,
    name: "Silk Blouse",
    price: 89990,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
  },
  {
    id: 3,
    name: "Wool Trousers",
    price: 99990,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 4,
    name: "Suede Loafers",
    price: 109990,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 5,
    name: "Cashmere Sweater",
    price: 149990,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
  },
  {
    id: 6,
    name: "Designer Handbag",
    price: 199990,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
  }
];

// Cart array to store items
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartIcon = document.getElementById('cartIcon');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const filterButtons = document.querySelectorAll('.filter-btn');
const tailoringForm = document.getElementById('tailoringForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadCartFromLocalStorage();
  renderProducts(products);
  updateCartUI();
  
  // Event Listeners
  cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    cartModal.show();
  });
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter products
      const filter = this.getAttribute('data-filter');
      filterProducts(filter);
    });
  });
  
  tailoringForm.addEventListener('submit', function(e) {
    e.preventDefault();
    validateTailoringForm();
  });
  
  document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert('Thank you for your purchase!');
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    cartModal.hide();
  });
});

// Render products to the page
function renderProducts(productsToShow) {
  productsContainer.innerHTML = '';
  
  if (productsToShow.length === 0) {
    productsContainer.innerHTML = '<p class="text-center">No products found.</p>';
    return;
  }
  
  productsToShow.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-4 col-sm-6';
    productCard.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="product-price mt-auto">UGX ${product.price.toLocaleString()}</p>
          <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });
  
  // Add event listeners to the new "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      addToCart(productId);
    });
  });
}

// Filter products by category
function filterProducts(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filteredProducts = products.filter(product => product.category === category);
    renderProducts(filteredProducts);
  }
}

// Add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return;
  
  // Check if product is already in cart
  const existingItem = cart.find(item => item.id === productId);
  
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
  
  saveCartToLocalStorage();
  updateCartUI();
  
  // Show confirmation
  showToast(`Added ${product.name} to cart!`);
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalCount;
  
  // Update cart modal
  renderCartItems();
  
  // Update cart total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toLocaleString();
}

// Render cart items in modal
function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p id="emptyCartMessage" class="text-center">Your cart is empty</p>';
    return;
  }
  
  cartItems.innerHTML = '';
  
  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <div class="row align-items-center">
        <div class="col-3">
          <img src="${item.image}" class="img-fluid" alt="${item.name}">
        </div>
        <div class="col-5">
          <h6>${item.name}</h6>
          <p class="mb-0">UGX ${item.price.toLocaleString()}</p>
        </div>
        <div class="col-2">
          <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" aria-label="Quantity for ${item.name}">
        </div>
        <div class="col-2 text-end">
          <span class="remove-item" data-id="${item.id}" role="button" tabindex="0" aria-label="Remove ${item.name} from cart">&times;</span>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItemElement);
  });
  
  // Add event listeners for quantity inputs
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const id = parseInt(this.getAttribute('data-id'));
      const quantity = parseInt(this.value);
      
      if (isNaN(quantity) || quantity <= 0) {
        removeFromCart(id);
      } else {
        updateCartItemQuantity(id, quantity);
      }
    });
  });
  
  // Add event listeners for remove buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      removeFromCart(id);
    });
    
    // Add keyboard support for remove buttons
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = parseInt(this.getAttribute('data-id'));
        removeFromCart(id);
      }
    });
  });
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToLocalStorage();
  updateCartUI();
  
  // Show confirmation
  const product = products.find(p => p.id === productId);
  if (product) {
    showToast(`${product.name} removed from cart`);
  }
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCartToLocalStorage();
    updateCartUI();
  }
}

// Validate tailoring form
function validateTailoringForm() {
  const customerName = document.getElementById('customerName').value.trim();
  const email = document.getElementById('email').value.trim();
  const serviceType = document.getElementById('serviceType').value;
  const appointmentDate = document.getElementById('appointmentDate').value;
  
  if (!customerName || !email || !serviceType || !appointmentDate) {
    alert('Please fill in all required fields.');
    return false;
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }
  
  // Check if appointment date is in the future
  const today = new Date().toISOString().split('T')[0];
  if (appointmentDate < today) {
    alert('Please select a future date for your appointment.');
    return false;
  }
  
  // If all validations pass
  alert('Thank you for your booking! We will contact you shortly to confirm your appointment.');
  tailoringForm.reset();
  return true;
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

// Show toast notification
function showToast(message) {
  // Remove any existing toasts
  document.querySelectorAll('.toast').forEach(toast => toast.remove());
  
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', function() {
    document.body.removeChild(toast);
  });
}
