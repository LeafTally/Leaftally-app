// ============================================================
// LeafTally — SETTINGS module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── settings ──────────────────────────────────────
BUILDERS.settings = function(panel) {
  var tabs = ['profile','accounting','currency','picklists','reminders','security','integrity'];
  var activeTab = panel._activeTab || 'profile';
  panel._activeTab = activeTab;

  function renderTab(tab) {
    panel._activeTab = tab;
    var content = document.getElementById('settings-tab-body');
    if (!content) return;

    if (tab === 'profile') {
      content.innerHTML = `<div class="grid-2">
        <div>
          <div class="card">
            <div class="card-hd"><span class="card-title">Company profile</span></div>
            <div class="form-group"><label class="form-label">Company name</label><input class="form-input" id="s-name" value="Acme Trading Ltd"></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">TIN</label><input class="form-input" id="s-tin" value="12345678-0001"></div>
              <div class="form-group"><label class="form-label">RC number</label><input class="form-input" id="s-rc" value="RC-789456"></div>
            </div>
            <div class="form-group"><label class="form-label">Address</label><input class="form-input" id="s-addr" value="14 Victoria Island, Lagos"></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="s-phone" value="+234 801 234 5678"></div>
              <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="s-email" value="accounts@acmetrading.ng"></div>
            </div>
            <div class="form-group"><label class="form-label">Company logo</label>
              <div class="upload-zone" onclick="document.getElementById('logo-input').click()">
                <i class="ti ti-upload" style="font-size:20px;display:block;margin:0 auto 4px"></i>Click to upload logo (PNG, SVG, max 5MB)
              </div>
              <input type="file" id="logo-input" accept="image/*" style="display:none" onchange="uploadLogo(this)">
            </div>
            <button class="btn btn-primary" onclick="saveSettings()"><i class="ti ti-device-floppy"></i>Save company profile</button>
          </div>
          <div class="card" style="margin-top:14px">
            <div class="card-hd"><span class="card-title">FIRS e-Invoicing</span></div>
            <div class="form-group"><label class="form-label">FIRS TIN</label><input class="form-input" id="s-firs-tin" value="12345678-0001"></div>
            <div class="form-group"><label class="form-label">API key</label><input class="form-input" id="s-firs-key" type="password" placeholder="Enter FIRS API key"></div>
            <div class="form-group"><label class="form-label">Environment</label>
              <select class="form-input"><option>Production</option><option>Sandbox</option></select></div>
            <div style="display:flex;gap:8px">
              <button class="btn" onclick="testFIRS()"><i class="ti ti-plug"></i>Test connection</button>
              <button class="btn btn-primary" onclick="toast('FIRS settings saved')"><i class="ti ti-device-floppy"></i>Save</button>
            </div>
          </div>
        </div>
        <div>
          <div class="card">
            <div class="card-hd"><span class="card-title">Document ID numbering</span><span class="badge b-amber" style="font-size:10px">Locked after first use</span></div>
            <div class="alert alert-amber"><i class="ti ti-alert-circle"></i>Document ID formats are <strong>locked once used</strong> to ensure auditability.</div>
            ${[{id:'doc-inv',label:'Invoice prefix',value:'INV-2026-',locked:true,count:41,example:'INV-2026-0042'},{id:'doc-bill',label:'Bill prefix',value:'BILL-2026-',locked:true,count:45,example:'BILL-2026-0046'},{id:'doc-jnl',label:'Journal prefix',value:'JNL-2026-',locked:true,count:94,example:'JNL-2026-0095'},{id:'doc-emp',label:'Employee ID prefix',value:'EMP-',locked:true,count:5,example:'EMP-006'},{id:'doc-cust',label:'Customer code prefix',value:'C-',locked:true,count:4,example:'C-005'},{id:'doc-sup',label:'Supplier code prefix',value:'S-',locked:false,count:0,example:'S-001'},{id:'doc-po',label:'Purchase order prefix',value:'PO-',locked:false,count:0,example:'PO-001'},{id:'doc-asset',label:'Asset ref prefix',value:'AST-',locked:true,count:4,example:'AST-005'}].map(d=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
              <div style="flex:1"><div style="font-size:11px;font-weight:600">${d.label}</div><div style="font-size:10px;color:var(--text-tertiary)">Next: ${d.example} · ${d.count} used</div></div>
              <input class="form-input" id="${d.id}" value="${d.value}" style="width:130px;font-family:monospace;font-size:12px;${d.locked?'background:var(--zinc-50);color:var(--text-tertiary)':''}" ${d.locked?'readonly':''}>
              ${d.locked?'<span class="badge b-gray"><i class="ti ti-lock" style="font-size:11px"></i></span>':'<span class="badge b-green">Editable</span>'}
            </div>`).join('')}
            <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="saveDocIDs()"><i class="ti ti-device-floppy"></i>Save editable IDs</button>
          </div>
          <div class="card" style="margin-top:14px">
            <div class="card-hd"><span class="card-title">Security</span></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Min password length</label><input class="form-input" type="number" value="10"></div>
              <div class="form-group"><label class="form-label">Session timeout (mins)</label><input class="form-input" type="number" value="60"></div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0">
              <span style="font-size:12px">Require 2FA for all users</span>
              <button class="toggle" onclick="this.classList.toggle('on')"></button>
            </div>
            <button class="btn btn-primary" style="margin-top:8px" onclick="toast('Security settings saved')"><i class="ti ti-device-floppy"></i>Save</button>
          </div>
        </div>
      </div>`;
    }

    else if (tab === 'accounting') {
      content.innerHTML = `<div class="grid-2">
        <div>
          <div class="card">
            <div class="card-hd"><span class="card-title">Default accounting setup</span></div>
            <div class="form-group"><label class="form-label">Accounting basis</label>
              <select class="form-input" id="acc-basis"><option selected>Accrual (IFRS)</option><option>Cash basis</option></select></div>
            <div class="form-group"><label class="form-label">Financial year start</label>
              <select class="form-input" id="acc-fy-start"><option>January</option><option>April</option><option selected>July</option><option>October</option></select></div>
            <div class="form-group"><label class="form-label">Default currency</label>
              <select class="form-input" id="acc-currency"><option selected>NGN — Nigerian Naira (₦)</option><option>USD — US Dollar ($)</option><option>GBP — British Pound (£)</option><option>EUR — Euro (€)</option></select></div>
            <div class="form-group"><label class="form-label">VAT rate (default)</label>
              <select class="form-input" id="acc-vat"><option selected>7.5% (Nigeria standard)</option><option>0% (Exempt)</option><option>5%</option><option>Custom</option></select></div>
            <div class="form-group"><label class="form-label">PAYE scheme</label>
              <select class="form-input"><option selected>FIRS graduated rates (Nigeria)</option><option>Flat rate</option></select></div>
            <button class="btn btn-primary" style="margin-top:4px" onclick="toast('Accounting defaults saved')"><i class="ti ti-device-floppy"></i>Save defaults</button>
          </div>
          <div class="card" style="margin-top:14px">
            <div class="card-hd"><span class="card-title">Inventory costing method</span><span class="badge b-amber" style="font-size:10px">Cannot change after transactions</span></div>
            <div class="alert alert-amber"><i class="ti ti-alert-circle"></i>Select carefully. Once inventory transactions exist this setting is locked.</div>
            ${[['FIFO','First In First Out','Oldest stock is sold first. Most common for physical goods.','selected'],['WAC','Weighted Average Cost','Average cost recalculated on each receipt.',''],['LIFO','Last In First Out','Not permitted under IFRS — shown for reference only.',''],['Specific','Specific Identification','Each item tracked individually. Used for high-value items.','']]
              .map(([code,name,desc,sel])=>`
            <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer">
              <input type="radio" name="costing" value="${code}" ${sel} style="margin-top:3px;accent-color:var(--primary)">
              <div><div style="font-weight:600;font-size:12.5px">${code} — ${name}</div><div style="font-size:11.5px;color:var(--text-secondary);margin-top:2px">${desc}</div></div>
            </label>`).join('')}
            <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="toast('Costing method saved as FIFO')"><i class="ti ti-device-floppy"></i>Save costing method</button>
          </div>
        </div>
        <div>
          <div class="card">
            <div class="card-hd"><span class="card-title">Manual GL account mapping</span></div>
            <div class="alert alert-blue"><i class="ti ti-info-circle"></i>Map system transactions to your chart of accounts. Changes take effect on the next transaction.</div>
            ${[['Accounts receivable','1200'],['Accounts payable','2000'],['VAT payable','2100'],['PAYE payable','2200'],['Revenue — goods','4000'],['Revenue — services','4200'],['Cost of goods sold','5000'],['Salaries expense','6000'],['Rent expense','6100'],['Depreciation expense','6200'],['Bank charges','6300'],['Cash — GTBank','1000'],['Cash — Zenith','1100']]
              .map(([label,gl])=>`
            <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border)">
              <span style="flex:1;font-size:12px">${label}</span>
              <select class="form-input" style="width:90px;font-family:monospace;font-size:12px">
                ${Object.entries(GL_ACCOUNTS).map(([code,a])=>`<option value="${code}" ${code===gl?'selected':''}>${code}</option>`).join('')}
              </select>
              <span style="font-size:11px;color:var(--text-tertiary);min-width:120px">${GL_ACCOUNTS[gl]?.name||''}</span>
            </div>`).join('')}
            <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="toast('GL mappings saved')"><i class="ti ti-device-floppy"></i>Save mappings</button>
          </div>
          <div class="card" style="margin-top:14px">
            <div class="card-hd"><span class="card-title">Retained earnings account</span></div>
            <div class="form-group"><label class="form-label">Retained earnings GL account</label>
              <select class="form-input">
                ${Object.entries(GL_ACCOUNTS).filter(([,a])=>a.type==='Equity').map(([code,a])=>`<option value="${code}">${code} — ${a.name}</option>`).join('')}
              </select></div>
            <div class="form-group"><label class="form-label">Opening balance date</label>
              <input class="form-input" type="date" value="2026-01-01"></div>
            <button class="btn btn-primary btn-sm" onclick="toast('Equity mapping saved')"><i class="ti ti-device-floppy"></i>Save</button>
          </div>
        </div>
      </div>`;
    }

    else if (tab === 'currency') {
      var CURRENCIES_DATA = [
        {code:'NGN',name:'Nigerian Naira',symbol:'₦',rate:1,default:true,active:true},
        {code:'USD',name:'US Dollar',symbol:'$',rate:1540,default:false,active:true},
        {code:'GBP',name:'British Pound',symbol:'£',rate:1950,default:false,active:true},
        {code:'EUR',name:'Euro',symbol:'€',rate:1680,default:false,active:false},
        {code:'GHS',name:'Ghanaian Cedi',symbol:'₵',rate:120,default:false,active:false},
      ];
      content.innerHTML = `<div class="kpi-strip">
        <div class="kpi-card"><div class="kpi-label">Base currency</div><div class="kpi-value">NGN</div><div class="kpi-sub">Nigerian Naira</div></div>
        <div class="kpi-card"><div class="kpi-label">Active currencies</div><div class="kpi-value">${CURRENCIES_DATA.filter(c=>c.active).length}</div></div>
        <div class="kpi-card"><div class="kpi-label">Last rate update</div><div class="kpi-value" style="font-size:14px">Today 09:00</div></div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Currency management</span>
          <div style="display:flex;gap:6px">
            <button class="btn btn-primary btn-sm" onclick="openAddCurrency()"><i class="ti ti-plus"></i>Add currency</button>
            <button class="btn btn-sm" onclick="toast('Exchange rates refreshed from CBN API')"><i class="ti ti-refresh"></i>Refresh rates</button>
          </div>
        </div>
        <table id="currency-tbl">
          <tr><th>Code</th><th>Currency</th><th>Symbol</th><th style="text-align:right">Rate to NGN</th><th>Default</th><th>Status</th><th>Actions</th></tr>
          ${CURRENCIES_DATA.map(cur=>`<tr>
            <td class="td-bold td-mono">${cur.code}</td>
            <td>${cur.name}</td>
            <td style="font-weight:700;color:var(--green-700)">${cur.symbol}</td>
            <td style="text-align:right;font-variant-numeric:tabular-nums">
              ${cur.code==='NGN'?'1.0000 (base)':`<input type="number" style="width:90px;border:1px solid var(--border);border-radius:4px;padding:3px 6px;font-size:12px;text-align:right" value="${cur.rate}" onchange="toast('Rate for ${cur.code} updated')">`}
            </td>
            <td>${cur.default?'<span class="badge b-green">Default</span>':'<button class="btn btn-sm" style="padding:2px 8px;font-size:11px" onclick="toast(\''+cur.code+' set as default\')">Set default</button>'}</td>
            <td><span class="badge ${cur.active?'b-green':'b-gray'}">${cur.active?'Active':'Inactive'}</span></td>
            <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
              <div class="action-dropdown">
                <a onclick="toast('Editing ${cur.code}');return false"><i class="ti ti-pencil"></i>Edit</a>
                <a onclick="toast('${cur.code} ${cur.active?'deactivated':'activated'}');return false"><i class="ti ti-toggle-left"></i>${cur.active?'Deactivate':'Activate'}</a>
                ${!cur.default&&!cur.code==='NGN'?'<div class="sep"></div><a class="danger" onclick="warnDelete(\''+cur.code+'\',\'account\',()=>toast(\'Currency removed\'));return false"><i class="ti ti-trash"></i>Remove</a>':''}
              </div></div></td>
          </tr>`).join('')}
        </table>
      </div>
      <div class="card" style="margin-top:14px">
        <div class="card-hd"><span class="card-title">Exchange rate history — USD/NGN</span></div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">
          ${[['Jan','1,480'],['Feb','1,495'],['Mar','1,510'],['Apr','1,520'],['May','1,530'],['Jun','1,540']].map(([m,r])=>`
          <div style="text-align:center;padding:10px;background:var(--zinc-50);border-radius:var(--r-md)">
            <div style="font-size:11px;color:var(--text-tertiary)">${m} 2026</div>
            <div style="font-weight:700;font-size:14px">₦${r}</div>
          </div>`).join('')}
        </div>
      </div>`;
    }

    else if (tab === 'picklists') {
      var PICKLIST_DEFS = [
        {key:'uom', label:'Units of measure', items:PICKLISTS.uom||[]},
        {key:'productCats', label:'Product categories', items:PICKLISTS.productCats||[]},
        {key:'deptList', label:'Departments', items:PICKLISTS.deptList||[]},
        {key:'paymentTerms', label:'Payment terms', items:PICKLISTS.paymentTerms||[]},
        {key:'expenseCategories', label:'Expense categories', items:PICKLISTS.expenseCategories||[]},
        {key:'taxTypes', label:'Tax types', items:PICKLISTS.taxTypes||[]},
        {key:'journalTypes', label:'Journal types', items:PICKLISTS.journalTypes||[]},
        {key:'dimensionTypes', label:'Dimension types', items:PICKLISTS.dimensionTypes||[]},
        {key:'incoterms', label:'Incoterms', items:PICKLISTS.incoterms||[]},
        {key:'assetStatuses', label:'Asset statuses', items:PICKLISTS.assetStatuses||[]},
      ];
      var active = panel._activePL || 'uom';
      content.innerHTML = `<div style="display:grid;grid-template-columns:220px 1fr;gap:14px">
        <div class="card" style="align-self:start">
          <div class="card-hd" style="padding:10px 12px"><span class="card-title">Picklists</span></div>
          ${PICKLIST_DEFS.map(pl=>`
          <div onclick="renderPicklist('${pl.key}')" style="padding:8px 12px;cursor:pointer;font-size:12.5px;font-weight:${active===pl.key?'700':'400'};color:${active===pl.key?'var(--primary)':'var(--text-secondary)'};background:${active===pl.key?'var(--green-50)':'transparent'};border-left:3px solid ${active===pl.key?'var(--primary)':'transparent'}">
            ${pl.label} <span style="float:right;font-size:11px;color:var(--text-tertiary)">${pl.items.length}</span>
          </div>`).join('')}
        </div>
        <div id="picklist-detail">
          ${renderPicklistDetail(active, PICKLIST_DEFS)}
        </div>
      </div>`;
    }

    else if (tab === 'reminders') {
      content.innerHTML = `<div class="grid-2">
        <div class="card">
          <div class="card-hd"><span class="card-title">Invoice reminders</span></div>
          ${[{label:'Reminder 1 — before due',days:'-3',enabled:true},{label:'Reminder 2 — on due date',days:'0',enabled:true},{label:'Reminder 3 — overdue',days:'7',enabled:true},{label:'Reminder 4 — final notice',days:'30',enabled:false}].map(r=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
            <button class="toggle ${r.enabled?'on':''}" onclick="this.classList.toggle('on')"></button>
            <div style="flex:1">
              <div style="font-size:12.5px;font-weight:600">${r.label}</div>
              <div style="font-size:11.5px;color:var(--text-secondary)">Send ${parseInt(r.days)<0?Math.abs(r.days)+' days before':r.days==='0'?'on the due date':r.days+' days after'} due date</div>
            </div>
            <input type="number" class="form-input" value="${r.days}" style="width:60px;font-size:12px">
            <span style="font-size:11px;color:var(--text-tertiary)">days</span>
          </div>`).join('')}
          <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="toast('Invoice reminder schedule saved')"><i class="ti ti-device-floppy"></i>Save</button>
        </div>
        <div class="card">
          <div class="card-hd"><span class="card-title">System notifications</span></div>
          ${[['Low stock alert','Notify when product stock falls below reorder point',true],['Bill due soon','Alert 3 days before a supplier bill is due',true],['Payroll due','Remind on the 20th of each month to run payroll',true],['Budget exceeded','Alert when actual spend exceeds 90% of budget for any category',true],['New user login','Notify admin when a new user logs in from an unknown device',false],['Audit log export','Email weekly audit summary to admin',false],['Year-end reminder','Alert 30 days before financial year end',true]].map(([label,desc,on])=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <button class="toggle ${on?'on':''}" style="margin-top:2px" onclick="this.classList.toggle('on')"></button>
            <div><div style="font-size:12.5px;font-weight:600">${label}</div><div style="font-size:11.5px;color:var(--text-secondary)">${desc}</div></div>
          </div>`).join('')}
          <div class="form-group" style="margin-top:12px"><label class="form-label">Notification email</label>
            <input class="form-input" value="amaka@acmetrading.ng" placeholder="admin@company.ng"></div>
          <button class="btn btn-primary btn-sm" onclick="toast('Notification settings saved')"><i class="ti ti-device-floppy"></i>Save</button>
        </div>
      </div>
      <div class="card" style="margin-top:14px">
        <div class="card-hd"><span class="card-title">Recent notifications</span></div>
        ${[['ti-alert-triangle','amber','Low stock','Generator Oil (5L) — 2 units remaining. Reorder point: 10','10 min ago'],['ti-file-invoice','blue','Invoice overdue','INV-2026-0038 — Eko Atlantic Ventures — ₦247,500 — 5 days overdue','2 hrs ago'],['ti-moneybag','green','Payroll reminder','June payroll due in 10 days. Last run: 25 May 2026','Yesterday'],['ti-chart-pie','amber','Budget alert','Salaries & wages at 91% of H1 budget','2 days ago']].map(([icon,color,title,msg,time])=>`
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="width:32px;height:32px;border-radius:8px;background:var(--${color}-50);border:1px solid var(--${color}-200);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ti ${icon}" style="font-size:16px;color:var(--${color}-700)"></i>
          </div>
          <div style="flex:1"><div style="font-weight:600;font-size:12.5px">${title}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${msg}</div></div>
          <span style="font-size:11px;color:var(--text-tertiary);flex-shrink:0">${time}</span>
        </div>`).join('')}
      </div>`;
    }

    else if (tab === 'security') {
      content.innerHTML = `<div class="grid-2">
        <div class="card">
          <div class="card-hd"><span class="card-title">Password & access policy</span></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Min password length</label><input class="form-input" type="number" value="10"></div>
            <div class="form-group"><label class="form-label">Session timeout (mins)</label><input class="form-input" type="number" value="60"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Max login attempts</label><input class="form-input" type="number" value="5"></div>
            <div class="form-group"><label class="form-label">Lockout duration (mins)</label><input class="form-input" type="number" value="30"></div>
          </div>
          ${[['Require uppercase letter',true],['Require number',true],['Require special character',true],['Require 2FA for all users',false],['Force password change every 90 days',false]].map(([label,on])=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:12.5px">${label}</span>
            <button class="toggle ${on?'on':''}" onclick="this.classList.toggle('on')"></button>
          </div>`).join('')}
          <button class="btn btn-primary" style="margin-top:12px" onclick="toast('Security settings saved')"><i class="ti ti-device-floppy"></i>Save</button>
        </div>
        <div class="card">
          <div class="card-hd"><span class="card-title">Active sessions</span></div>
          ${[['Chrome 125 · Windows 11','Victoria Island, Lagos','Current session'],['Safari 17 · iPhone','Lekki, Lagos','2 hrs ago'],['Chrome 124 · MacBook','Abuja','Yesterday 14:32']].map(([device,loc,time],i)=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <i class="ti ti-device-laptop" style="font-size:20px;color:var(--text-tertiary)"></i>
            <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${device}</div><div style="font-size:11.5px;color:var(--text-secondary)">${loc} · ${time}</div></div>
            ${i>0?'<button class="btn btn-sm btn-danger" style="padding:3px 8px;font-size:11px" onclick="toast(\'Session revoked\')">Revoke</button>':'<span class="badge b-green">Active</span>'}
          </div>`).join('')}
          <button class="btn btn-sm btn-danger" style="margin-top:10px" onclick="toast('All other sessions revoked')"><i class="ti ti-logout"></i>Revoke all other sessions</button>
        </div>
      </div>`;
    }

    else if (tab === 'integrity') {
      runLedgerIntegrityCheck(content);
    }
  }

  panel.innerHTML = `
  <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px;overflow-x:auto">
    ${[['profile','ti-building','Company'],['accounting','ti-calculator','Accounting'],['currency','ti-currency-naira','Currencies'],['picklists','ti-list','Picklists'],['reminders','ti-bell','Notifications'],['security','ti-shield','Security'],['integrity','ti-heart-rate-monitor','Integrity check']].map(([t,icon,label])=>`
    <button onclick="settingsTab('${t}',this)" id="stab-${t}" style="display:flex;align-items:center;gap:5px;padding:9px 14px;border:none;background:none;cursor:pointer;font-size:12.5px;font-family:var(--font);font-weight:600;color:${t===activeTab?'var(--primary)':'var(--text-secondary)'};border-bottom:2px solid ${t===activeTab?'var(--primary)':'transparent'};white-space:nowrap;transition:all .12s">
      <i class="ti ${icon}" style="font-size:14px"></i>${label}
    </button>`).join('')}
  </div>
  <div id="settings-tab-body"></div>`;

  window.settingsTab = function(tab, btn) {
    panel._activeTab = tab;
    document.querySelectorAll('[id^="stab-"]').forEach(b => {
      b.style.color = 'var(--text-secondary)';
      b.style.borderBottomColor = 'transparent';
    });
    if (btn) { btn.style.color = 'var(--primary)'; btn.style.borderBottomColor = 'var(--primary)'; }
    renderTab(tab);
  };

  window.renderPicklist = function(key) {
    panel._activePL = key;
    var PICKLIST_DEFS = [{key:'uom',label:'Units of measure',items:PICKLISTS.uom||[]},{key:'productCats',label:'Product categories',items:PICKLISTS.productCats||[]},{key:'deptList',label:'Departments',items:PICKLISTS.deptList||[]},{key:'paymentTerms',label:'Payment terms',items:PICKLISTS.paymentTerms||[]},{key:'expenseCategories',label:'Expense categories',items:PICKLISTS.expenseCategories||[]},{key:'taxTypes',label:'Tax types',items:PICKLISTS.taxTypes||[]},{key:'journalTypes',label:'Journal types',items:PICKLISTS.journalTypes||[]},{key:'dimensionTypes',label:'Dimension types',items:PICKLISTS.dimensionTypes||[]},{key:'incoterms',label:'Incoterms',items:PICKLISTS.incoterms||[]},{key:'assetStatuses',label:'Asset statuses',items:PICKLISTS.assetStatuses||[]}];
    var detail = document.getElementById('picklist-detail');
    if (detail) detail.innerHTML = renderPicklistDetail(key, PICKLIST_DEFS);
  };

  renderTab(activeTab);
}

// ── integrations ──────────────────────────────────────
BUILDERS.integrations = function(panel) {
  var INTEGRATIONS = [
    {id:'quickbooks',name:'QuickBooks',icon:'ti-calculator',cat:'Accounting import',status:'disconnected',color:'#2CA01C',desc:'Import COA, customers, suppliers, invoices and journals from QuickBooks Online or Desktop.'},
    {id:'sage',name:'Sage',icon:'ti-calculator',cat:'Accounting import',status:'disconnected',color:'#00DC82',desc:'Import from Sage 50, 200 or Business Cloud. Supports COA, journals and AR/AP balances.'},
    {id:'xero',name:'Xero',icon:'ti-calculator',cat:'Accounting import',status:'disconnected',color:'#13B5EA',desc:'Import COA, contacts, invoices and bank transactions from Xero.'},
    {id:'zoho',name:'Zoho Books',icon:'ti-calculator',cat:'Accounting import',status:'disconnected',color:'#E42527',desc:'Import customers, suppliers, invoices, bills, COA and opening balances from Zoho Books.'},
    {id:'paystack',name:'Paystack',icon:'ti-credit-card',cat:'Payments',status:'connected',color:'#00C3F7',desc:'Accept card and bank transfer payments directly on invoices.'},
    {id:'nibss',name:'NIBSS',icon:'ti-building-bank',cat:'Banking',status:'disconnected',color:'#006633',desc:'National Interbank Settlement System for bulk salary disbursement.'},
    {id:'google',name:'Google Workspace',icon:'ti-brand-google',cat:'Productivity',status:'connected',color:'#4285F4',desc:'Sync contacts, calendar and Drive for document storage.'},
    {id:'sendgrid',name:'SendGrid Email',icon:'ti-mail',cat:'Communication',status:'connected',color:'#1A82E2',desc:'Transactional emails for invoices, payslips and alerts.'},
    {id:'slack',name:'Slack',icon:'ti-brand-slack',cat:'Communication',status:'disconnected',color:'#4A154B',desc:'Post approval notifications and alerts to Slack channels.'},
    {id:'openai',name:'OpenAI',icon:'ti-robot',cat:'AI',status:'disconnected',color:'#412991',desc:'AI-powered transaction categorisation and report narratives.'},
    {id:'rest',name:'REST API',icon:'ti-api',cat:'Developer',status:'connected',color:'#6366F1',desc:'Full LeafTally API with OAuth 2.0 and webhook support.'},
    {id:'webhooks',name:'Webhooks',icon:'ti-webhook',cat:'Developer',status:'disconnected',color:'#8B5CF6',desc:'Send real-time event notifications to your own endpoints.'},
  ];

  var connected = INTEGRATIONS.filter(function(x){ return x.status==='connected'; }).length;
  var sections  = ['Accounting import','Payments','Banking','Productivity','Communication','AI','Developer'];

  var html = '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Connected</div><div class="kpi-value" style="color:var(--green-700)">' + connected + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Available</div><div class="kpi-value">' + INTEGRATIONS.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Accounting imports</div><div class="kpi-value">4</div><div class="kpi-sub">QB · Sage · Xero · Zoho</div></div>' +
    '</div>';

  sections.forEach(function(sec) {
    var items = INTEGRATIONS.filter(function(x){ return x.cat === sec; });
    if (!items.length) return;
    html += '<div style="margin-bottom:20px">';
    html += '<div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)">' + sec + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">';
    items.forEach(function(intg) {
      var isImport = intg.cat === 'Accounting import';
      var btnLabel = intg.status==='connected' ? '<i class="ti ti-settings"></i>Configure' : (isImport ? '<i class="ti ti-download"></i>Import from ' + intg.name : '<i class="ti ti-plug"></i>Connect');
      var btnClass = 'btn btn-sm' + (intg.status !== 'connected' ? ' btn-primary' : '');
      html += '<div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;background:var(--surface)">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
        '<div style="width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid ' + intg.color + '33;background:' + intg.color + '12">' +
        '<i class="ti ' + intg.icon + '" style="font-size:20px;color:' + intg.color + '"></i></div>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13px">' + intg.name + '</div></div>' +
        '<span class="badge ' + (intg.status==='connected' ? 'b-green' : 'b-gray') + '">' + (intg.status==='connected' ? 'Connected' : 'Not connected') + '</span></div>' +
        '<p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:12px">' + intg.desc + '</p>' +
        '<button class="' + btnClass + '" style="width:100%;justify-content:center" data-id="' + intg.id + '" data-name="' + intg.name + '" data-import="' + isImport + '">' + btnLabel + '</button>' +
        '</div>';
    });
    html += '</div></div>';
  });

  panel.innerHTML = html;

  // Wire buttons after render
  panel.querySelectorAll('button[data-id]').forEach(function(btn) {
    btn.onclick = function() {
      var id   = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var imp  = btn.getAttribute('data-import') === 'true';
      if (imp) { openImportWizard(id, name); }
      else { toast(name + ' — opening configuration'); }
    };
  });
}
