// ============================================================
// LeafTally — SUPPORT module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── chat ──────────────────────────────────────
BUILDERS.chat = function(panel) {
  panel.innerHTML = `
  <div style="display:grid;grid-template-columns:200px 1fr;gap:14px;height:calc(100vh-160px);max-height:540px">
    <div class="card" style="padding:0;overflow-y:auto">
      <div style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:12px;font-weight:600">Conversations <span class="badge b-green" style="margin-left:4px">Online</span></div>
      <div style="padding:10px 12px;background:var(--g50);border-bottom:1px solid var(--border);cursor:pointer">
        <div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:30px;border-radius:50%;background:var(--g400);color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">LT</div><div><div style="font-size:12px;font-weight:600">LeafTally Support</div><div style="font-size:10px;color:var(--t400)">Online</div></div></div>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;padding:0;overflow:hidden">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-shrink:0">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--g400);color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">LT</div>
        <div><div style="font-size:13px;font-weight:600">LeafTally Support</div><div style="font-size:11px;color:var(--g500)">● Online · Typical reply &lt;2 hours</div></div>
        <button class="btn btn-sm" style="margin-left:auto" onclick="toast('Transcript downloaded')"><i class="ti ti-download"></i>Export</button>
      </div>
      <div id="chat-msgs" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px">
        <div style="align-self:flex-start"><div style="background:var(--bg);border:1px solid var(--border);padding:8px 12px;border-radius:12px 12px 12px 4px;font-size:12px;max-width:80%">Hi! Welcome to LeafTally support. How can I help you today?</div><div style="font-size:10px;color:var(--t400);margin-top:3px">Support · 09:32</div></div>
      </div>
      <div style="padding:10px 12px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0">
        <input id="chat-input" class="form-input" placeholder="Type a message..." style="flex:1" onkeydown="if(event.key==='Enter')sendChat()">
        <button class="btn btn-primary" onclick="sendChat()"><i class="ti ti-send"></i>Send</button>
      </div>
    </div>
  </div>`;
}

// ── tickets ──────────────────────────────────────
BUILDERS.tickets = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Support tickets</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search tickets..." oninput="filterTable(this,'tkt-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'tkt-tbl',4)"><option value="">All statuses</option><option>Open</option><option>In progress</option><option>Resolved</option><option>Closed</option></select>
        <button class="btn btn-primary btn-sm" onclick="newTicket()"><i class="ti ti-plus"></i>New ticket</button>
      </div>
    </div>
    <div class="bulk-bar" id="tkt-bar"><span id="tkt-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Tickets closed')">Close</button><button class="btn btn-sm" onclick="toast('Tickets reopened')">Reopen</button><button class="btn btn-sm btn-danger" onclick="bulkDeleteTkts()">Delete</button></div>
    <table id="tkt-tbl">
      <tr><th class="col-check"><input type="checkbox" id="tkt-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Ticket #</th><th class="sortable" onclick="sortTable(this)">Subject</th><th class="sortable" onclick="sortTable(this)">Category</th><th class="sortable" onclick="sortTable(this)">Status</th><th class="sortable" onclick="sortTable(this)">Priority</th><th class="sortable" onclick="sortTable(this)">Date</th><th>Actions</th></tr>
      ${[
        ['TKT-0142','FIRS submission failing for INV-0039','Technical','In progress','High','22 Jun 2026'],
        ['TKT-0141','How to run comparative P&L report?','Training','Resolved','Low','20 Jun 2026'],
        ['TKT-0140','Subscription upgrade question','Billing','Resolved','Low','18 Jun 2026'],
      ].map(([ref,subj,cat,status,priority,date]) => {
        const sc = {'In progress':'b-blue',Resolved:'b-green',Open:'b-amber',Closed:'b-gray'}[status]||'b-gray';
        const pc = {High:'b-red',Critical:'b-red',Medium:'b-amber',Low:'b-gray'}[priority]||'b-gray';
        return `<tr><td class="col-check"><input type="checkbox" class="tkt-cb" style="accent-color:var(--g500)"></td><td class="td-bold" style="cursor:pointer;color:var(--b600)" onclick="viewTicket('${ref}','${subj}','${status}')">${ref}</td><td style="cursor:pointer" onclick="viewTicket('${ref}','${subj}','${status}')">${subj}</td><td><span class="badge b-gray">${cat}</span></td><td><span class="badge ${sc}">${status}</span></td><td><span class="badge ${pc}">${priority}</span></td><td>${date}</td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="viewTicket('${ref}','${subj}','${status}');return false">View thread</a><a onclick="closeTkt(this,'${ref}');return false">Close ticket</a><div class="sep"></div><a class="danger" onclick="warnDelete('${ref}',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('tkt-tbl','tkt-bar','tkt-cnt','tkt-cb','tkt-all');
}

// ── legal ──────────────────────────────────────
BUILDERS.legal = function(panel) {
  panel.innerHTML = `
  <div class="grid-2">
    <div class="card">
      <div class="card-hd"><span class="card-title">Terms of service</span></div>
      <div class="prose">
        <p><strong>Effective date: 1 January 2026</strong></p>
        <h3>1. Acceptance of terms</h3>
        <p>By accessing or using LeafTally, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.</p>
        <h3>2. Service description</h3>
        <p>LeafTally provides cloud-based accounting and business management software for Nigerian businesses. The service includes invoicing, payroll, inventory management, and FIRS e-invoicing integration.</p>
        <h3>3. Your responsibilities</h3>
        <p>You are responsible for the accuracy of all financial data entered, maintaining the confidentiality of your login credentials, and complying with Nigerian tax and financial regulations.</p>
        <h3>4. Data ownership</h3>
        <p>You retain ownership of all your business data. LeafTally acts as a data processor. On account termination, you may export all data within 90 days.</p>
        <h3>5. Subscription and payment</h3>
        <p>Subscription fees are billed monthly or annually. Subscriptions auto-renew unless cancelled. No refunds after the free trial period. Services suspended for non-payment after 7 days.</p>
        <h3>6. Limitation of liability</h3>
        <p>LeafTally is not liable for errors arising from incorrect data entry or reliance on reports for major financial decisions. Maximum liability is limited to fees paid in the prior 3 months.</p>
        <h3>7. Changes to terms</h3>
        <p>We may update these terms with 30 days notice via email and in-app banner. Continued use constitutes acceptance.</p>
        <p><strong>Contact:</strong> legal@leaftally.io · LeafTally Technologies Ltd, Victoria Island, Lagos</p>
      </div>
    </div>
    <div>
      <div class="card" style="margin-bottom:14px">
        <div class="card-hd"><span class="card-title">Privacy policy</span></div>
        <div class="prose">
          <p><strong>Effective date: 1 January 2026</strong></p>
          <h3>Data we collect</h3>
          <p>Company details, employee records, financial transactions, and usage analytics. We do not collect personal data beyond what is necessary to provide the service.</p>
          <h3>How we use it</h3>
          <p>Solely to provide LeafTally services. FIRS data is shared with FIRS as required by law. We do not sell your data to third parties.</p>
          <h3>Your rights (NDPR)</h3>
          <p>Right to access, correct, and delete personal data. Contact dpo@leaftally.io.</p>
          <h3>Security</h3>
          <p>TLS 1.3 encryption in transit. AES-256 at rest. Annual penetration testing. ISO 27001 certification in progress.</p>
        </div>
        <button class="btn btn-sm" style="margin-top:10px" onclick="showPrivacy()"><i class="ti ti-external-link"></i>View full policy</button>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Compliance & certifications</span></div>
        ${[['FIRS e-Invoicing','Certified FIRS-compliant e-invoicing solution','b-green'],['NDPR','Nigeria Data Protection Regulation compliant','b-green'],['ICAN','Aligned with Institute of Chartered Accountants of Nigeria standards','b-blue'],['IFRS','Nigeria IFRS-compliant chart of accounts and reporting','b-blue']].map(([cert,desc,badge]) => `<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--bg)"><span class="badge ${badge}" style="flex-shrink:0;margin-top:2px">${cert}</span><span style="font-size:12px;color:var(--t600)">${desc}</span></div>`).join('')}
      </div>
    </div>
  </div>`;
}
