// ============================================================
// LeafTally — NAV utilities
// ============================================================

// nav
function nav(el, id) {
  // SA gets sadashboard instead of dashboard
  if (id === 'dashboard' && typeof currentUser !== 'undefined' && currentUser && currentUser.sa) {
    id = 'sadashboard';
  }

  // RBAC gate
  if (typeof canAccess === 'function' && !canAccess(id)) {
    document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
    if (el) el.classList.add('active');
    document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });
    var gatedPanel = document.getElementById('p-' + id);
    if (gatedPanel) {
      gatedPanel.classList.add('active');
      gatedPanel.innerHTML = '<div class="rbac-denied-overlay card"><i class="ti ti-lock"></i><h3>Access restricted</h3><p>Your role (<strong>' + (currentUser ? currentUser.role : '') + '</strong>) does not have permission to view this module. Contact your administrator.</p></div>';
    }
    var _pt = document.getElementById('page-title');
    if (_pt) _pt.textContent = 'Access restricted';
    return;
  }

  // Switch active nav item
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  if (el) el.classList.add('active');

  // Hide all panels
  document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });

  // Find and show target panel
  var panel = document.getElementById('p-' + id);
  if (!panel) {
    console.error('LeafTally: missing panel div for id=' + id);
    if (typeof toast === 'function') toast('Panel not configured: ' + id);
    return;
  }
  panel.classList.add('active');

  // Update topbar titles
  var _pt2 = document.getElementById('page-title');
  var _bc  = document.getElementById('breadcrumb');
  var _title = (typeof PAGES !== 'undefined' && PAGES[id]) ? PAGES[id] : id;
  if (_pt2) _pt2.textContent = _title;
  if (_bc)  _bc.textContent  = 'LeafTally / ' + _title;

  // Lazy-build: run builder once
  if (!panel.dataset.built) {
    panel.dataset.built = '1';
    if (typeof BUILDERS !== 'undefined' && typeof BUILDERS[id] === 'function') {
      try { BUILDERS[id](panel); }
      catch(err) { console.error('LeafTally builder error [' + id + ']:', err); }
    }
  }

  // Post-nav hooks
  if (id === 'trial')        { setTimeout(function(){ if(typeof rebuildTrialBalance!=='undefined') rebuildTrialBalance(); }, 80); }
  if (id === 'pnl')          { setTimeout(function(){ if(typeof rebuildPnL!=='undefined') rebuildPnL(); }, 80); }
  if (id === 'balancesheet') { setTimeout(function(){ if(typeof rebuildBalanceSheet!=='undefined') rebuildBalanceSheet(); }, 80); }
  if (id === 'cashflow')     { setTimeout(function(){ if(typeof rebuildCashFlow!=='undefined') rebuildCashFlow(); }, 80); }
  if (id === 'invoices')     { setTimeout(function(){ if(typeof upgradeInvLineInputs!=='undefined') upgradeInvLineInputs(); }, 300); }

  // Wire report PDF buttons
  if (id === 'pnl' || id === 'trial' || id === 'cashflow' || id === 'balancesheet') {
    setTimeout(function() {
      panel.querySelectorAll('button').forEach(function(b) {
        if (b.textContent.indexOf('PDF') !== -1) {
          b.onclick = (function(rid){ return function(){ downloadReportPDF(rid); }; })(id);
        }
      });
    }, 400);
  }

  // Sort first table in panel by date
  setTimeout(function() {
    var tbl = panel.querySelector('table[id]');
    if (tbl && typeof setupTableDefaults === 'function') setupTableDefaults(tbl.id);
  }, 200);
}

// canAccess
function canAccess(panelId) {
  if (!currentUser) return false;
  // Always-accessible panels regardless of role
  const always = ['dashboard','profile','legal','chat','tickets','sadashboard'];
  if (always.includes(panelId)) return true;
  if (currentUser.sa) {
    const saPerms = ROLE_PERMISSIONS['Super Admin'];
    if (saPerms[panelId] === undefined) return true; // unlisted = allow for SA
    return saPerms[panelId] && saPerms[panelId] !== 'none';
  }
  const perms = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS['Viewer'];
  const p = perms[panelId];
  if (p === undefined) return true; // unlisted panel = allow by default (fail open)
  return p && p !== 'none' && p !== false;
}

// enterApp
function enterApp() {
  document.getElementById('app-nav').style.display = 'flex';
  document.getElementById('app-main').style.display = 'flex';
  if (currentUser) {
    document.getElementById('user-name').textContent  = currentUser.name;
    document.getElementById('user-role').textContent  = currentUser.role;
    document.getElementById('user-avatar').textContent = currentUser.initials;
    if (document.getElementById('topbar-avatar')) document.getElementById('topbar-avatar').textContent = currentUser.initials;
    if (document.getElementById('topbar-name')) document.getElementById('topbar-name').textContent = currentUser.name;
    if (document.getElementById('topbar-role')) document.getElementById('topbar-role').textContent = currentUser.role;
    // SA vs tenant nav visibility
    if (currentUser.sa) {
      document.body.classList.add('role-sa');
    } else {
      document.body.classList.remove('role-sa');
    }
  }
  nav(document.querySelector('.nav-item.active'), 'dashboard');
  // First-time tour (only for tenant admin, not SA)
  const toured = localStorage.getItem('lt_toured');
  if (!toured && !currentUser?.sa) {
    setTimeout(startTour, 600);
  }
}

// doLogin
function doLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value;
  if (!email || !pass) { toast('Please enter email and password'); return; }
  const user = USERS[email] || { name:email.split('@')[0], initials:email[0].toUpperCase(), role:'Viewer', org:'Your Company', sa:false };
  currentUser = user;
  const accepted = localStorage.getItem('lt_tc');
  document.getElementById('login').style.display = 'none';
  var errEl2 = document.getElementById('login-error');
  if (errEl2) errEl2.style.display = 'none';
  if (!accepted) {
    document.getElementById('tc-modal').style.display = 'flex';
  } else {
    enterApp();
  }
}

// setLogin
function setLogin(email) {
  var emailEl = document.getElementById('l-email');
  var passEl  = document.getElementById('l-pass');
  var errEl   = document.getElementById('login-error');
  if (emailEl) emailEl.value = email;
  if (passEl)  passEl.value  = 'password123';
  if (errEl)   errEl.style.display = 'none';
  // Small animation to indicate selection
  var btn = event && event.currentTarget;
  if (btn) {
    var origBg = btn.style.background;
    btn.style.background = 'var(--green-50)';
    btn.style.borderColor = 'var(--primary)';
    setTimeout(function(){ btn.style.background=origBg; }, 800);
  }
}

// acceptTC
function acceptTC() {
  localStorage.setItem('lt_tc_accepted', '1');
  if (_origAcceptTC) _origAcceptTC();
  else {
    var modal = document.getElementById('tc-modal');
    if (modal) modal.style.display = 'none';
    if (typeof enterApp === 'function') enterApp();
  }
}

// startTourEnhanced
function startTourEnhanced() {
  _tourStep = 0;
  renderTourStepEnhanced();
  var overlay = document.getElementById('tour-overlay');
  if (overlay) overlay.style.display = 'flex';
}

// renderTourStepEnhanced
function renderTourStepEnhanced() {
  var step = TOUR_STEPS_ENHANCED[_tourStep];
  if (!step) return;
  var icon  = document.getElementById('tour-icon');
  var title = document.getElementById('tour-title');
  var body  = document.getElementById('tour-body');
  var label = document.getElementById('tour-step-label');
  var next  = document.getElementById('tour-next');
  var dots  = document.getElementById('tour-dots');
  if (icon)  icon.textContent  = step.icon;
  if (title) title.textContent = step.title;
  if (body)  body.textContent  = step.body;
  if (label) label.textContent = 'Step ' + (_tourStep+1) + ' of ' + TOUR_STEPS_ENHANCED.length;
  if (next)  next.textContent  = _tourStep < TOUR_STEPS_ENHANCED.length - 1 ? 'Next →' : 'Finish';
  if (dots) {
    dots.innerHTML = '';
    for (var i = 0; i < TOUR_STEPS_ENHANCED.length; i++) {
      var d = document.createElement('div');
      d.style.cssText = 'width:6px;height:6px;border-radius:50%;background:' + (i===_tourStep?'var(--primary)':'var(--border)');
      dots.appendChild(d);
    }
  }
  // Navigate to the highlighted panel if present
  if (step.highlight) {
    var navEl = document.querySelector('[onclick*="nav(this,\'' + step.highlight + '\'"]') ||
                document.querySelector('[onclick*="\'' + step.highlight + '\'"]');
    if (typeof nav === 'function') nav(navEl, step.highlight);
  }
}

// nextTourStep
function nextTourStep() {
  if (tourStep >= TOUR_STEPS.length - 1) {
    skipTour();
  } else {
    tourStep++;
    renderTourStep();
  }
}

// skipTour
function skipTour() {
  localStorage.setItem('lt_toured', '1');
  document.getElementById('tour-overlay').classList.remove('open');
  // Return to dashboard
  nav(document.querySelector('.nav-item[onclick*="\'dashboard\'"]'), 'dashboard');
}
