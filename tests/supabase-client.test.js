const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSupabaseConfig } = require('../src/lib/supabase-client');

test('buildSupabaseConfig returns enabled state when URL and service role key are provided', () => {
  const config = buildSupabaseConfig({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  });

  assert.equal(config.enabled, true);
  assert.equal(config.url, 'https://example.supabase.co');
});

test('buildSupabaseConfig disables Supabase when credentials are missing', () => {
  const config = buildSupabaseConfig({});

  assert.equal(config.enabled, false);
  assert.equal(config.url, undefined);
});
