// ============================================================
// LeafTally — BANKING module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── banking ──────────────────────────────────────
BUILDERS.banking = function(panel) {
  const totalCash = BANK_ACCOUNTS.reduce((a, b) => a + b.balance, 0);
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Total cash</div><div class="kpi-value" style="color:var(--green-700)">₦${(totalCash/1000000).toFixed(2)}M</div><div class="kpi-sub">${BANK_ACCOUNTS.length} accounts</div></div>
    <div class="kpi-card"><div class="kpi-label">GTBank current</div><div class="kpi-value">₦${(5241375/1000000).toFixed(2)}M</div></div>
    <div class="kpi-card"><div class="kpi-label">Zenith savings</div><div class="kpi-value">₦${(1200000/1000000).toFixed(2)}M</div></div>
    <div class="kpi-card"><div class="kpi-label">Unreconciled items</div><div class="kpi-value" style="color:var(--amber-700)">3</div></div>
  </div>
  <div class="grid-2">
    <div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Bank accounts</span>
          <button class="btn btn-primary btn-sm" onclick="openAddBankAccount()"><i class="ti ti-plus"></i>Add account</button>
        </div>
        ${BANK_ACCOUNTS.map(b => `
        <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:14px 16px;margin-bottom:10px;transition:box-shadow .15s" onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='none'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div>
              <div style="font-weight:700;font-size:14px">${b.bank}</div>
              <div style="font-size:12px;color:var(--text-secondary)">${b.type} · ${b.number} · ${b.currency}</div>
            </div>
            <span class="badge b-green">${b.status}</span>
          </div>
          <div style="font-size:24px;font-weight:800;color:var(--text-primary);letter-spacing:-.5px;font-variant-numeric:tabular-nums;margin-bottom:10px">
            ₦${b.balance.toLocaleString()}
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm" onclick="viewBankTransactions('${b.bank}')"><i class="ti ti-list"></i>Transactions</button>
            <button class="btn btn-sm" onclick="startReconciliation('${b.bank}')"><i class="ti ti-checkup-list"></i>Reconcile</button>
            <button class="btn btn-sm" onclick="toast('Statement uploaded for ${b.bank}')"><i class="ti ti-upload"></i>Upload statement</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="card">
        <div class="card-hd">
          <span class="card-title" id="bank-txn-title">Recent transactions — GTBank</span>
          <div style="display:flex;gap:6px">
            <select class="tbl-filter" id="bank-acct-sel" onchange="viewBankTransactions(this.value)">
              ${BANK_ACCOUNTS.map(b => `<option>${b.bank}</option>`).join('')}
            </select>
            <button class="btn btn-sm" onclick="downloadTableAsExcel('bank-txn-tbl','bank-transactions')"><i class="ti ti-download"></i>Export</button>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input class="tbl-search" placeholder="Search transactions..." oninput="filterTable(this,'bank-txn-tbl')" style="flex:1">
        </div>
        <table id="bank-txn-tbl">
          <tr>
            <th class="sortable" onclick="sortTable(this)">Date</th>
            <th class="sortable" onclick="sortTable(this)">Description</th>
            <th class="sortable" onclick="sortTable(this)">Ref</th>
            <th class="sortable" onclick="sortTable(this)" style="text-align:right">Debit (₦)</th>
            <th class="sortable" onclick="sortTable(this)" style="text-align:right">Credit (₦)</th>
            <th class="sortable" onclick="sortTable(this)" style="text-align:right">Balance (₦)</th>
          </tr>
          ${BANK_TRANSACTIONS.filter(t => t.account === 'GTBank').map(t => `<tr>
            <td style="font-size:12px">${t.date}</td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px" title="${t.desc}">${t.desc}</td>
            <td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">${t.ref}</td>
            <td style="text-align:right;color:var(--red-600);font-variant-numeric:tabular-nums">${t.debit ? '₦'+t.debit.toLocaleString() : '—'}</td>
            <td style="text-align:right;color:var(--green-700);font-variant-numeric:tabular-nums">${t.credit ? '₦'+t.credit.toLocaleString() : '—'}</td>
            <td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums">₦${t.bal.toLocaleString()}</td>
          </tr>`).join('')}
        </table>
      </div>
    </div>
  </div>`;
  setupTableDefaults('bank-txn-tbl');
}
