import test from 'node:test';
import assert from 'node:assert/strict';
process.env.SUPABASE_URL = 'http://example.com';
process.env.SUPABASE_SERVICE_ROLE = 'service-role';
const { getUserIdFromAuth, supabaseAdmin } = await import('./supabase.js');

test('returns null when Authorization header is missing', async () => {
  const originalGetUser = supabaseAdmin.auth.getUser;
  let called = false;
  supabaseAdmin.auth.getUser = async () => {
    called = true;
    return { data: { user: { id: 'should-not-be-used' } } } as any;
  };

  const result = await getUserIdFromAuth(undefined);

  assert.equal(result, null);
  assert.equal(called, false);

  supabaseAdmin.auth.getUser = originalGetUser;
});

test('extracts user id from valid Bearer token', async () => {
  const originalGetUser = supabaseAdmin.auth.getUser;
  supabaseAdmin.auth.getUser = async (token: string) => {
    assert.equal(token, 'validtoken');
    return { data: { user: { id: 'user-123' } } } as any;
  };

  const result = await getUserIdFromAuth('Bearer validtoken');

  assert.equal(result, 'user-123');

  supabaseAdmin.auth.getUser = originalGetUser;
});

test('throws on malformed token', async () => {
  const originalGetUser = supabaseAdmin.auth.getUser;
  supabaseAdmin.auth.getUser = async () => {
    throw new Error('Invalid token');
  };

  await assert.rejects(() => getUserIdFromAuth('Bearer malformed'));

  supabaseAdmin.auth.getUser = originalGetUser;
});
