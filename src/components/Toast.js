// ============================================================
// LeafTally — Toast notification component
// ============================================================

window.toast = function toast(message, type) {
  type = type || 'success';  // success | error | info | warning

  const icons = {
    success: 'ti-check',
    error:   'ti-alert-circle',
    info:    'ti-info-circle',
    warning: 'ti-alert-triangle',
  };
  const colors = {
    success: 'var(--green-700)',
    error:   'var(--red-600)',
    info:    'var(--blue-700)',
    warning: 'var(--amber-700)',
  };

  const el = document.createElement('div');
  el.className = 'toast';
  el.style.cssText =
    'position:fixed;bottom:24px;right:24px;z-index:9999;' +
    'display:flex;align-items:center;gap:10px;' +
    'padding:12px 18px;background:var(--zinc-900);color:#fff;' +
    'border-radius:10px;font-size:13px;font-weight:500;' +
    'box-shadow:0 8px 24px rgba(0,0,0,.25);' +
    'animation:toastIn .2s ease;max-width:380px;';
  el.innerHTML =
    `<i class="ti ${icons[type] || icons.success}" style="font-size:16px;color:${colors[type] || colors.success};flex-shrink:0"></i>` +
    `<span>${message}</span>`;

  document.body.appendChild(el);
  setTimeout(function() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'all .2s ease';
    setTimeout(function() { el.remove(); }, 200);
  }, 3500);
};
