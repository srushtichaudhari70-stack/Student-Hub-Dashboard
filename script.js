/**
 * Student Dashboard — script.js
 * Handles: sidebar toggle, active nav, stat counters,
 *          skill bar animations, greeting, and smooth UX.
 */

// =========================================================
// 1. ELEMENT REFERENCES
// =========================================================
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('overlay');
const hamburger     = document.getElementById('hamburger');
const closeSidebar  = document.getElementById('closeSidebar');
const navLinks      = document.querySelectorAll('.nav-link[data-section]');
const statValues    = document.querySelectorAll('.stat-value[data-target]');
const skillFills    = document.querySelectorAll('#skills .skill-fill[data-width]');
const pageTitle     = document.querySelector('.page-title');

// =========================================================
// 2. SIDEBAR TOGGLE (mobile)
// =========================================================

/** Open the sidebar and show the overlay */
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

/** Close the sidebar and hide the overlay */
function closeSidebarFn() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFn);
overlay.addEventListener('click', closeSidebarFn);

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebarFn();
});

// =========================================================
// 3. ACTIVE NAV LINK + PAGE TITLE UPDATE
// =========================================================

/**
 * Map section IDs to human-readable page titles shown in the topbar.
 */
const sectionTitles = {
  dashboard : 'Dashboard',
  courses   : 'Courses',
  projects  : 'Projects',
  skills    : 'Skills',
  profile   : 'Profile',
};

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all links
    navLinks.forEach((l) => l.classList.remove('active'));

    // Add active to clicked link
    link.classList.add('active');

    // Update topbar page title
    const section = link.dataset.section;
    pageTitle.textContent = sectionTitles[section] || 'Dashboard';

    // Scroll to the corresponding section
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      closeSidebarFn();
    }
  });
});

// =========================================================
// 4. HIGHLIGHT ACTIVE NAV ON SCROLL (Intersection Observer)
// =========================================================

/**
 * Watch each section. When it enters the viewport, highlight
 * the matching sidebar nav link and update the topbar title.
 */
const sectionIds = ['dashboard', 'projects', 'skills', 'profile'];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Update active nav link
        navLinks.forEach((l) => {
          l.classList.toggle('active', l.dataset.section === id);
        });

        // Update topbar title
        pageTitle.textContent = sectionTitles[id] || 'Dashboard';
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px', // triggers when section is in the middle
  }
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// =========================================================
// 5. ANIMATED STAT COUNTER
// =========================================================

/**
 * Counts a number element from 0 up to its data-target value.
 * Uses requestAnimationFrame for smooth animation.
 *
 * @param {HTMLElement} el   - The element to animate
 * @param {number}      duration - Animation duration in ms
 */
function animateCounter(el, duration = 1200) {
  const target = parseInt(el.dataset.target, 10);
  const start  = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target; // ensure exact final value
    }
  }

  requestAnimationFrame(update);
}

/**
 * Start counters when the stats section scrolls into view.
 * Use a one-shot observer so the animation only plays once.
 */
const statsGrid = document.querySelector('.stats-grid');

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statValues.forEach((el) => animateCounter(el));
        observer.disconnect(); // only run once
      }
    });
  },
  { threshold: 0.3 }
);

if (statsGrid) counterObserver.observe(statsGrid);

// =========================================================
// 6. ANIMATED SKILL BARS
// =========================================================

/**
 * Animate skill-fill bars by setting their width to the
 * data-width attribute value when they scroll into view.
 */
const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillFills.forEach((fill) => {
          fill.style.width = fill.dataset.width + '%';
        });
        observer.disconnect(); // only animate once
      }
    });
  },
  { threshold: 0.2 }
);

if (skillsSection) skillObserver.observe(skillsSection);

// =========================================================
// 6b. ANIMATED LEARNING PROGRESS BARS
// =========================================================

/**
 * Same scroll-triggered animation as skill bars, but targets
 * the Learning Progress section's .lp-fill elements.
 */
const lpSection = document.getElementById('learning-progress');
const lpFills   = document.querySelectorAll('.lp-fill[data-width]');

const lpObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        lpFills.forEach((fill) => {
          fill.style.width = fill.dataset.width + '%';
        });
        observer.disconnect(); // only animate once
      }
    });
  },
  { threshold: 0.2 }
);

if (lpSection) lpObserver.observe(lpSection);

// =========================================================
// 7. DYNAMIC GREETING (time-based)
// =========================================================

/**
 * Returns a greeting string based on the current hour.
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Update the welcome heading with a time-appropriate greeting
const welcomeHeading = document.querySelector('.welcome-text h2');
if (welcomeHeading) {
  welcomeHeading.textContent = `${getGreeting()}, Srushti! 👋`;
}

// =========================================================
// 8. NOTIFICATION BUTTON (simple toggle demo)
// =========================================================

const notificationBtn = document.querySelector('.notification-btn');
const badge           = document.querySelector('.badge');

if (notificationBtn && badge) {
  notificationBtn.addEventListener('click', () => {
    // Simulate clearing notifications on click
    const current = parseInt(badge.textContent, 10);

    if (current > 0) {
      badge.textContent = current - 1;
      if (current - 1 === 0) {
        badge.style.display = 'none';
      }
    }
  });
}

// =========================================================
// 9. RESPONSIVE SIDEBAR: re-open state on resize
// =========================================================

/**
 * If the user resizes the window from mobile to desktop,
 * reset the sidebar open state so it shows normally.
 */
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    closeSidebarFn();
  }
});

// =========================================================
// 10. STAT CARD HOVER — subtle scale effect
// =========================================================

document.querySelectorAll('.stat-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px) scale(1.01)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// =========================================================
// 11. "EDIT PROFILE" BUTTON — demo feedback
// =========================================================

const editProfileBtn = document.querySelector('#profile .btn-link');

if (editProfileBtn) {
  editProfileBtn.addEventListener('click', () => {
    editProfileBtn.textContent = '✓ Saved';
    editProfileBtn.style.color = 'var(--green)';

    setTimeout(() => {
      editProfileBtn.textContent = 'Edit Profile';
      editProfileBtn.style.color = '';
    }, 2000);
  });
}

// =========================================================
// 12. "ADD SKILL" BUTTON — demo feedback
// =========================================================

const addSkillBtn = document.querySelector('#skills .btn-link');

if (addSkillBtn) {
  addSkillBtn.addEventListener('click', () => {
    addSkillBtn.textContent = '+ Added!';
    addSkillBtn.style.color = 'var(--green)';

    setTimeout(() => {
      addSkillBtn.textContent = 'Add Skill';
      addSkillBtn.style.color = '';
    }, 2000);
  });
}

// =========================================================
// 15. CERTIFICATE TRACKER
// =========================================================

(function () {
  /* ---- Constants ---- */
  const CERT_KEY = 'srushti-hub-certs';

  /**
   * All valid category values and their CSS modifier class.
   * Using a Map keeps insertion order for the filter dropdown.
   */
  const CATEGORIES = [
    { value: 'Web Development', cls: 'cert-cat-web-development' },
    { value: 'Programming',     cls: 'cert-cat-programming'     },
    { value: 'DSA',             cls: 'cert-cat-dsa'             },
    { value: 'Database',        cls: 'cert-cat-database'        },
    { value: 'AI/ML',           cls: 'cert-cat-ai-ml'           },
    { value: 'Other',           cls: 'cert-cat-other'           },
  ];

  /** Map category value → CSS class for O(1) lookup in buildCardHTML. */
  const CAT_CLASS = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.cls]));

  /* ---- Element refs ---- */
  const certForm           = document.getElementById('certForm');
  const certNameInput      = document.getElementById('certName');
  const certOrgInput       = document.getElementById('certOrg');
  const certDateInput      = document.getElementById('certDate');
  const certCategoryInput  = document.getElementById('certCategory');
  const certUrlInput       = document.getElementById('certUrl');
  const certNameError      = document.getElementById('certNameError');
  const certOrgError       = document.getElementById('certOrgError');
  const certDateError      = document.getElementById('certDateError');
  const certCategoryError  = document.getElementById('certCategoryError');
  const certUrlError       = document.getElementById('certUrlError');
  const certGrid           = document.getElementById('certGrid');
  const certCountBadge     = document.getElementById('certCountBadge');
  const certSearch         = document.getElementById('certSearch');
  const certSearchClear    = document.getElementById('certSearchClear');
  const certCategoryFilter = document.getElementById('certCategoryFilter');
  const certAddBtn         = document.getElementById('certAddBtn');

  /* ---- State ---- */
  let certs           = loadCerts();
  let searchQuery     = '';
  let categoryFilter  = '';    // '' = all categories
  let editingId       = null;

  /* -------------------------------------------------------
     PERSISTENCE
  ------------------------------------------------------- */

  function loadCerts() {
    try {
      const raw = localStorage.getItem(CERT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCerts() {
    localStorage.setItem(CERT_KEY, JSON.stringify(certs));
  }

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  const allInputs = [certNameInput, certOrgInput, certDateInput, certCategoryInput, certUrlInput];
  const allErrors = [certNameError, certOrgError, certDateError, certCategoryError, certUrlError];

  function validateForm() {
    let valid = true;

    if (!certNameInput.value.trim()) {
      showError(certNameInput, certNameError, 'Certificate name is required.');
      valid = false;
    } else { clearError(certNameInput, certNameError); }

    if (!certOrgInput.value.trim()) {
      showError(certOrgInput, certOrgError, 'Issuing organisation is required.');
      valid = false;
    } else { clearError(certOrgInput, certOrgError); }

    if (!certDateInput.value) {
      showError(certDateInput, certDateError, 'Issue date is required.');
      valid = false;
    } else { clearError(certDateInput, certDateError); }

    if (!certCategoryInput.value) {
      showError(certCategoryInput, certCategoryError, 'Please select a category.');
      valid = false;
    } else { clearError(certCategoryInput, certCategoryError); }

    const url = certUrlInput.value.trim();
    if (url && !isValidUrl(url)) {
      showError(certUrlInput, certUrlError, 'Please enter a valid URL (https://…).');
      valid = false;
    } else { clearError(certUrlInput, certUrlError); }

    return valid;
  }

  function showError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
  }

  function isValidUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch { return false; }
  }

  function clearAllErrors() {
    allInputs.forEach((inp) => inp.classList.remove('input-error'));
    allErrors.forEach((el)  => { el.textContent = ''; });
  }

  /* -------------------------------------------------------
     EDIT MODE HELPERS
  ------------------------------------------------------- */

  function enterEditMode(id) {
    const cert = certs.find((c) => c.id === id);
    if (!cert) return;

    editingId = id;

    certNameInput.value     = cert.name;
    certOrgInput.value      = cert.org;
    certDateInput.value     = cert.date;
    certUrlInput.value      = cert.url || '';

    // Existing certs without a category default to empty (shows placeholder)
    certCategoryInput.value = cert.category || '';

    certAddBtn.querySelector('span').textContent = '✏️ Update Certificate';
    certAddBtn.classList.add('cert-btn-update');
    certForm.classList.add('form-editing');

    certForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    certNameInput.focus();
    renderCerts();
  }

  function exitEditMode() {
    editingId = null;
    certForm.reset();
    clearAllErrors();
    certAddBtn.querySelector('span').textContent = '＋ Add Certificate';
    certAddBtn.classList.remove('cert-btn-update');
    certForm.classList.remove('form-editing');
    renderCerts();
  }

  /* -------------------------------------------------------
     ADD / UPDATE CERTIFICATE
  ------------------------------------------------------- */

  certForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId !== null) {
      const idx = certs.findIndex((c) => c.id === editingId);
      if (idx !== -1) {
        certs[idx] = {
          id      : editingId,
          name    : certNameInput.value.trim(),
          org     : certOrgInput.value.trim(),
          date    : certDateInput.value,
          category: certCategoryInput.value,
          url     : certUrlInput.value.trim(),
        };
      }
      saveCerts();
      exitEditMode();
    } else {
      const cert = {
        id      : Date.now(),
        name    : certNameInput.value.trim(),
        org     : certOrgInput.value.trim(),
        date    : certDateInput.value,
        category: certCategoryInput.value,
        url     : certUrlInput.value.trim(),
      };
      certs.unshift(cert);
      saveCerts();
      certForm.reset();
      clearAllErrors();
      renderCerts();
    }
  });

  /* -------------------------------------------------------
     DELETE / EDIT  (event delegation on grid)
  ------------------------------------------------------- */

  certGrid.addEventListener('click', (e) => {
    const delBtn  = e.target.closest('.cert-delete-btn');
    const editBtn = e.target.closest('.cert-edit-btn');

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      if (editingId === id) {
        // Reset form silently without calling renderCerts twice
        editingId = null;
        certForm.reset();
        clearAllErrors();
        certAddBtn.querySelector('span').textContent = '＋ Add Certificate';
        certAddBtn.classList.remove('cert-btn-update');
        certForm.classList.remove('form-editing');
      }
      certs = certs.filter((c) => c.id !== id);
      saveCerts();
      renderCerts();
      return;
    }

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      if (editingId === id) {
        exitEditMode();
      } else {
        enterEditMode(id);
      }
    }
  });

  /* -------------------------------------------------------
     SEARCH & CATEGORY FILTER
  ------------------------------------------------------- */

  certSearch.addEventListener('input', () => {
    searchQuery = certSearch.value.trim().toLowerCase();
    certSearchClear.classList.toggle('visible', searchQuery.length > 0);
    renderCerts();
  });

  certSearchClear.addEventListener('click', () => {
    certSearch.value = '';
    searchQuery = '';
    certSearchClear.classList.remove('visible');
    certSearch.focus();
    renderCerts();
  });

  certCategoryFilter.addEventListener('change', () => {
    categoryFilter = certCategoryFilter.value;
    renderCerts();
  });

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  function formatDate(ym) {
    if (!ym) return '';
    const [year, month] = ym.split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Return the CSS class for a category value.
   * Falls back to 'cert-cat-other' for certs saved before categories existed.
   */
  function categoryClass(cat) {
    return CAT_CLASS[cat] || 'cert-cat-other';
  }

  function buildCardHTML(cert) {
    const dateLabel = formatDate(cert.date);
    const isEditing = cert.id === editingId;

    // Category chip — gracefully handles missing category on old certs
    const catLabel   = cert.category || 'Other';
    const catCls     = categoryClass(cert.category);
    const categoryHTML = `<span class="cert-card-category ${catCls}">${escapeHTML(catLabel)}</span>`;

    const linkHTML = cert.url
      ? `<a class="cert-card-link" href="${escapeAttr(cert.url)}" target="_blank" rel="noopener noreferrer">🔗 View</a>`
      : '';

    return `
      <div class="cert-card${isEditing ? ' cert-card-editing' : ''}" data-id="${cert.id}">
        <div class="cert-card-actions">
          <button
            class="cert-edit-btn${isEditing ? ' active' : ''}"
            data-id="${cert.id}"
            aria-label="${isEditing ? 'Cancel editing' : 'Edit'} ${escapeAttr(cert.name)}"
            title="${isEditing ? 'Cancel edit' : 'Edit certificate'}"
          >${isEditing ? '✕ Cancel' : '✏️ Edit'}</button>
          <button
            class="cert-delete-btn"
            data-id="${cert.id}"
            aria-label="Delete ${escapeAttr(cert.name)}"
            title="Delete certificate"
          >🗑️</button>
        </div>

        <div class="cert-card-top">
          <div class="cert-card-icon">🏅</div>
          <div class="cert-card-info">
            <div class="cert-card-name">${escapeHTML(cert.name)}</div>
            <div class="cert-card-org">${escapeHTML(cert.org)}</div>
          </div>
        </div>

        <div class="cert-card-footer">
          ${categoryHTML}
          <span class="cert-card-date">📅 ${escapeHTML(dateLabel)}</span>
          ${linkHTML}
        </div>
      </div>
    `;
  }

  function renderCerts() {
    // Apply both filters together
    const visible = certs.filter((c) => {
      const matchesSearch = !searchQuery
        || c.name.toLowerCase().includes(searchQuery)
        || c.org.toLowerCase().includes(searchQuery);

      const matchesCategory = !categoryFilter
        || (c.category || 'Other') === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    const total = certs.length;
    certCountBadge.textContent =
      total === 0 ? '0 Certificates'
      : total === 1 ? '1 Certificate'
      : `${total} Certificates`;

    if (certs.length === 0) {
      certGrid.innerHTML = `
        <div class="cert-empty">
          <div class="cert-empty-icon">🏅</div>
          <p>No certificates yet. Fill in the form above to add your first one!</p>
        </div>`;
      return;
    }

    if (visible.length === 0) {
      // Build a helpful message reflecting which filters are active
      const parts = [];
      if (searchQuery)    parts.push(`"${escapeHTML(searchQuery)}"`);
      if (categoryFilter) parts.push(escapeHTML(categoryFilter));
      certGrid.innerHTML = `
        <div class="cert-no-results">
          No certificates match ${parts.join(' in ')}.
        </div>`;
      return;
    }

    certGrid.innerHTML = visible.map(buildCardHTML).join('');
  }

  /* -------------------------------------------------------
     SECURITY HELPERS
  ------------------------------------------------------- */

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) { return encodeURI(String(str)); }

  /* ---- INIT ---- */
  renderCerts();

})();
console.log(
  '%c🎓 Student Dashboard loaded successfully!',
  'color: #4f8ef7; font-size: 14px; font-weight: bold;'
);

// =========================================================
// 14. DARK MODE TOGGLE
// =========================================================

const themeToggle   = document.getElementById('themeToggle');
const themeIcon     = themeToggle.querySelector('.theme-icon');
const themeLabel    = themeToggle.querySelector('.theme-label');
const STORAGE_KEY   = 'srushti-hub-theme';

/**
 * Apply a theme to the document and update the toggle button UI.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent  = '☀️';
    themeLabel.textContent = 'Light';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
    themeToggle.title = 'Switch to light mode';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent  = '🌙';
    themeLabel.textContent = 'Dark';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    themeToggle.title = 'Switch to dark mode';
  }
}

/**
 * Read the saved preference from localStorage, fall back to
 * the OS-level preference (prefers-color-scheme), then light.
 */
function getSavedTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  // Respect OS preference when no explicit choice has been saved yet
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

  return 'light';
}

// Apply saved/OS theme immediately on load (before first paint)
applyTheme(getSavedTheme());

// Toggle on click and persist the choice
themeToggle.addEventListener('click', () => {
  const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEY, nextTheme);
});
