// ============================================================
// LeafTally — App shell (sidebar + topbar + panels)
// The full shell is embedded in the single-file build.
// In production, this component renders the nav and panel mount.
// ============================================================

export function initShell() {
  // Wire all nav items
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      // nav() is wired via inline onclick in the HTML
      // This hook allows adding analytics, etc.
    });
  });

  // Topbar: user menu
  const userMenu = document.getElementById('user-menu');
  if (userMenu) {
    userMenu.addEventListener('click', function() {
      userMenu.classList.toggle('open');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.action-menu')) {
      document.querySelectorAll('.action-dropdown').forEach(function(d) {
        d.style.display = 'none';
      });
    }
    if (!e.target.closest('#user-menu')) {
      if (userMenu) userMenu.classList.remove('open');
    }
  });
}
