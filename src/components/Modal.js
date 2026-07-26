// ============================================================
// LeafTally — Modal dialog component
// ============================================================

window.openModal = function openModal(title, bodyHTML, footer) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal-overlay';
    modal.innerHTML =
      '<div class="modal-box">' +
      '<div class="modal-hd"><span class="modal-title" id="modal-title"></span>' +
      '<button onclick="closeModal()" style="background:none;border:none;cursor:pointer">' +
      '<i class="ti ti-x" style="font-size:18px;color:var(--text-secondary)"></i></button></div>' +
      '<div class="modal-body" id="modal-body"></div>' +
      '<div class="modal-footer" id="modal-footer"></div>' +
      '</div>';
    document.body.appendChild(modal);
  }
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML    = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footer || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

window.warnDelete = function warnDelete(name, type, onConfirm) {
  openModal(
    'Confirm deletion',
    `<p style="font-size:13.5px;line-height:1.6">Are you sure you want to delete <strong>${name}</strong>? This action cannot be undone.</p>`,
    `<button class="btn btn-danger" onclick="closeModal();(${onConfirm.toString()})()">Yes, delete</button>` +
    `<button class="btn" onclick="closeModal()" style="margin-left:8px">Cancel</button>`
  );
};
