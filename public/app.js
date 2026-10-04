const $ = (s) => document.querySelector(s);
const grid = $("#product-grid");
const search = $("#search");
const categoriesEl = $("#categories");
const empty = $("#empty-state");
const resultCount = $("#result-count");
const cartDrawer = $("#cart");
const cartItems = $("#cart-items");
const productModal = $("#product-modal");
const productModalMedia = $("#product-modal-media");
const productModalTitle = $("#product-modal-title");
const productModalCategory = $("#product-modal-category");
const productModalDescription = $("#product-modal-description");
const productModalPrice = $("#product-modal-price");
const productModalAdd = $("#product-modal-add");
const productQty = $("#product-qty");
const productQtyMinus = $("#product-qty-minus");
const productQtyPlus = $("#product-qty-plus");
const productColors = $("#product-colors");
const productColorWrap = $("#product-color-wrap");
const checkoutModal = $("#checkout-modal");
const customerForm = $("#customer-form");
const checkoutPaymentTotal = $("#checkout-payment-total");
const checkoutTotalStep1 = $("#checkout-total-step1");
const paymentOrderSummary = $("#payment-order-summary");
const successSummary = $("#success-summary");
let checkoutCustomer = null;

let activeProductId = null;
let selectedProductColor = "";
let selectedCategory = "הכל";
let cart = normalizeCart(JSON.parse(localStorage.getItem("3d-cart") || "[]"));

function productById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function defaultColor(id) {
  const p = productById(id);
  return p && Array.isArray(p.colors) && p.colors.length ? p.colors[0] : "";
}

function imageForColor(product, color) {
  return product?.images?.[color] || product?.image || "";
}

function installProductImageFallback(img, product) {
  if (!img || !product) return;
  img.addEventListener("error", () => {
    const fallback = product.image || "";
    const current = img.getAttribute("src") || "";
    if (fallback && current !== fallback) {
      img.setAttribute("src", fallback);
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.className = img.classList.contains("product-color-image")
      ? "product-image-fallback product-modal-fallback"
      : img.closest(".hero-real-card")
        ? "product-image-fallback hero-product-fallback"
        : "product-image-fallback";
    placeholder.innerHTML = `<span>3D</span><strong>${escapeHtml(product.name)}</strong>`;
    img.replaceWith(placeholder);
  });
}

function updateProductImage(product, color) {
  const src = imageForColor(product, color);
  productModalMedia.innerHTML = src
    ? `<img src="${src}" alt="${product.name}${color ? " בצבע " + color : ""}" class="product-color-image">`
    : `<div class="product-image-fallback product-modal-fallback"><span>3D</span><strong>${escapeHtml(product.name)}</strong></div>`;
  installProductImageFallback(productModalMedia.querySelector("img"), product);
}

function normalizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  if (raw.length && typeof raw[0] === "string") {
    const counts = {};
    raw.forEach(id => counts[id] = (counts[id] || 0) + 1);
    return Object.entries(counts).map(([id, qty]) => ({
      id,
      qty: Math.min(9, qty),
      color: defaultColor(id)
    }));
  }
  return raw
    .filter(x => x && x.id && productById(x.id))
    .map(x => {
      const product = productById(x.id);
      return {
        id: x.id,
        qty: Math.min(9, Math.max(1, Number(x.qty) || 1)),
        color: product?.colors?.includes(x.color) ? x.color : defaultColor(x.id)
      };
    });
}

document.title = SITE_SETTINGS.pageTitle;
$("#brand-name").textContent = SITE_SETTINGS.businessName;
$("#footer-brand").textContent = SITE_SETTINGS.businessName;
$("#year").textContent = new Date().getFullYear();

function waLink(message) {
  return `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function initRealHeroProducts() {
  document.querySelectorAll("[data-hero-image]").forEach(img => {
    const product = productById(img.dataset.heroImage);
    if (!product) return;
    // Use the product's stable default image in the hero. Some alternate
    // colour images are much smaller and can render partially on mobile.
    const preferredColor = {
      "home-tray-set":"שחור",
      "ribbed-planter":"שחור",
      "spiral-cone":"לבן",
      "cool-desk-animal":""
    }[product.id] || defaultColor(product.id);
    const src = imageForColor(product, preferredColor);
    installProductImageFallback(img, product);
    if (src) img.src = src;
  });

  document.querySelectorAll("[data-hero-product]").forEach(button => {
    button.addEventListener("click", () => openProductModal(button.dataset.heroProduct));
  });
}

const categories = ["הכל", ...new Set(PRODUCTS.map(p => p.category))];
categories.forEach(cat => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = cat;
  b.dataset.cat = cat;
  b.addEventListener("click", () => {
    selectedCategory = cat;
    document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x.dataset.cat === cat));
    renderProducts();
  });
  categoriesEl.appendChild(b);
});
document.querySelector(".chip")?.classList.add("active");

function productMatches(p) {
  const term = search.value.trim().toLowerCase();
  const byCat = selectedCategory === "הכל" || p.category === selectedCategory;
  const byText = !term || `${p.name} ${p.description} ${p.category} ${(p.colors || []).join(" ")}`.toLowerCase().includes(term);
  return byCat && byText;
}

function renderProducts() {
  const products = PRODUCTS.filter(productMatches);
  grid.innerHTML = "";
  empty.hidden = products.length !== 0;
  resultCount.textContent = `${products.length} מוצרים`;

  products.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    const cardImage = imageForColor(p, defaultColor(p.id));
    const media = cardImage
      ? `<img src="${cardImage}" alt="${p.name}" class="product-image">`
      : `<div class="product-placeholder" aria-hidden="true"><span>3D</span></div>`;

    card.setAttribute("tabindex","0");
    card.setAttribute("role","button");
    card.setAttribute("aria-label", `פתח פרטים על ${p.name}`);
    card.innerHTML = `
      ${media}
      <div class="product-content">
        <span class="category">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <strong>${formatPrice(p.priceValue)}</strong>
          <span class="card-action" aria-hidden="true">לפרטים</span>
        </div>
      </div>`;
    installProductImageFallback(card.querySelector("img.product-image"), p);
    card.addEventListener("click", () => openProductModal(p.id));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProductModal(p.id);
      }
    });
    grid.appendChild(card);
  });
}

function clampQty(value) {
  return Math.min(9, Math.max(1, Number(value) || 1));
}

function formatPrice(value) {
  return Number.isFinite(value) ? "₪" + value : "מחיר לא הוגדר";
}

function updateProductModalPrice() {
  const p = productById(activeProductId);
  if (!p || !Number.isFinite(p.priceValue)) {
    productModalPrice.textContent = "מחיר לא הוגדר";
    return;
  }
  const qty = clampQty(productQty.value);
  productQty.value = qty;
  productModalPrice.textContent = "₪" + p.priceValue + " × " + qty + " = ₪" + (p.priceValue * qty);
}

function renderColorOptions(p) {
  const colors = Array.isArray(p.colors) ? p.colors : [];
  productColorWrap.hidden = colors.length === 0;
  productColors.innerHTML = "";
  selectedProductColor = colors[0] || "";

  colors.forEach(color => {
    const src = imageForColor(p, color);
    if (src) {
      const preload = new Image();
      preload.src = src;
    }
  });

  colors.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-choice color-" + ({
      "שחור":"black","לבן":"white","ורוד":"pink","כחול":"blue","ירוק זית":"olive","ורוד כהה":"pink-dark","שמנת":"cream","זית":"olive","צהוב":"yellow","קשת":"rainbow"
    }[color] || "default") + (index === 0 ? " active" : "");
    button.innerHTML = `<span class="color-dot" aria-hidden="true"></span><span>${color}</span>`;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.addEventListener("click", () => {
      selectedProductColor = color;
      updateProductImage(p, color);
      productColors.querySelectorAll(".color-choice").forEach(x => {
        const active = x === button;
        x.classList.toggle("active", active);
        x.setAttribute("aria-pressed", active ? "true" : "false");
      });
    });
    productColors.appendChild(button);
  });
}

function openProductModal(id) {
  const p = productById(id);
  if (!p) return;
  activeProductId = id;
  productModalTitle.textContent = p.name;
  productModalCategory.textContent = p.category;
  productModalDescription.textContent = p.description;
  productModalAdd.disabled = !Number.isFinite(p.priceValue);
  productModalAdd.textContent = Number.isFinite(p.priceValue) ? "הוספה לסל" : "יש לעדכן מחיר";
  productQty.value = 1;
  renderColorOptions(p);
  updateProductImage(p, selectedProductColor);
  updateProductModalPrice();
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}

function closeProductModal() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
  activeProductId = null;
}

productQtyMinus.addEventListener("click", () => {
  productQty.value = clampQty(Number(productQty.value) - 1);
  updateProductModalPrice();
});
productQtyPlus.addEventListener("click", () => {
  productQty.value = clampQty(Number(productQty.value) + 1);
  updateProductModalPrice();
});
productQty.addEventListener("input", updateProductModalPrice);
productQty.addEventListener("change", updateProductModalPrice);

$("#product-modal-close").addEventListener("click", closeProductModal);
productModal.addEventListener("click", e => {
  if (e.target === productModal) closeProductModal();
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (productModal.classList.contains("open")) closeProductModal();
  if (checkoutModal?.classList.contains("open")) closeCheckout();
});

productModalAdd.addEventListener("click", () => {
  if (!activeProductId) return;
  const id = activeProductId;
  const qty = clampQty(productQty.value);
  const color = selectedProductColor || defaultColor(id);
  closeProductModal();
  addToCart(id, qty, color);
});

function addToCart(id, qty = 1, color = defaultColor(id)) {
  const product = productById(id);
  if (!product || !Number.isFinite(product.priceValue)) return;
  const existing = cart.find(item => item.id === id && item.color === color);
  if (existing) existing.qty = Math.min(9, existing.qty + qty);
  else cart.push({id, qty: Math.min(9, qty), color});
  saveCart();
  openCart();
}

function saveCart() {
  localStorage.setItem("3d-cart", JSON.stringify(cart));
  renderCart();
}

function cartSnapshot() {
  return cart
    .map(item => ({...item, product: productById(item.id)}))
    .filter(item => item.product);
}

function cartTotalValue() {
  return cartSnapshot().reduce((sum, item) => sum + ((Number(item.product.priceValue) || 0) * item.qty), 0);
}

const DELIVERY_FEE = 30;

function selectedDeliveryMethod() {
  return document.querySelector('input[name="delivery"]:checked')?.value || "משלוח";
}

function deliveryFeeValue() {
  return selectedDeliveryMethod() === "משלוח" ? DELIVERY_FEE : 0;
}

function checkoutGrandTotal() {
  return cartTotalValue() + deliveryFeeValue();
}

function setCheckoutStep(step) {
  document.querySelectorAll("[data-checkout-step]").forEach(pane => {
    const active = Number(pane.dataset.checkoutStep) === step;
    pane.hidden = !active;
    pane.classList.toggle("active", active);
  });
  document.querySelectorAll("[data-step-indicator]").forEach(indicator => {
    indicator.classList.toggle("active", Number(indicator.dataset.stepIndicator) <= step);
  });
  checkoutModal?.classList.toggle("payment-mode", step === 2);
  checkoutModal?.classList.toggle("success-mode", step === 3);
}

function renderPaymentSummary() {
  const items = cartSnapshot();
  const shipping = deliveryFeeValue();
  paymentOrderSummary.innerHTML = items.map(item => `
    <div class="payment-summary-line">
      <div>
        <strong>${escapeHtml(item.product.name)}</strong>
        ${item.color ? `<span>${escapeHtml(item.color)} · כמות ${item.qty}</span>` : `<span>כמות ${item.qty}</span>`}
      </div>
      <b>₪${item.product.priceValue * item.qty}</b>
    </div>
  `).join("") + `
    <div class="payment-summary-line">
      <div>
        <strong>משלוח</strong>
        <span>${selectedDeliveryMethod() === "משלוח" ? "משלוח לכתובת" : "איסוף עצמי"}</span>
      </div>
      <b>₪${shipping}</b>
    </div>
  `;

  const productsTotal = cartTotalValue();
  const grandTotal = checkoutGrandTotal();
  checkoutTotalStep1.textContent = "₪" + productsTotal;
  const shippingStep1 = $("#checkout-shipping-step1");
  const grandTotalStep1 = $("#checkout-grand-total-step1");
  if (shippingStep1) shippingStep1.textContent = "₪" + shipping;
  if (grandTotalStep1) grandTotalStep1.textContent = "₪" + grandTotal;
  checkoutPaymentTotal.textContent = "₪" + grandTotal;
}

function renderSuccessSummary() {
  const items = cartSnapshot();
  const shipping = deliveryFeeValue();
  const grandTotal = checkoutGrandTotal();
  const customer = checkoutCustomer || {};

  successSummary.innerHTML = `
    <div class="payment-summary-line">
      <div>
        <strong>פרטי לקוח</strong>
        <span>${escapeHtml(customer.name || "")} · ${escapeHtml(customer.phone || "")}</span>
        <span>${escapeHtml(customer.city || "")}${customer.address ? " · " + escapeHtml(customer.address) : ""}</span>
      </div>
    </div>
    ${items.map(item => `
      <div class="payment-summary-line">
        <div>
          <strong>${escapeHtml(item.product.name)}</strong>
          <span>${item.color ? escapeHtml(item.color) + " · " : ""}כמות ${item.qty}</span>
        </div>
        <b>₪${item.product.priceValue * item.qty}</b>
      </div>
    `).join("")}
    <div class="payment-summary-line">
      <div>
        <strong>${selectedDeliveryMethod() === "משלוח" ? "משלוח" : "איסוף עצמי"}</strong>
        <span>${selectedDeliveryMethod() === "משלוח" ? "דמי משלוח" : "ללא דמי משלוח"}</span>
      </div>
      <b>₪${shipping}</b>
    </div>
    <div class="payment-summary-line">
      <div><strong>סה״כ להזמנה</strong></div>
      <b>₪${grandTotal}</b>
    </div>
  `;
}

function openCheckout() {
  if (!cartSnapshot().length) return;
  closeCart();
  renderPaymentSummary();
  setCheckoutStep(1);
  checkoutModal.hidden = false;
  requestAnimationFrame(() => checkoutModal.classList.add("open"));
  checkoutModal.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  setTimeout(() => $("#customer-name")?.focus(), 180);
}

function closeCheckout() {
  if (!checkoutModal) return;
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden","true");
  setTimeout(() => {
    if (!checkoutModal.classList.contains("open")) checkoutModal.hidden = true;
  }, 180);
  document.body.classList.remove("no-scroll");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
}

function renderCart() {
  const items = cart
    .map((item, index) => ({...item, index, product: productById(item.id)}))
    .filter(item => item.product);

  const totalUnits = items.reduce((sum, item) => sum + item.qty, 0);
  const totalCost = items.reduce((sum, item) => sum + ((Number(item.product.priceValue) || 0) * item.qty), 0);
  $("#cart-count").textContent = totalUnits;
  $("#mobile-cart-count").textContent = totalUnits;
  cartItems.innerHTML = "";
  $("#cart-total").textContent = "₪" + totalCost;
  $("#cart-total-wrap").hidden = items.length === 0;

  if (!items.length) {
    cartItems.innerHTML = `<p class="cart-empty">הסל עדיין ריק. בחרו מוצרים שמעניינים אתכם.</p>`;
    return;
  }

  items.forEach(({product:p, qty, color, index}) => {
    const item = document.createElement("div");
    item.className = "cart-item";
    const cartImage = imageForColor(p, color);
    item.innerHTML = `
      ${cartImage ? `<img class="cart-item-thumb" src="${cartImage}" alt="${escapeHtml(p.name)} בצבע ${escapeHtml(color)}">` : ""}
      <div class="cart-item-info">
        <strong>${p.name}</strong>
        ${color ? `<span class="cart-option">צבע שנבחר: <strong>${escapeHtml(color)}</strong></span>` : ""}
        <span class="cart-line-total">${formatPrice(p.priceValue)} × ${qty} = <strong>₪${p.priceValue * qty}</strong></span>
        <div class="cart-qty">
          <button data-dec="${index}" aria-label="הפחת כמות">−</button>
          <span aria-label="כמות">${qty}</span>
          <button data-inc="${index}" aria-label="הגדל כמות">+</button>
        </div>
      </div>
      <button class="remove-item" aria-label="הסר ${p.name}" data-remove="${index}">✕</button>`;
    installProductImageFallback(item.querySelector("img.cart-item-thumb"), p);
    cartItems.appendChild(item);
  });

  document.querySelectorAll("[data-dec]").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.dec);
    const item = cart[i];
    if (!item) return;
    if (item.qty <= 1) cart.splice(i, 1);
    else item.qty -= 1;
    saveCart();
  }));
  document.querySelectorAll("[data-inc]").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.inc);
    const item = cart[i];
    if (!item) return;
    item.qty = Math.min(9, item.qty + 1);
    saveCart();
  }));
  document.querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => {
    cart.splice(Number(btn.dataset.remove), 1);
    saveCart();
  }));
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setQuickNavActive($("#mobile-cart"));
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

$("#cart-open").addEventListener("click", openCart);
$("#mobile-cart").addEventListener("click", () => {
  if (productModal.classList.contains("open")) closeProductModal();
  openCart();
});
$("#cart-close").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", e => { if (e.target === cartDrawer) closeCart(); });
$("#clear-cart").addEventListener("click", () => { cart = []; saveCart(); });
$("#search-focus").addEventListener("click", () => {
  closeCart();
  search.scrollIntoView({behavior: "smooth", block: "center"});
  setTimeout(() => search.focus(), 300);
});
search.addEventListener("input", renderProducts);

const checkoutStartButton = $("#send-order");
checkoutStartButton?.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  openCheckout();
});

$("#whatsapp-order").addEventListener("click", () => {
  const items = cartSnapshot();
  if (!items.length) return;
  const totalCost = cartTotalValue();
  const list = items.map((item, i) =>
    `${i+1}. ${item.product.name} — ₪${item.product.priceValue} × ${item.qty} = ₪${item.product.priceValue * item.qty} — צבע: ${item.color}`
  ).join("\n");

  window.open(waLink(`שלום, אני רוצה להזמין את המוצרים הבאים:\n${list}\n\nסה״כ עלות המוצרים: ₪${totalCost}\n\nאשמח להמשך הזמנה.`), "_blank");
});

document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener("change", renderPaymentSummary);
});

customerForm?.addEventListener("submit", e => {
  e.preventDefault();
  if (!customerForm.reportValidity()) return;

  const data = new FormData(customerForm);
  checkoutCustomer = {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    city: String(data.get("city") || "").trim(),
    address: String(data.get("address") || "").trim(),
    delivery: String(data.get("delivery") || "משלוח"),
    notes: String(data.get("notes") || "").trim()
  };

  localStorage.setItem("checkout-customer", JSON.stringify(checkoutCustomer));
  renderPaymentSummary();
  setCheckoutStep(2);
});

$("#checkout-confirm-order")?.addEventListener("click", () => {
  renderSuccessSummary();
  setCheckoutStep(3);
});

$("#checkout-back")?.addEventListener("click", () => setCheckoutStep(1));
$("#checkout-close")?.addEventListener("click", closeCheckout);
$("#success-close")?.addEventListener("click", closeCheckout);
checkoutModal?.addEventListener("click", e => {
  if (e.target === checkoutModal) closeCheckout();
});

const savedCustomer = JSON.parse(localStorage.getItem("checkout-customer") || "null");
if (savedCustomer) {
  $("#customer-name").value = savedCustomer.name || "";
  $("#customer-phone").value = savedCustomer.phone || "";
  $("#customer-city").value = savedCustomer.city || "";
  $("#customer-address").value = savedCustomer.address || "";
  $("#customer-notes").value = savedCustomer.notes || "";
  const radio = document.querySelector(`input[name="delivery"][value="${savedCustomer.delivery || "משלוח"}"]`);
  if (radio) radio.checked = true;
}

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (productModal.classList.contains("open")) closeProductModal();
    if (cartDrawer.classList.contains("open")) closeCart();
    setQuickNavActive(link);
  });
});

function setQuickNavActive(target) {
  document.querySelectorAll(".mobile-nav-btn").forEach(btn => btn.classList.remove("active"));
  if (target) target.classList.add("active");
}

const productsQuick = document.querySelector('.mobile-nav a[href="#products"]');
if (productsQuick) setQuickNavActive(productsQuick);

document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

initRealHeroProducts();
renderProducts();
renderCart();