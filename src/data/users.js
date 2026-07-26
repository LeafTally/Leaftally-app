// ============================================================
// LeafTally — USERS seed data
// Replace with real API calls in production
// ============================================================

// USERS
window.USERS = {
  'amaka@acmetrading.ng':  { name:'Amaka Adeyemi',  initials:'AA', role:'Tenant Admin',  org:'Acme Trading Ltd',  sa:false },
  'admin@leaftally.io':    { name:'LeafTally Admin', initials:'LA', role:'Super Admin',   org:'LeafTally',         sa:true  },
};

// USERS_DB
window.USERS_DB = {
  'amaka@acmetrading.ng':   { name:'Amaka Adeyemi',     initials:'AA', role:'Tenant Admin', org:'Acme Trading Ltd', sa:false },
  'chukwu@acmetrading.ng':  { name:'Chukwuemeka Obi',   initials:'CO', role:'Accountant',   org:'Acme Trading Ltd', sa:false },
  'funmi@acmetrading.ng':   { name:'Funmi Adeola',      initials:'FA', role:'HR Manager',   org:'Acme Trading Ltd', sa:false },
  'babatunde@acmetrading.ng':{ name:'Babatunde Adeyemi',initials:'BA', role:'Cashier',      org:'Acme Trading Ltd', sa:false },
  'viewer@acmetrading.ng':  { name:'Kelechi Okonkwo',   initials:'KO', role:'Viewer',       org:'Acme Trading Ltd', sa:false },
  'admin@leaftally.io':     { name:'LeafTally Admin',   initials:'LA', role:'Super Admin',  org:'LeafTally',        sa:true  },
};

// ROLE_PERMISSIONS
window.ROLE_PERMISSIONS = {
  'Tenant Admin': {
    // Full access to all tenant modules
    dashboard:true, users:'admin', roles:'admin', subscription:'admin', billing:'read',
    settings:'admin', coa:'admin', gl:'admin', expenses:'admin', assets:'admin',
    projects:'admin', budget:'admin', revrec:'admin', ledger:'read', trial:'read',
    yearend:'admin', pnl:'read', balancesheet:'read', cashflow:'read', health:'read', banking:'admin',
    reports:'read', pos:'admin', inventory:'admin', clients:'admin', invoices:'admin',
    suppliers:'admin', bills:'admin', shipments:'admin', employees:'admin', payroll:'admin',
    materials:'admin', bom:'admin', prodorders:'admin', invadjust:'admin', invlayers:'read',
    integrations:'admin', profile:'admin', chat:'read', tickets:'admin', legal:'read',
    dimensions:'admin', migration:'admin', audittrail:'read', multientity:'read',
    clientsubmission:'none', accountant:'read', referral:'read', doccenter:'read',
    testguide:'none', superadmin:'none', useranalytics:'none', banners:'none',
    releasenotes:'none', training:'read', sadashboard:'none',
  },
  'Accountant': {
    dashboard:true, users:'none', roles:'none', subscription:'read', billing:'read',
    settings:'read', coa:'write', gl:'admin', expenses:'write', assets:'read',
    projects:'read', budget:'read', revrec:'write', ledger:'read', trial:'read',
    yearend:'read', pnl:'read', balancesheet:'read', cashflow:'read', health:'read', banking:'read',
    reports:'read', pos:'none', inventory:'read', clients:'read', invoices:'write',
    suppliers:'read', bills:'write', shipments:'read', employees:'none', payroll:'none',
    materials:'read', bom:'read', prodorders:'none', invadjust:'none', invlayers:'read',
    integrations:'none', profile:'admin', chat:'read', tickets:'write', legal:'read',
    dimensions:'read', migration:'none', audittrail:'none', multientity:'none',
    clientsubmission:'none', accountant:'none', referral:'none', doccenter:'none',
    testguide:'none', superadmin:'none', useranalytics:'none', banners:'none',
    releasenotes:'none', training:'read', sadashboard:'none',
  },
  'HR Manager': {
    dashboard:true, users:'none', roles:'none', subscription:'none', billing:'none',
    settings:'read', coa:'none', gl:'none', expenses:'admin', assets:'none',
    projects:'none', budget:'none', revrec:'none', ledger:'none', trial:'none',
    yearend:'none', pnl:'none', balancesheet:'none', balancesheet:'none', cashflow:'none', health:'none', banking:'none',
    reports:'none', pos:'none', inventory:'none', clients:'none', invoices:'none',
    suppliers:'none', bills:'none', shipments:'none', employees:'admin', payroll:'admin',
    materials:'none', bom:'none', prodorders:'none', invadjust:'none', invlayers:'none',
    integrations:'none', profile:'admin', chat:'read', tickets:'write', legal:'read',
    dimensions:'none', migration:'none', audittrail:'none', multientity:'none',
    clientsubmission:'none', accountant:'none', referral:'none', doccenter:'none',
    testguide:'none', superadmin:'none', useranalytics:'none', banners:'none',
    releasenotes:'none', training:'read', sadashboard:'none',
  },
  'Cashier': {
    dashboard:true, users:'none', roles:'none', subscription:'none', billing:'none',
    settings:'none', coa:'none', gl:'none', expenses:'write', assets:'none',
    projects:'none', budget:'none', revrec:'none', ledger:'none', trial:'none',
    yearend:'none', pnl:'none', cashflow:'none', health:'none', banking:'none',
    reports:'none', pos:'admin', inventory:'read', clients:'read', invoices:'write',
    suppliers:'none', bills:'none', shipments:'none', employees:'none', payroll:'none',
    materials:'none', bom:'none', prodorders:'none', invadjust:'none', invlayers:'none',
    integrations:'none', profile:'admin', chat:'read', tickets:'write', legal:'read',
    dimensions:'none', migration:'none', audittrail:'none', multientity:'none',
    clientsubmission:'none', accountant:'none', referral:'none', doccenter:'none',
    testguide:'none', superadmin:'none', useranalytics:'none', banners:'none',
    releasenotes:'none', training:'read', sadashboard:'none',
  },
  'Viewer': {
    dashboard:true, users:'none', roles:'none', subscription:'none', billing:'none',
    settings:'none', coa:'read', gl:'read', expenses:'read', assets:'read',
    projects:'read', budget:'read', revrec:'read', ledger:'read', trial:'read',
    yearend:'none', pnl:'read', balancesheet:'read', cashflow:'read', health:'read', banking:'none',
    reports:'read', pos:'none', inventory:'read', clients:'read', invoices:'read',
    suppliers:'read', bills:'read', shipments:'read', employees:'none', payroll:'none',
    materials:'read', bom:'read', prodorders:'read', invadjust:'read', invlayers:'read',
    integrations:'none', profile:'admin', chat:'read', tickets:'write', legal:'read',
    dimensions:'read', migration:'none', audittrail:'none', multientity:'none',
    clientsubmission:'none', accountant:'none', referral:'none', doccenter:'none',
    testguide:'none', superadmin:'none', useranalytics:'none', banners:'none',
    releasenotes:'none', training:'read', sadashboard:'none',
  },
  'Super Admin': {
    // Full access to SA modules, no access to tenant accounting
    sadashboard:true, dimensions:'admin', audittrail:'admin', multientity:'admin',
    clientsubmission:'admin', accountant:'admin', referral:'admin', doccenter:'admin',
    testguide:'admin', superadmin:'admin', useranalytics:'admin', subscription:'admin',
    banners:'admin', chat:'admin', tickets:'admin', releasenotes:'admin',
    training:'admin', legal:'admin', migration:'admin', profile:'admin', settings:'read',
    integrations:'admin', billing:'admin',
  },
};
