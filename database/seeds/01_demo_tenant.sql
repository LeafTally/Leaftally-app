-- Demo tenant for development
INSERT INTO tenants (id, name, plan, status) VALUES
  ('t-001', 'Acme Trading Ltd',      'business',   'active'),
  ('t-002', 'Lagos Bakeries Ltd',    'starter',    'active'),
  ('t-003', 'VicTech Solutions',     'enterprise', 'active')
ON CONFLICT DO NOTHING;
