
// Auto-hide PMA banner on scroll down
const pmaBanner = document.querySelector('.pma-banner');
let lastPmaScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (!pmaBanner) return;
  pmaBanner.classList.toggle('hide', currentScroll > lastPmaScroll && currentScroll > 100);
  lastPmaScroll = Math.max(currentScroll, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle?.addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.nav-links')?.classList.toggle('active');
  });

  let lastScroll = 0;
  const header = document.querySelector('.header');

  function updateActiveNav() {
    if (!header) return;
    const currentScroll = window.scrollY;
    const isDesktop = window.innerWidth > 768;
    header.classList.toggle('hidden', isDesktop && currentScroll > lastScroll && currentScroll > 50);
    lastScroll = Math.max(currentScroll, 0);

    const floatingFooter = document.getElementById('floatingFooter');
    const productCarousel = document.querySelector('.product-carousel');
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
          const hash = link.getAttribute('href')?.substring(1);
          link.style.color = hash === id ? '#e82f80' : '#006dd6';
          if (hash === id && window.location.hash !== `#${id}`) {
            history.replaceState(null, null, `#${id}`);
          }
        });
      }
    });

    if (currentScroll === 0) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === 'index.html' ? '#e82f80' : '#006dd6';
      });
      if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // Modal logic
  const signupModal = document.querySelector('.signup-modal');
  const pmaAccessModal = document.getElementById('pmaAccessModal');
  const closeSignupModal = signupModal?.querySelector('.close-modal');
  const closePMAAccessModal = pmaAccessModal?.querySelector('.close-modal');
  const confirmPMAAccess = document.getElementById('confirmPMAAccess');
  const signupForm = document.getElementById('signup-form');

  function openSignupModal() {
    try {
      signupModal?.showModal();
    } catch {
      signupModal?.setAttribute('open', 'true');
      signupModal.style.display = 'block';
    }
    document.body.classList.add('modal-open');
  }

  function closeAllModals() {
    pmaAccessModal && (pmaAccessModal.style.display = 'none');
    signupModal?.close?.();
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.signup-btn, #footerJoinButton').forEach(btn => {
    btn.addEventListener('click', () => {
      const isMember = localStorage.getItem('teavyPmaMember') === 'true';
      isMember ? openSignupModal() : (pmaAccessModal.style.display = 'block');
    });
  });

  confirmPMAAccess?.addEventListener('click', () => {
    const agreed = document.getElementById('agreePMA')?.checked;
    if (!agreed) {
      alert('Please agree to the PMA Membership Terms to proceed.');
      return;
    }
    localStorage.setItem('teavyPmaMember', 'true');
    pmaAccessModal.style.display = 'none';
    setTimeout(() => openSignupModal(), 100);
  });

  closePMAAccessModal?.addEventListener('click', () => {
    pmaAccessModal.style.display = 'none';
  });

  closeSignupModal?.addEventListener('click', () => {
    signupModal?.close?.();
    document.body.classList.remove('modal-open');
  });

  signupModal?.addEventListener('cancel', e => {
    e.preventDefault();
    signupModal.close();
    document.body.classList.remove('modal-open');
  });

  signupModal?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });

  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    const termsCheckbox = signupForm.querySelector('input[name="terms"]');
    if (!termsCheckbox?.checked) {
      alert('Please agree to the Terms and Conditions to proceed.');
      return;
    }
    const username = e.target.username.value;
    const email = e.target.email.value;
    alert(`Registration successful for ${username}! (This is a demo. Email: ${email})`);
    signupModal?.close?.();
    document.body.classList.remove('modal-open');
    signupForm.reset();
  });
});
