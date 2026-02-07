/**
 * Tea & Coffee Shop POS
 */

// รูปสินค้า — แมปรูปให้ตรงกับของ (จากโฟลเดอร์ images)
const IMG = (n) => 'images/img' + n + '.png';

// เมนูจาก menu.pdf + รูปตรงกับของ
const products = {
  coffee: [
    { id: 'espresso', name: 'เอสเปรสโซ่', price: 45, image: IMG(12) },
    { id: 'cappuccino', name: 'คาปูชิโน่', price: 45, image: IMG(7) },
    { id: 'latte', name: 'ลาเต้', price: 45, image: IMG(4) },
    { id: 'americano', name: 'อเมริกาโน่', price: 40, image: IMG(5) },
    { id: 'coconut-americano', name: 'อเมริกาโน่มะพร้าว', price: 45, image: IMG(6) },
    { id: 'honey-americano', name: 'อเมริกาโน่น้ำผึ้ง', price: 45, image: IMG(5) },
    { id: 'mocha', name: 'มอคค่า', price: 45, image: IMG(12) },
    { id: 'orange-americano', name: 'อเมริกาโน่ส้ม', price: 45, image: IMG(8) },
    { id: 'pure-matcha', name: 'เพียวมัทฉะ', price: 50, image: IMG(2) },
    { id: 'matcha-latte', name: 'มัทฉะลาเต้', price: 55, image: IMG(3) },
    { id: 'coconut-matcha-latte', name: 'มัทฉะมะพร้าว', price: 55, image: IMG(15) },
  ],
  tea: [
    { id: 'thai-tea', name: 'ชาไทย', price: 30, image: IMG(1) },
    { id: 'green-tea', name: 'ชาเขียว', price: 30, image: IMG(10) },
    { id: 'black-tea', name: 'ชาดำเย็น', price: 30, image: IMG(5) },
    { id: 'lemon-tea', name: 'ชามะนาว', price: 30, image: IMG(13) },
  ],
  milk: [
    { id: 'pink-milk', name: 'นมชมพู', price: 35, image: IMG(14) },
    { id: 'cocoa', name: 'โกโก้', price: 45, image: IMG(9) },
  ],
kaosoi: [
    { id: 'soi2', name: 'ข้าวซอยหมู', price: 75, image: IMG(14) },
    { id: 'soi1', name: 'ข้าวซอยไก่', price: 65, image: IMG(9) },
  ],
  soda: [
    { id: 'red-lime-soda', name: 'แดงมะนาวโซดา', price: 30, image: IMG(23) },
    { id: 'blue-hawaii-soda', name: 'บลูฮาวายมะนาวโซดา', price: 30, image: IMG(26) },
    { id: 'honey-lime-soda', name: 'น้ำผึ้งมะนาวโซดา', price: 30, image: IMG(27) },
    { id: 'apple-soda', name: 'แอปเปิ้ลโซดา', price: 30, image: IMG(24) },
    { id: 'orange-soda', name: 'ส้มโซดา', price: 30, image: IMG(25) },
    { id: 'strawberry-soda', name: 'สตรอเบอร์รี่โซดา', price: 30, image: IMG(30) },
    { id: 'blueberry-soda', name: 'บลูเบอร์รี่โซดา', price: 30, image: IMG(21) },
    { id: 'strawberry-yogurt', name: 'สตรอเบอร์รี่โยเกิร์ต', price: 30, image: IMG(16) },
    { id: 'orange-yogurt', name: 'ส้มโยเกิร์ต', price: 30, image: IMG(17) },
    { id: 'mango-yogurt', name: 'มะม่วงโยเกิร์ต', price: 30, image: IMG(18) },
    { id: 'pineapple-yogurt', name: 'สับปะรดโยเกิร์ต', price: 30, image: IMG(19) },
    { id: 'mix-berry-yogurt', name: 'มิกซ์เบอร์รี่โยเกิร์ต', price: 30, image: IMG(20) },
  ],
};

let cart = [];
let orderNumber = 1001;
let currentCategory = 'coffee';

// DOM
const currentDateEl = document.getElementById('currentDate');
const orderNumberEl = document.getElementById('orderNumber');
const categoryBtns = document.querySelectorAll('.category-btn');
const productsGrid = document.getElementById('productsGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const totalEl = document.getElementById('total');
const clearCartBtn = document.getElementById('clearCart');
const completeOrderBtn = document.getElementById('completeOrder');
const holdOrderBtn = document.getElementById('holdOrder');
const receiptModal = document.getElementById('receiptModal');
const receiptOrderNum = document.getElementById('receiptOrderNum');
const receiptDate = document.getElementById('receiptDate');
const receiptItemsEl = document.getElementById('receiptItems');
const receiptTotal = document.getElementById('receiptTotal');
const printReceiptBtn = document.getElementById('printReceipt');
const newOrderBtn = document.getElementById('newOrder');

function formatMoney(n) {
  return '฿' + Number(n).toFixed(2);
}

function setDate() {
  const d = new Date();
  currentDateEl.textContent = d.toLocaleDateString('th-TH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function renderProducts() {
  const items = products[currentCategory] || [];
  productsGrid.innerHTML = items
    .map(
      (p) => {
        const imgSrc = p.image || '';
        return `
    <button type="button" class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${imgSrc}">
      <img class="product-img" src="${imgSrc}" alt="${p.name}" loading="lazy">
      <p class="product-name">${p.name}</p>
      <p class="product-price">${formatMoney(p.price)}</p>
    </button>
  `;
      }
    )
    .join('');

  productsGrid.querySelectorAll('.product-card').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(btn.dataset));
  });
}

function addToCart({ id, name, price, image }) {
  const numPrice = parseFloat(price);
  const existing = cart.find((i) => i.id === id && i.price === numPrice);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: numPrice, qty: 1, image: image || '' });
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateQty(index, delta) {
  const item = cart[index];
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(index);
  else renderCart();
}

function renderCart() {
  cartEmptyEl.style.display = cart.length ? 'none' : 'block';
  cartItemsEl.querySelectorAll('.cart-item').forEach((el) => el.remove());

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    const imgHtml = item.image ? `<img class="cart-item-img" src="${item.image}" alt="">` : '<span class="cart-item-img-placeholder"></span>';
    li.innerHTML = `
      ${imgHtml}
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatMoney(item.price)} × ${item.qty}</div>
      </div>
      <div class="cart-item-qty">
        <button type="button" aria-label="Decrease">−</button>
        <span>${item.qty}</span>
        <button type="button" aria-label="Increase">+</button>
      </div>
    `;
    const lineTotal = item.price * item.qty;
    const dec = li.querySelector('.cart-item-qty button:first-child');
    const inc = li.querySelector('.cart-item-qty button:last-child');
    dec.addEventListener('click', () => updateQty(index, -1));
    inc.addEventListener('click', () => updateQty(index, 1));
    cartItemsEl.appendChild(li);
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatMoney(total);
}

function clearCart() {
  cart = [];
  renderCart();
}

function showReceipt() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  receiptOrderNum.textContent = orderNumber;
  receiptDate.textContent = new Date().toLocaleString('th-TH');
  receiptItemsEl.innerHTML = cart
    .map(
      (i) =>
        `<div class="receipt-item"><span>${i.name} × ${i.qty}</span><span>${formatMoney(i.price * i.qty)}</span></div>`
    )
    .join('');
  receiptTotal.textContent = formatMoney(total);

  receiptModal.setAttribute('aria-hidden', 'false');
}

function closeReceipt() {
  receiptModal.setAttribute('aria-hidden', 'true');
}

const ORDERS_STORAGE_KEY = 'tea-coffee-pos-orders';
const ORDER_NUMBER_KEY = 'tea-coffee-pos-orderNumber';
const LAST_ORDER_DATE_KEY = 'tea-coffee-pos-lastOrderDate';

function saveOrder() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = {
    orderNumber,
    date: new Date().toISOString(),
    items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
    total,
    status: 'pending', // รอจ่าย → จ่ายแล้ว ใน Admin
  };
  const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(ORDER_NUMBER_KEY, String(orderNumber));
  localStorage.setItem(LAST_ORDER_DATE_KEY, today);
}

const confirmOrderModal = document.getElementById('confirmOrderModal');
const confirmOrderList = document.getElementById('confirmOrderList');
const confirmTotal = document.getElementById('confirmTotal');
const confirmOrderCancel = document.getElementById('confirmOrderCancel');
const confirmOrderOk = document.getElementById('confirmOrderOk');

function openConfirmOrderModal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  confirmOrderList.innerHTML = cart
    .map(
      (i) =>
        `<div class="confirm-order-item"><span>${i.name} × ${i.qty}</span><span>${formatMoney(i.price * i.qty)}</span></div>`
    )
    .join('');
  confirmTotal.innerHTML = `<span>รวมทั้งหมด</span><span>${formatMoney(total)}</span>`;
  confirmOrderModal.setAttribute('aria-hidden', 'false');
}

function closeConfirmOrderModal() {
  confirmOrderModal.setAttribute('aria-hidden', 'true');
}

function completeOrder() {
  if (cart.length === 0) return;
  openConfirmOrderModal();
}

function newOrder() {
  orderNumber += 1;
  orderNumberEl.textContent = orderNumber;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(ORDER_NUMBER_KEY, String(orderNumber));
  localStorage.setItem(LAST_ORDER_DATE_KEY, today);
  cart = [];
  renderCart();
  closeReceipt();
}

function holdOrder() {
  if (cart.length === 0) return;
  // In a full POS you'd save to a "held orders" list; here we just clear for next
  if (confirm('ถือรายการนี้และเริ่มออเดอร์ใหม่? (รายการปัจจุบันจะถูกล้าง)')) {
    orderNumber += 1;
    orderNumberEl.textContent = orderNumber;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(ORDER_NUMBER_KEY, String(orderNumber));
    localStorage.setItem(LAST_ORDER_DATE_KEY, today);
    clearCart();
  }
}

function printReceipt() {
  window.print();
}

// Category tabs
categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

clearCartBtn.addEventListener('click', clearCart);
completeOrderBtn.addEventListener('click', completeOrder);

confirmOrderCancel.addEventListener('click', () => {
  closeConfirmOrderModal();
});

confirmOrderOk.addEventListener('click', () => {
  closeConfirmOrderModal();
  saveOrder();
  showReceipt();
});

confirmOrderModal.addEventListener('click', (e) => {
  if (e.target === confirmOrderModal) closeConfirmOrderModal();
});
holdOrderBtn.addEventListener('click', holdOrder);
printReceiptBtn.addEventListener('click', printReceipt);
newOrderBtn.addEventListener('click', newOrder);

receiptModal.addEventListener('click', (e) => {
  if (e.target === receiptModal) closeReceipt();
});

// Init: เริ่มวันใหม่ให้ reset คิวเป็น 1001
const today = new Date().toISOString().slice(0, 10);
const lastOrderDate = localStorage.getItem(LAST_ORDER_DATE_KEY);
if (lastOrderDate !== today) {
  orderNumber = 1001;
  orderNumberEl.textContent = orderNumber;
  localStorage.setItem(ORDER_NUMBER_KEY, '1001');
  localStorage.setItem(LAST_ORDER_DATE_KEY, today);
} else {
  const savedOrderNum = localStorage.getItem(ORDER_NUMBER_KEY);
  if (savedOrderNum) {
    orderNumber = parseInt(savedOrderNum, 10);
    orderNumberEl.textContent = orderNumber;
  }
}
setDate();
renderProducts();
renderCart();
