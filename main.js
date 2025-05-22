// TEAVY Marketplace Full JavaScript (main.js)
document.addEventListener('DOMContentLoaded', () => {
  // === PMA Banner Auto-Hide ===
  const pmaBanner = document.querySelector('.pma-banner');
  let lastPmaScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (!pmaBanner) return;
    pmaBanner.classList.toggle('hide', currentScroll > lastPmaScroll && currentScroll > 100);
    lastPmaScroll = currentScroll <= 0 ? 0 : currentScroll;
  });

  // === Mobile Menu Toggle ===
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.toggle('active');
    });
  }

  // === Scroll-Based Header and Footer Behavior ===
  let lastScroll = 0;
  const header = document.querySelector('.header');
  const floatingFooter = document.getElementById('floatingFooter');
  const productCarousel = document.querySelector('.product-carousel');
  function updateActiveNav() {
    if (!header) return;
    const currentScroll = window.scrollY;
    const isDesktop = window.innerWidth > 768;
    header.classList.toggle('hidden', isDesktop && currentScroll > lastScroll && currentScroll > 50);
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;

    if (floatingFooter && productCarousel) {
      const carouselTop = productCarousel.getBoundingClientRect().top + window.scrollY;
      floatingFooter.classList.toggle('show', window.scrollY + window.innerHeight > carouselTop + 50);
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute('id');
      if (currentScroll >= sectionTop && currentScroll < sectionBottom && id) {
        navLinks.forEach(link => {
          const linkTarget = link.getAttribute('href');
          const linkHash = (linkTarget && linkTarget.startsWith('#')) ? linkTarget.substring(1) : null;
          const isActive = linkHash === id;
          link.style.color = isActive ? '#e82f80' : '#006dd6';
          if (isActive && id && window.location.hash !== `#${id}`) {
            history.replaceState(null, null, `#${id}`);
          }
        });
      }
    });

    if (currentScroll === 0) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.color = link.getAttribute('href') === 'index.html' ? '#e82f80' : '#006dd6';
      });
      if (window.location.hash && window.location.hash !== '#') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }
  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // === Hero Carousel ===
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-pagination .dot');
  let current = 0;
  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      dots[i].classList.toggle('active', i === index);
    });
    current = index;
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(index);
    });
  });
  setInterval(() => {
    showSlide((current + 1) % slides.length);
  }, 7000);

  // === Wallet Placeholder ===
  document.getElementById('connectWalletBtn')?.addEventListener('click', () => {
    alert('Wallet connected! (Placeholder)');
  });

  // === PMA + Signup Modal Logic ===
  const signupModal = document.querySelector('.signup-modal');
  const pmaAccessModal = document.getElementById('pmaAccessModal');
  const closeSignupModal = signupModal?.querySelector('.close-modal');
  const closePMAAccessModal = pmaAccessModal?.querySelector('.close-modal');
  const confirmPMAAccess = document.getElementById('confirmPMAAccess');
  const signupForm = document.getElementById('signup-form');

  function openSignupModal() {
    if (!signupModal) return;
    try {
      signupModal.showModal();
    } catch {
      signupModal.setAttribute('open', 'true');
      signupModal.style.display = 'block';
    }
    document.body.classList.add('modal-open');
  }

  function closeAllModals() {
    if (pmaAccessModal) pmaAccessModal.style.display = 'none';
    if (signupModal?.close) signupModal.close();
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.signup-btn, #footerJoinButton').forEach(button => {
    button.addEventListener('click', () => {
      const isMember = localStorage.getItem('teavyPmaMember') === 'true';
      if (!isMember) {
        pmaAccessModal.style.display = 'block';
      } else {
        openSignupModal();
      }
    });
  });

  confirmPMAAccess?.addEventListener('click', () => {
    const agreed = document.getElementById('agreePMA')?.checked;
    if (!agreed) return alert('Please agree to the PMA Membership Terms to proceed.');
    localStorage.setItem('teavyPmaMember', 'true');
    pmaAccessModal.style.display = 'none';
    setTimeout(openSignupModal, 100);
  });

  closePMAAccessModal?.addEventListener('click', () => pmaAccessModal.style.display = 'none');
  closeSignupModal?.addEventListener('click', () => closeAllModals());

  if (signupModal) {
    signupModal.addEventListener('cancel', e => {
      e.preventDefault();
      closeAllModals();
    });
    signupModal.addEventListener('close', () => document.body.classList.remove('modal-open'));
  }

  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    const termsCheckbox = signupForm.querySelector('input[name="terms"]');
    if (!termsCheckbox?.checked) return alert('Please agree to the Terms and Conditions to proceed.');
    const username = e.target.username.value;
    const email = e.target.email.value;
    alert(`Registration successful for ${username}! (This is a demo. Email: ${email})`);
    closeAllModals();
    signupForm.reset();
  });

  // === Google Calendar Integration (Placeholder) ===
  // Placeholder to be updated with working API logic

  // === Filter System for Marketplace ===
  const filterSelect = document.querySelector('.filter-select');
  const filterSelectMobile = document.querySelector('.filter-select-mobile');
  const subfilterOptions = document.querySelector('.subfilter-options');
  const subfilterSelectMobile = document.querySelector('.subfilter-select-mobile');
  const productPreviews = document.querySelectorAll('.product-preview');
  const locationCheckboxes = document.querySelectorAll('.subfilter-options input[name="location"]');

  function applyFilters(category, locations = []) {
    productPreviews.forEach(preview => {
      const productCategory = preview.getAttribute('data-category');
      const productLocation = preview.getAttribute('data-location') || 'online';
      const matchesCategory = category === 'all' || productCategory === category;
      const matchesLocation = category !== 'services' || locations.length === 0 || locations.includes(productLocation);
      preview.style.display = matchesCategory && matchesLocation ? 'block' : 'none';
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      const category = filterSelect.value;
      if (subfilterOptions) subfilterOptions.style.display = category === 'services' ? 'block' : 'none';
      if (category !== 'services') locationCheckboxes.forEach(cb => cb.checked = false);
      applyFilters(category);
    });
  }

  locationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const category = filterSelect.value;
      const locations = Array.from(locationCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
      applyFilters(category, locations);
    });
  });

  if (filterSelectMobile) {
    filterSelectMobile.addEventListener('change', () => {
      const category = filterSelectMobile.value;
      if (subfilterSelectMobile) subfilterSelectMobile.style.display = category === 'services' ? 'inline-block' : 'none';
      applyFilters(category);
    });
  }

  if (subfilterSelectMobile) {
    subfilterSelectMobile.addEventListener('change', () => {
      const category = filterSelectMobile.value;
      const location = subfilterSelectMobile.value;
      applyFilters(category, location ? [location] : []);
    });
  }

  // === Filter Sidebar Toggle ===
  const filterSidebar = document.querySelector('.filter-sidebar');
  const filterToggle = document.querySelector('.filter-toggle');
  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      filterSidebar?.classList.toggle('active');
    });
  }

  // === Responsive Layout Adjustment for Filters ===
  function updateFilterLayout() {
    const mobileFilterContainer = document.querySelector('.mobile-filter-container');
    if (!mobileFilterContainer || !filterSidebar || !subfilterOptions) return;
    const isMobile = window.innerWidth <= 768;
    filterSidebar.style.display = isMobile ? 'none' : 'block';
    mobileFilterContainer.style.display = isMobile ? 'flex' : 'none';
    if (isMobile) {
      subfilterSelectMobile.style.display = filterSelectMobile?.value === 'services' ? 'inline-block' : 'none';
    } else {
      subfilterOptions.style.display = filterSelect?.value === 'services' ? 'block' : 'none';
    }
  }
  window.addEventListener('resize', updateFilterLayout);
  updateFilterLayout();

  // === Developer Console Blocking ===
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
  });
});
