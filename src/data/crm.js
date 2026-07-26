// ============================================================
// LeafTally — CRM seed data
// Replace with real API calls in production
// ============================================================

// CUSTOMERS_DB
window.CUSTOMERS_DB = [
  {id:'C-001',name:'Dangote Foods Ltd',email:'accounts@dangote.ng',phone:'0801 234 5678',address:'Ikorodu Industrial Estate, Lagos',tin:'31234567-0001',terms:'Net 30',credit:'5000000',balance:'483,750',status:'Active'},
  {id:'C-002',name:'MTN Nigeria Plc',email:'finance@mtn.ng',phone:'0802 345 6789',address:'MTN House, Falomo, Lagos',tin:'41234567-0001',terms:'Net 15',credit:'10000000',balance:'0',status:'Active'},
  {id:'C-003',name:'Lagos State Govt',email:'finance@lagosstate.gov.ng',phone:'0803 456 7890',address:'Alausa Secretariat, Ikeja',tin:'51234567-0001',terms:'Net 60',credit:'50000000',balance:'850,000',status:'Active'},
  {id:'C-004',name:'Nestlé Nigeria Plc',email:'procurement@nestle.ng',phone:'0804 567 8901',address:'22/24 Industrial Avenue, Ilupeju',tin:'61234567-0001',terms:'Net 30',credit:'8000000',balance:'0',status:'Active'},
];

// SUPPLIERS_DB
window.SUPPLIERS_DB = [
  {id:'S-001',name:'Conoil Nigeria Ltd',email:'billing@conoil.ng',phone:'0801-111-0001',terms:'Net 30',status:'Active'},
  {id:'S-002',name:'MTN Business',email:'enterprise@mtn.ng',phone:'0802-111-0002',terms:'Net 15',status:'Active'},
  {id:'S-003',name:'Lagos Electricity Board',email:'supply@leb.gov.ng',phone:'0803-111-0003',terms:'Due on receipt',status:'Active'},
  {id:'S-004',name:'Perkins Nigeria Ltd',email:'orders@perkins.ng',phone:'0804-111-0004',terms:'Net 60',status:'Active'},
];

// SHIPMENTS_DB
window.SHIPMENTS_DB = [
  {ref:'SHP-008', supplier:'Perkins Nigeria', po:'PO-021', eta:'2026-06-30', baseCost:380000, freight:28000, duties:12000, insurance:5000, status:'In transit', incoterm:'CIF'},
  {ref:'SHP-007', supplier:'Conoil Nigeria',  po:'PO-020', eta:'2026-06-25', baseCost:260000, freight:15000, duties:10000, insurance:3000, status:'Received',  incoterm:'FOB'},
  {ref:'SHP-006', supplier:'MTN Business',    po:'PO-019', eta:'2026-06-20', baseCost:42000,  freight:3000,  duties:0,     insurance:500,  status:'Received',  incoterm:'EXW'},
];
