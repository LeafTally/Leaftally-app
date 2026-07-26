// ============================================================
// LeafTally — Login component
// ============================================================

export const loginHTML = `
<div id="login">
  <!-- Full-page dark background with centered card -->
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(22,163,74,.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 20%,rgba(22,163,74,.06) 0%,transparent 50%);pointer-events:none"></div>

  <!-- Top logo bar -->
  <div style="position:absolute;top:0;left:0;right:0;padding:22px 36px;display:flex;align-items:center;justify-content:space-between;z-index:1">
    <div style="display:flex;align-items:center;gap:9px">
      <div style="width:32px;height:32px;background:var(--green-600);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(22,163,74,.4)">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 3-11 8-2 2-2.03 4.5-1.08 6.12-.14-.28-.21-.57-.21-.83-.05-1.75 2.33-5.04 7.29-8.29Z"/></svg>
      </div>
      <span style="font-size:17px;font-weight:700;color:#fff;letter-spacing:-.3px">Leaf<span style="color:var(--green-400)">Tally</span></span>
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,.35)">Nigeria's enterprise accounting platform</div>
  </div>

  <!-- Centre card -->
  <div style="position:relative;z-index:1;width:100%;max-width:440px;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px 44px;box-shadow:0 24px 60px rgba(0,0,0,.4)">

    <!-- Card header -->
    <div style="text-align:center;margin-bottom:32px">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,var(--green-600),var(--green-700));border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;box-shadow:0 6px 20px rgba(22,163,74,.35)">
        <svg width="26" height="26" fill="white" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 3-11 8-2 2-2.03 4.5-1.08 6.12-.14-.28-.21-.57-.21-.83-.05-1.75 2.33-5.04 7.29-8.29Z"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:var(--text-primary);letter-spacing:-.5px;margin-bottom:5px">Welcome back</div>
      <div style="font-size:13.5px;color:var(--text-secondary)">Sign in to your LeafTally account</div>
    </div>

    <!-- Form -->
    <div class="form-group" style="margin-bottom:14px">
      <label class="form-label">Email address</label>
      <div style="position:relative">
        <i class="ti ti-mail" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--text-tertiary)"></i>
        <input class="form-input" id="l-email" type="email" value="amaka@acmetrading.ng" placeholder="you@company.ng" style="height:42px;padding-left:34px">
      </div>
    </div>
    <div class="form-group" style="margin-bottom:6px">
      <label class="form-label">Password</label>
      <div style="position:relative">
        <i class="ti ti-lock" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--text-tertiary)"></i>
        <input class="form-input" id="l-pass" type="password" value="password123" placeholder="Enter your password" style="height:42px;padding-left:34px;padding-right:42px">
        <button onclick="var e=document.getElementById('l-pass');e.type=e.type==='password'?'text':'password'" style="position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:3px;display:flex;align-items:center">
          <i class="ti ti-eye" style="font-size:15px"></i>
        </button>
      </div>
    </div>
    <div style="text-align:right;margin-bottom:22px">
      <a href="#" onclick="toast('Password reset email sent');return false" style="font-size:12px;color:var(--primary);text-decoration:none">Forgot password?</a>
    </div>

    <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center;height:44px;font-size:14px;font-weight:700;border-radius:10px" onclick="doLogin()" id="login-btn">
      <i class="ti ti-login" style="font-size:16px"></i>Sign in
    </button>

    <!-- Error message -->
    <div id="login-error" style="display:none;margin-top:12px;padding:10px 14px;background:var(--red-50);border:1px solid var(--red-200);border-radius:8px;font-size:12.5px;color:var(--red-700);text-align:center">
      <i class="ti ti-alert-circle" style="margin-right:4px"></i><span id="login-error-msg">Invalid email or password.</span>
    </div>

    <!-- Divider -->
    <div style="display:flex;align-items:center;gap:12px;margin:22px 0">
      <div style="flex:1;height:1px;background:var(--border)"></div>
      <span style="font-size:11.5px;color:var(--text-tertiary);white-space:nowrap">Demo accounts</span>
      <div style="flex:1;height:1px;background:var(--border)"></div>
    </div>

    <!-- Demo accounts grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
      <button onclick="setLogin('amaka@acmetrading.ng')" style="text-align:left;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--green-50)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
        <div style="font-size:11px;font-weight:700;color:var(--text-primary)">Tenant Admin</div>
        <div style="font-size:10.5px;color:var(--text-tertiary);margin-top:1px">amaka@acmetrading.ng</div>
      </button>
      <button onclick="setLogin('chukwu@acmetrading.ng')" style="text-align:left;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--green-50)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
        <div style="font-size:11px;font-weight:700;color:var(--text-primary)">Accountant</div>
        <div style="font-size:10.5px;color:var(--text-tertiary);margin-top:1px">chukwu@acmetrading.ng</div>
      </button>
      <button onclick="setLogin('funmi@acmetrading.ng')" style="text-align:left;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--green-50)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
        <div style="font-size:11px;font-weight:700;color:var(--text-primary)">HR Manager</div>
        <div style="font-size:10.5px;color:var(--text-tertiary);margin-top:1px">funmi@acmetrading.ng</div>
      </button>
      <button onclick="setLogin('babatunde@acmetrading.ng')" style="text-align:left;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--green-50)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
        <div style="font-size:11px;font-weight:700;color:var(--text-primary)">Cashier</div>
        <div style="font-size:10.5px;color:var(--text-tertiary);margin-top:1px">babatunde@acmetrading.ng</div>
      </button>
      <button onclick="setLogin('viewer@acmetrading.ng')" style="text-align:left;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--green-50)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
        <div style="font-size:11px;font-weight:700;color:var(--text-primary)">Viewer</div>
        <div style="font-size:10.5px;color:var(--text-tertiary);margin-top:1px">viewer@acmetrading.ng</div>
      </button>
      <button onclick="setLogin('admin@leaftally.io')" style="text-align:left;padding:8px 10px;border:1px solid var(--amber-200);border-radius:8px;background:var(--amber-50);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--amber-400)'" onmouseout="this.style.borderColor='var(--amber-200)'">
        <div style="font-size:11px;font-weight:700;color:var(--amber-800)">⚡ Super Admin</div>
        <div style="font-size:10.5px;color:var(--amber-700);margin-top:1px">admin@leaftally.io</div>
      </button>
    </div>

    <div style="text-align:center;margin-top:20px;font-size:11.5px;color:var(--text-tertiary)">
      All demo passwords: <code style="font-family:monospace;background:var(--zinc-100);padding:1px 6px;border-radius:4px">password123</code>
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:11px;color:rgba(255,255,255,.2)">
    © 2026 LeafTally Technologies Ltd &nbsp;·&nbsp; NDPR compliant &nbsp;·&nbsp; Lagos, Nigeria
  </div>
</div>
`;

export function initLogin() {
  // Wire setLogin buttons after mount
  document.querySelectorAll('[onclick^="setLogin"]').forEach(function(btn) {
    // already wired via inline onclick
  });

  // Enter key submits login
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const login = document.getElementById('login');
      if (login && login.style.display !== 'none') {
        if (typeof doLogin === 'function') doLogin();
      }
    }
  });
}
