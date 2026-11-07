/* ==========================================================
   JUICY WORLD – MAIN SCRIPT
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. STICKY NAVBAR & SCROLL-TO-TOP BUTTON
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* --------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
  -------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  // Close mobile drawer when clicking any link
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });


  /* --------------------------------------------------------
     3. DARK / LIGHT THEME TOGGLE
  -------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Check for saved user preference
  const savedTheme = localStorage.getItem('juicy_theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('juicy_theme', newTheme);
  });


  /* --------------------------------------------------------
     4. MENU CATEGORY FILTER TABS
  -------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tabs .tab');
  const menuCards = document.querySelectorAll('.menu-grid .menu-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* --------------------------------------------------------
     5. SIDE-SLIDING SHOPPING CART SYSTEM
  -------------------------------------------------------- */
  let cart = [];

  const cartTrigger = document.getElementById('cartTrigger');
  const cartBadge = document.getElementById('cartBadge');
  const cartModal = document.getElementById('cartModal');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModalBody = document.getElementById('cartModalBody');
  const modalCartCount = document.getElementById('modalCartCount');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Open & Close Cart Drawer
  const openCart = () => {
    cartModal.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartModal.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  cartTrigger.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);

  // Add Item to Cart
  document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');

      const existingIndex = cart.findIndex(item => item.id === id);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ id, name, price, img, quantity: 1 });
      }

      renderCart();
      
      // Visual feedback on button
      btn.textContent = 'Added ✓';
      btn.style.backgroundColor = '#27ae60';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = '+ Add';
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1000);
    });
  });

  // Quantity Management & Item Removal within Cart Drawer
  cartModalBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');
    if (!id) return;

    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    if (target.classList.contains('qty-plus')) {
      cart[itemIndex].quantity += 1;
    } else if (target.classList.contains('qty-minus')) {
      cart[itemIndex].quantity -= 1;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
    } else if (target.classList.contains('remove-item')) {
      cart.splice(itemIndex, 1);
    }

    renderCart();
  });

  // Render Cart UI State (Without Total Amount)
  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadge.textContent = totalItems;
    modalCartCount.textContent = `(${totalItems})`;

    if (cart.length === 0) {
      cartModalBody.innerHTML = `
        <div class="empty-cart-view" style="text-align: center; padding: 40px 20px; color: #888;">
          <p class="empty-emoji" style="font-size: 48px; margin-bottom: 10px;">🍹</p>
          <p class="empty-text" style="font-size: 15px;">Your cart is currently empty.</p>
        </div>
      `;
      return;
    }

    cartModalBody.innerHTML = cart.map(item => `
      <div class="cart-item-row" style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <img src="${item.img}" alt="${item.name}" class="cart-item-thumb" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;" />
        <div class="cart-item-details" style="flex: 1;">
          <h4 class="cart-item-title" style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.name}</h4>
          <span class="cart-item-price" style="font-size: 13px; color: #e67e22; font-weight: 500;">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
          <div class="cart-qty-controls" style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
            <button class="qty-btn qty-minus" data-id="${item.id}" style="width: 22px; height: 22px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 4px; cursor: pointer;">-</button>
            <span class="qty-val" style="font-size: 13px; font-weight: 600;">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" style="width: 22px; height: 22px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 4px; cursor: pointer;">+</button>
          </div>
        </div>
        <button class="remove-item" data-id="${item.id}" aria-label="Remove item" style="background: none; border: none; font-size: 18px; color: #999; cursor: pointer; padding: 4px;">&times;</button>
      </div>
    `).join('');
  }

  // Checkout Action Handler
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add some delicious juices first.');
      return;
    }
    alert('Thank you for your order! Redirecting to checkout...');
    cart = [];
    renderCart();
    closeCart();
  });


  /* --------------------------------------------------------
     6. TESTIMONIALS SLIDER & DOTS GENERATOR
  -------------------------------------------------------- */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testiDots');
  
  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    
    // Create dots matching number of testimonial cards
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('testi-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        updateActiveDot(idx);
      });
      dotsContainer.appendChild(dot);
    });

    function updateActiveDot(activeIndex) {
      const allDots = dotsContainer.querySelectorAll('.testi-dot');
      allDots.forEach((d, i) => {
        if (i === activeIndex) d.classList.add('active');
        else d.classList.remove('active');
      });
    }
  }


  /* --------------------------------------------------------
     7. CONTACT FORM SUBMISSION HANDLER
  -------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show success feedback
      formSuccess.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    });
  }


  /* --------------------------------------------------------
     8. HERO 3D TILT & FLOATING PARALLAX (HERO ONLY)
  -------------------------------------------------------- */
  const heroSection = document.getElementById('home');
  const hero3dScene = document.getElementById('hero3dScene');
  const floatingItems = document.querySelectorAll('.hero-floating-elements .floating-item');

  if (heroSection && hero3dScene && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);

      targetTiltY = mouseX * 8;   // Max 8deg rotation
      targetTiltX = -mouseY * 6;  // Max 6deg rotation
    });

    heroSection.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    function renderParallax() {
      // Smooth interpolation (lerp)
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      hero3dScene.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

      // Subtle parallax shift for floating botanical elements
      floatingItems.forEach((item) => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 1;
        const moveX = (currentTiltY * speed * 1.5).toFixed(1);
        const moveY = (-currentTiltX * speed * 1.5).toFixed(1);
        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

});
