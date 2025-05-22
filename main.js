
// Full JS rebuilt for TEAVY Marketplace
document.addEventListener('DOMContentLoaded', () => {
  // PMA Banner Auto-Hide
  const pmaBanner = document.querySelector('.pma-banner');
  let lastPmaScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (!pmaBanner) return;
    pmaBanner.classList.toggle('hide', currentScroll > lastPmaScroll && currentScroll > 100);
    lastPmaScroll = currentScroll <= 0 ? 0 : currentScroll;
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.toggle('active');
    });
  }

  // Header Scroll Behavior + Floating Footer + Navigation Highlight
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
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === 'index.html' ? '#e82f80' : '#006dd6';
      });
      if (window.location.hash && window.location.hash !== '#') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }
  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // Hero Carousel
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
    let next = (current + 1) % slides.length;
    showSlide(next);
  }, 7000);

  // Wallet Placeholder
  document.getElementById('connectWalletBtn')?.addEventListener('click', () => {
    alert('Wallet connected! (Placeholder)');
  });

  // PMA + Signup Modal Logic
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

  // Security Measures
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
  });
});
