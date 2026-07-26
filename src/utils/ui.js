// ============================================================
// LeafTally — UI utilities
// ============================================================

// toast
function toast(msg, dur) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), dur || 3000);
}

// openDrawer
function openDrawer(title, html) {
  document.getElementById('drawer-title').textContent = title;
  document.getElementById('drawer-body').innerHTML = html;
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-bg').classList.add('open');
}

// closeDrawer
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-bg').classList.remove('open');
}

// toggleAction
function toggleAction(btn) {
  document.querySelectorAll('.action-dropdown.open').forEach(d => { if (d !== btn.nextElementSibling) d.classList.remove('open'); });
  btn.nextElementSibling.classList.toggle('open');
}

// openModal
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); m.style.display = 'flex'; }
}

// closeModal
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); m.style.display = 'none'; }
}

// warnDelete
function warnDelete(label, cbOrType, cb) {
  // Support both warnDelete(label, cb) and warnDelete(label, type, cb)
  if (typeof cbOrType === 'function') { cb = cbOrType; cbOrType = 'item'; }
  const msgs = {
    customer: 'Deleting a customer will also remove their invoices from the list view. Posted journal entries are retained.',
    supplier: 'Deleting a supplier will remove their bills from the list view. Posted entries are retained.',
    employee: 'Deactivating an employee will lock their payroll records but retain history.',
    invoice:  'Deleting a draft invoice cannot be undone. Posted invoices must be voided instead.',
    journal:  'Only draft journals can be deleted. Posted journals must be reversed.',
    account:  'Archiving an account hides it from dropdowns but retains all journal history.',
    default:  'This action cannot be undone.',
  };
  const type = (typeof cbOrType === 'string') ? cbOrType : 'default';
  document.getElementById('confirm-title').textContent = 'Delete ' + label + '?';
  document.getElementById('confirm-msg').textContent = msgs[type] || msgs.default;
  document.getElementById('confirm-overlay').classList.add('open');
  _confirmCb = cb;
}

// openAddBanner
function openAddBanner() {
  openDrawer('New platform banner',
    '<div class="form-group"><label class="form-label">Title *</label><input class="form-input" id="bn-title" placeholder="e.g. Scheduled maintenance"></div>' +
    '<div class="form-group"><label class="form-label">Message *</label><textarea class="form-input" id="bn-msg" rows="3" placeholder="Banner message visible to all tenants..."></textarea></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Type</label><select class="form-input" id="bn-type"><option>info</option><option>warning</option><option>alert</option></select></div>' +
    '<div class="form-group"><label class="form-label">Target</label><select class="form-input" id="bn-target"><option>All tenants</option><option>Pro tenants</option><option>Enterprise tenants</option><option>Nigeria tenants</option></select></div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">' +
    '<input type="checkbox" id="bn-live" style="accent-color:var(--primary)">' +
    '<label for="bn-live" style="font-size:12.5px;cursor:pointer">Publish immediately</label></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveBanner()"><i class="ti ti-check"></i>Save banner</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// saveBanner
function saveBanner() {
  var title = document.getElementById('bn-title')?.value.trim();
  var msg   = document.getElementById('bn-msg')?.value.trim();
  if (!title || !msg) { toast('Title and message required'); return; }
  var live = document.getElementById('bn-live')?.checked;
  window.BANNER_DATA.push({
    id:'BNR-'+String(window.BANNER_DATA.length+1).padStart(3,'0'),
    title, msg,
    type: document.getElementById('bn-type')?.value||'info',
    target: document.getElementById('bn-target')?.value||'All tenants',
    active: live,
    created: new Date().toLocaleDateString('en-NG')
  });
  var panel = document.getElementById('p-banners');
  if (panel) { panel.dataset.built=''; BUILDERS.banners(panel); }
  closeDrawer();
  toast(title + ' banner ' + (live?'published':'saved as draft'));
}
