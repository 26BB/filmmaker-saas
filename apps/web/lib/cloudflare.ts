import * as jose from 'jose';

interface DirectUploadOptions {
  maxDurationSeconds?: number;
  fileName: string;
  creatorId: string;
}

interface DirectUploadResult {
  uploadUrl: string;
  uid: string;
}

export async function initiateCloudflareDirectUpload({
  maxDurationSeconds = 14400, // 4 hours max
  fileName,
  creatorId,
}: DirectUploadOptions): Promise<DirectUploadResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    // Development / mock mode fallback
    const mockUid = `cf_stream_${Math.random().toString(36).substring(2, 11)}`;
    return {
      uploadUrl: `https://upload.videodelivery.net/tus/${mockUid}`,
      uid: mockUid,
    };
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Tus-Resumable': '1.0.0',
    },
    body: JSON.stringify({
      maxDurationSeconds,
      creator: creatorId,
      meta: {
        name: fileName,
        creatorId,
      },
      requireSignedURLs: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare Direct Upload initialization failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    uploadUrl: data.result.uploadURL,
    uid: data.result.uid,
  };
}

export async function generateSignedPlaybackToken(
  videoUid: string,
  expiresInSeconds: number = 7200 // 2 hours
): Promise<string> {
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;
  const privateKeyJwkOrPem = process.env.CLOUDFLARE_STREAM_JWK_KEY;

  if (!keyId || !privateKeyJwkOrPem) {
    // Fallback for development/testing
    return videoUid;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresInSeconds;

    let privateKey: jose.KeyLike | Uint8Array;
    if (privateKeyJwkOrPem.startsWith('-----BEGIN')) {
      privateKey = await jose.importPKCS8(privateKeyJwkOrPem, 'RS256');
    } else {
      const parsedJwk = JSON.parse(
        privateKeyJwkOrPem.startsWith('{')
          ? privateKeyJwkOrPem
          : Buffer.from(privateKeyJwkOrPem, 'base64').toString('utf8')
      );
      privateKey = await jose.importJWK(parsedJwk, 'RS256');
    }

    const jwt = await new jose.SignJWT({
      sub: videoUid,
      kid: keyId,
      accessRules: [
        {
          type: 'any',
          action: 'allow',
        },
      ],
    })
      .setProtectedHeader({ alg: 'RS256', kid: keyId })
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .sign(privateKey);

    return jwt;
  } catch (error) {
    console.error('Error signing Cloudflare Stream token:', error);
    return videoUid;
  }
}
