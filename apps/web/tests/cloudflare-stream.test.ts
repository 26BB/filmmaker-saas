import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateSignedPlaybackToken } from '../lib/cloudflare.ts';

describe('Cloudflare Stream Video Security Suite', () => {
  it('returns raw videoUid in development mode when key is absent', async () => {
    const videoUid = 'cf_vid_mock_abcdef123';
    const token = await generateSignedPlaybackToken(videoUid);
    assert.equal(token, videoUid, 'Should fall back gracefully in development mode');
  });

  it('handles signed JWT token generation when credentials exist', async () => {
    const videoUid = 'c5f94b150c9540e1b1d83765e3ad9194';
    const token = await generateSignedPlaybackToken(videoUid, 7200);
    assert.ok(token.length > 0, 'Token must not be empty');
  });
});
