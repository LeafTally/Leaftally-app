// ============================================================
// LeafTally — Slide-in drawer component
// ============================================================

/**
 * Open a right-side drawer with a title and body HTML.
 * @param {string} title
 * @param {string} bodyHTML
 */
window.openDrawer = function openDrawer(title, bodyHTML) {
  let drawer = document.getElementById('drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'drawer';
    drawer.className = 'drawer';
    drawer.innerHTML =
      '<div class="drawer-overlay" onclick="closeDrawer()"></div>' +
      '<div class="drawer-panel">' +
      '<div class="drawer-hd">' +
      '<span class="drawer-title" id="drawer-title"></span>' +
      '<button class="drawer-close" onclick="closeDrawer()">' +
      '<i class="ti ti-x" style="font-size:18px"></i></button>' +
      '</div>' +
      '<div class="drawer-body" id="drawer-body"></div>' +
      '</div>';
    document.body.appendChild(drawer);
  }

  document.getElementById('drawer-title').textContent = title;
  document.getElementById('drawer-body').innerHTML    = bodyHTML;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeDrawer = function closeDrawer() {
  const drawer = document.getElementById('drawer');
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
};
