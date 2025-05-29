// Auto-hide PMA banner on scroll down
const pmaBanner = document.querySelector('.pma-banner');
let lastPmaScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (!pmaBanner) return;

  if (currentScroll > lastPmaScroll && currentScroll > 100) {
    pmaBanner.classList.add('hide'); // hide banner
  } else {
    pmaBanner.classList.remove('hide'); // show banner
  }

  lastPmaScroll = currentScroll <= 0 ? 0 : currentScroll;
});

    document.addEventListener('DOMContentLoaded', () => {
      // Toggle mobile menu
      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', function() {
          this.classList.toggle('active');
          const navLinks = document.querySelector('.nav-links');
          if (navLinks) navLinks.classList.toggle('active');
        });
      }

// Show/hide header on scroll and update navigation highlighting
let lastScroll = 0;
const header = document.querySelector('.header');

function updateActiveNav() {
  if (!header) return;

  const currentScroll = window.scrollY;
  const isDesktop = window.innerWidth > 768;

if (isDesktop && currentScroll > lastScroll && currentScroll > 50) {
  header.classList.add('hidden');
} else {
  header.classList.remove('hidden');
}
  lastScroll = currentScroll <= 0 ? 0 : currentScroll;

const floatingFooter = document.getElementById('floatingFooter');
const productCarousel = document.querySelector('.product-carousel');

if (floatingFooter && productCarousel) {
  const carouselTop = productCarousel.getBoundingClientRect().top + window.scrollY;
  
  // Show when the product carousel is about to enter the viewport
  if (window.scrollY + window.innerHeight > carouselTop + 50) {
    floatingFooter.classList.add('show');
  } else {
    floatingFooter.classList.remove('show');
  }
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

        // Only update hash if it's valid and different
        if (isActive && id && window.location.hash !== `#${id}`) {
          history.replaceState(null, null, `#${id}`);
        }
      });
    }
  });

  // Top of page — reset styles and remove hash
  if (currentScroll === 0) {
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === 'index.html' ? '#e82f80' : '#006dd6';
    });

    // Cleanly remove the hash from the URL without reloading
    if (window.location.hash && window.location.hash !== '#') {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// === PMA + Signup Modal Logic (Final, Clean) ===

const signupModal = document.querySelector('.signup-modal');
const pmaAccessModal = document.getElementById('pmaAccessModal');
const closeSignupModal = signupModal?.querySelector('.close-modal');
const closePMAAccessModal = pmaAccessModal?.querySelector('.close-modal');
const confirmPMAAccess = document.getElementById('confirmPMAAccess');
const signupForm = document.getElementById('signup-form');

function openSignupModal() {
  if (signupModal) {
    try {
      signupModal.showModal();
    } catch (err) {
      // Fallback for browsers that don't fully support <dialog>
      signupModal.setAttribute('open', 'true');
      signupModal.style.display = 'block';
    }
    document.body.classList.add('modal-open');
  }
}


function closeAllModals() {
  if (pmaAccessModal) pmaAccessModal.style.display = 'none';
  if (signupModal?.close) signupModal.close();
  document.body.classList.remove('modal-open');
}

// Attach handler to all signup-related buttons
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

// Confirm PMA Agreement
confirmPMAAccess?.addEventListener('click', () => {
  const agreed = document.getElementById('agreePMA')?.checked;
  if (!agreed) {
    alert('Please agree to the PMA Membership Terms to proceed.');
    return;
  }

  localStorage.setItem('teavyPmaMember', 'true');

  // If signupModal is a <dialog>, close pmaAccess first, then open with delay
  pmaAccessModal.style.display = 'none';

  setTimeout(() => {
    try {
      signupModal?.showModal();
    } catch (err) {
      signupModal?.setAttribute('open', 'true');
      signupModal.style.display = 'block';
    }
    document.body.classList.add('modal-open');
  }, 100); // Delay ensures browser finishes rendering/display toggles
});


// Close PMA Modal
closePMAAccessModal?.addEventListener('click', () => {
  pmaAccessModal.style.display = 'none';
});

// Close Signup Modal
closeSignupModal?.addEventListener('click', () => {
  if (signupModal) {
    if (typeof signupModal.close === 'function') {
      signupModal.close();
    } else {
      signupModal.removeAttribute('open');
      signupModal.style.display = 'none';
    }
    document.body.classList.remove('modal-open');
  }
});

// Prevent focus freeze
if (signupModal) {
  signupModal.addEventListener('cancel', e => {
    e.preventDefault();
    signupModal.close();
    document.body.classList.remove('modal-open');
  });

  signupModal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });
}

// Signup form
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

  signupModal?.close();
  document.body.classList.remove('modal-open');
  signupForm.reset();
});

      // Event Calendar Functionality with Google Calendar Sync
      let currentDate = new Date(2025, 4, 1);

      async function fetchGoogleCalendarEvents() {
        const apiKey = 'YOUR_API_KEY';
        const calendarId = 'YOUR_CALENDAR_ID';
        const timeMin = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        const timeMax = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

        try {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
          );
          const data = await response.json();
          return data.items || [];
        } catch (error) {
          console.error('Error fetching Google Calendar events:', error);
          return [];
        }
      }

      function renderCalendar() {
        const monthYear = document.getElementById('month-year');
        const calendarGrid = document.querySelector('.calendar-grid');
        const eventList = document.getElementById('event-list');
        const eventsHeading = document.getElementById('events-heading');

        if (!monthYear || !calendarGrid || !eventList || !eventsHeading) return;

        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header));

        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        eventsHeading.textContent = `Events in ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= totalDays; day++) {
          const dayDiv = document.createElement('div');
          dayDiv.className = 'calendar-day';
          dayDiv.textContent = day;
          calendarGrid.appendChild(dayDiv);
        }

        fetchGoogleCalendarEvents().then(events => {
          eventList.innerHTML = '';
          if (events.length === 0) {
            const noEvent = document.createElement('li');
            noEvent.textContent = 'No events this month.';
            eventList.appendChild(noEvent);
          } else {
            events.forEach(event => {
              const start = new Date(event.start.dateTime || event.start.date);
              if (start.getMonth() === currentDate.getMonth()) {
                const eventItem = document.createElement('li');
                eventItem.innerHTML = `<strong>${start.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })}:</strong> ${event.summary} - ${event.description || 'No description'}`;
                eventList.appendChild(eventItem);

                const eventDay = calendarGrid.querySelector(`.calendar-day:nth-child(${firstDay + start.getDate() + 1})`);
                if (eventDay) eventDay.classList.add('event-day');
              }
            });
          }
        });
      }

      renderCalendar();

      const prevMonth = document.getElementById('prev-month');
      const nextMonth = document.getElementById('next-month');

      if (prevMonth) {
        prevMonth.addEventListener('click', () => {
          currentDate.setMonth(currentDate.getMonth() - 1);
          renderCalendar();
        });
      }

      if (nextMonth) {
        nextMonth.addEventListener('click', () => {
          currentDate.setMonth(currentDate.getMonth() + 1);
          renderCalendar();
        });
      }

      // Filter Functionality (Desktop and Mobile)
      const filterSelect = document.querySelector('.filter-select');
      const filterSelectMobile = document.querySelector('.filter-select-mobile');
      const subfilterOptions = document.querySelector('.subfilter-options');
      const subfilterSelectMobile = document.querySelector('.subfilter-select-mobile');
      const productPreviews = document.querySelectorAll('.product-preview');
      const locationCheckboxes = document.querySelectorAll('.subfilter-options input[name="location"]');

      if (filterSelect) {
        filterSelect.addEventListener('change', () => {
          const selectedCategory = filterSelect.value;
          if (subfilterOptions) {
            subfilterOptions.style.display = selectedCategory === 'services' ? 'block' : 'none';
          }

          productPreviews.forEach(preview => {
            const category = preview.getAttribute('data-category');
            if (selectedCategory === 'all' || selectedCategory === category) {
              preview.style.display = 'block';
            } else {
              preview.style.display = 'none';
            }
          });

          if (selectedCategory !== 'services') {
            locationCheckboxes.forEach(checkbox => {
              checkbox.checked = false;
            });
          }
        });
      }

      locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const selectedLocations = Array.from(locationCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

          productPreviews.forEach(preview => {
            if (preview.getAttribute('data-category') === 'services') {
              const location = preview.getAttribute('data-location') || 'online';
              if (selectedLocations.length === 0 || selectedLocations.includes(location)) {
                preview.style.display = preview.style.display === 'none' ? 'block' : 'block';
              } else {
                preview.style.display = 'none';
              }
            }
          });
        });
      });

      if (filterSelectMobile) {
        filterSelectMobile.addEventListener('change', () => {
          const selectedCategory = filterSelectMobile.value;
          if (subfilterSelectMobile) {
            subfilterSelectMobile.style.display = selectedCategory === 'services' ? 'inline-block' : 'none';
          }

          productPreviews.forEach(preview => {
            const category = preview.getAttribute('data-category');
            if (selectedCategory === 'all' || selectedCategory === category) {
              preview.style.display = 'block';
            } else {
              preview.style.display = 'none';
            }
          });

          if (selectedCategory !== 'services' && subfilterSelectMobile) {
            subfilterSelectMobile.value = '';
          }
        });
      }

      if (subfilterSelectMobile) {
        subfilterSelectMobile.addEventListener('change', () => {
          const selectedLocation = subfilterSelectMobile.value;
          productPreviews.forEach(preview => {
            if (preview.getAttribute('data-category') === 'services') {
              const location = preview.getAttribute('data-location') || 'online';
              if (selectedLocation === '' || selectedLocation === location) {
                preview.style.display = preview.style.display === 'none' ? 'block' : 'block';
              } else {
                preview.style.display = 'none';
              }
            }
          });
        });
      }

      const filterSidebar = document.querySelector('.filter-sidebar');
      const filterToggle = document.querySelector('.filter-toggle');

      if (filterToggle) {
        filterToggle.addEventListener('click', () => {
          if (filterSidebar) {
            filterSidebar.classList.toggle('active');
            console.log('Filter sidebar toggled, active:', filterSidebar.classList.contains('active'));
          }
        });
      }

      function updateFilterLayout() {
        const mobileFilterContainer = document.querySelector('.mobile-filter-container');
        if (!mobileFilterContainer || !filterSidebar || !subfilterOptions) return;

        if (window.innerWidth <= 768) {
          filterSidebar.style.display = 'none';
          mobileFilterContainer.style.display = 'flex';
          const subfilterSelectMobile = document.querySelector('.subfilter-select-mobile');
          if (subfilterSelectMobile && filterSelectMobile) {
            subfilterSelectMobile.style.display = filterSelectMobile.value === 'services' ? 'inline-block' : 'none';
          }
        } else {
          filterSidebar.style.display = 'block';
          mobileFilterContainer.style.display = 'none';
          if (filterSelect) {
            subfilterOptions.style.display = filterSelect.value === 'services' ? 'block' : 'none';
          }
        }
      }

      window.addEventListener('resize', updateFilterLayout);
      updateFilterLayout();

      if (filterSelect && filterSelect.value === 'services' && subfilterOptions) {
        subfilterOptions.style.display = 'block';
      }
      if (filterSelectMobile && filterSelectMobile.value === 'services' && subfilterSelectMobile) {
        subfilterSelectMobile.style.display = 'inline-block';
      }

      document.addEventListener('contextmenu', event => event.preventDefault());
      document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
      });
    });
  


document.addEventListener('DOMContentLoaded', () => {
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
  
  // Add this inside main.js after the DOM loads
const track = document.querySelector('.carousel-track');
let startX = 0;

if (track) {
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;
    track.scrollLeft += diff;
    startX = e.touches[0].clientX;
  });
}
});

document.getElementById('connectWalletBtn')?.addEventListener('click', () => {
  alert('Wallet connected! (Placeholder)');
  // Future: Trigger Web3Modal or OAuth2 wallet login
});


// Enable horizontal swipe on product carousel
(function() {
  const carouselTrack = document.querySelector('.carousel-track');
  if (!carouselTrack) return;

  let startX = 0;
  let scrollLeft = 0;
  let isDown = false;

  carouselTrack.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - carouselTrack.offsetLeft;
    scrollLeft = carouselTrack.scrollLeft;
  });

  carouselTrack.addEventListener('touchend', () => {
    isDown = false;
  });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - carouselTrack.offsetLeft;
    const walk = (x - startX) * 2; // sensitivity
    carouselTrack.scrollLeft = scrollLeft - walk;
  });
})();


// Add class to body if JS is enabled
document.body.classList.add('js-enabled');

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark) {
    document.body.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  themeToggle?.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeIcon(e.matches ? 'dark' : 'light');
    }
  });
});

// Wallet connection with ethers.js
document.addEventListener('DOMContentLoaded', () => {
  const connectWalletBtn = document.getElementById('connectWalletBtn');
  const liveRegion = document.getElementById('live-region');

  connectWalletBtn?.addEventListener('click', async () => {
    if (!window.ethereum) {
      liveRegion.textContent = 'No wallet detected.';
      alert('Please install MetaMask.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      liveRegion.textContent = `Wallet connected: ${address}`;
      alert(`Wallet connected: ${address}`);
    } catch (error) {
      console.error('Wallet connection error:', error);
      liveRegion.textContent = 'Failed to connect wallet.';
      alert('Wallet connection failed.');
    }
  });
});
