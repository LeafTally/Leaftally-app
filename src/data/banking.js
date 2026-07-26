// ============================================================
// LeafTally — BANKING seed data
// Replace with real API calls in production
// ============================================================

// BANK_ACCOUNTS
window.BANK_ACCOUNTS = [
  {id:'BA-001', bank:'GTBank', type:'Current', number:'0123456789', balance:5241375, currency:'NGN', status:'Active', last:'Today 09:41'},
  {id:'BA-002', bank:'Zenith Bank', type:'Savings', number:'9876543210', balance:1200000, currency:'NGN', status:'Active', last:'Yesterday'},
];

// BANK_TRANSACTIONS
window.BANK_TRANSACTIONS = [
  {date:'2026-06-23', desc:'Invoice payment — Dangote Foods INV-0041', ref:'TXN-8821', debit:0, credit:419250, bal:5241375, account:'GTBank'},
  {date:'2026-06-22', desc:'Payroll disbursement Jun 2026', ref:'TXN-8820', debit:973400, credit:0, bal:4822125, account:'GTBank'},
  {date:'2026-06-20', desc:'Conoil Nigeria — BILL-2026-0045', ref:'TXN-8819', debit:245000, credit:0, bal:5795525, account:'GTBank'},
  {date:'2026-06-18', desc:'Invoice payment — MTN Nigeria INV-0040', ref:'TXN-8818', debit:0, credit:247250, bal:6040525, account:'GTBank'},
  {date:'2026-06-15', desc:'Office rent — June 2026', ref:'TXN-8817', debit:240000, credit:0, bal:5793275, account:'GTBank'},
  {date:'2026-06-10', desc:'Zenith transfer — savings top-up', ref:'TXN-8816', debit:200000, credit:0, bal:6033275, account:'GTBank'},
  {date:'2026-06-10', desc:'Transfer from GTBank current', ref:'TXN-1021', debit:0, credit:200000, bal:1200000, account:'Zenith Bank'},
];
