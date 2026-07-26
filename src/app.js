// ============================================================
// LeafTally — app bootstrap
// ============================================================

export function bootstrap() {
  // Initialise BUILDERS registry if not already set
  if (!window.BUILDERS) window.BUILDERS = {};

  // Render the login screen
  const loginMount = document.getElementById('login-mount');
  if (loginMount) renderLogin(loginMount);

  // Keyboard shortcut: Escape closes any open drawer
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (typeof closeDrawer === 'function') closeDrawer();
      if (typeof closeModal  === 'function') closeModal();
    }
  });

  // Auto-login from localStorage token (future: JWT)
  const savedEmail = localStorage.getItem('lt_session_email');
  if (savedEmail && typeof doLogin === 'function') {
    const emailEl = document.getElementById('l-email');
    const passEl  = document.getElementById('l-pass');
    if (emailEl) emailEl.value = savedEmail;
    if (passEl)  passEl.value  = localStorage.getItem('lt_session_pass') || '';
  }

  console.log('%cLeafTally ERP%c loaded', 'color:#16a34a;font-weight:800;font-size:14px', '');
}

function renderLogin(mount) {
  // The full login HTML is embedded in the bundle for now.
  // In production, fetch from /api/config or render server-side.
  import('./components/Login.js').then(({ loginHTML }) => {
    mount.innerHTML = loginHTML;
  });
}
