import * as fs from 'fs';
import * as path from 'path';
import { Env } from '../config/env';

const BS_UPLOAD_URL = 'https://api-cloud.browserstack.com/app-automate/upload';

type Platform = 'android' | 'ios';

function resolvePlatform(arg: string | undefined): Platform {
  if (arg === 'android' || arg === 'ios') return arg;
  throw new Error(
    `Invalid platform argument "${arg ?? ''}". Usage: ts-node scripts/upload-browserstack.ts android|ios`,
  );
}

function resolveAppPath(platform: Platform): string {
  const dir = path.resolve(platform === 'android' ? 'apps/android' : 'apps/ios');
  const ext = platform === 'android' ? '.apk' : '.ipa';
  const match = fs.readdirSync(dir).find((f) => f.endsWith(ext));
  if (!match) {
    throw new Error(
      `No ${ext} file found in ${dir}/\n` +
        `  → Place your app binary there (any filename ending in ${ext}).`,
    );
  }
  return path.join(dir, match);
}

async function uploadApp(platform: Platform): Promise<string> {
  const appPath = resolveAppPath(platform);
  const username = Env.browserstackUsername;
  const accessKey = Env.browserstackAccessKey;
  const credentials = Buffer.from(`${username}:${accessKey}`).toString('base64');

  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(appPath)]), path.basename(appPath));

  console.log(`\n── BrowserStack Upload (${platform}) ──`);
  console.log(`Binary: ${appPath}`);

  const response = await fetch(BS_UPLOAD_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Upload failed (HTTP ${response.status}): ${body}`);
  }

  const data = (await response.json()) as { app_url: string };
  const envKey = platform === 'android' ? 'BS_ANDROID_APP_HASH' : 'BS_IOS_APP_HASH';

  console.log(`\n✔  Upload successful.`);
  console.log(`   App URL : ${data.app_url}`);
  console.log(`\n   Set this in .env or as a CI secret:`);
  console.log(`   ${envKey}=${data.app_url}`);

  return data.app_url;
}

const platform = resolvePlatform(process.argv[2]);
uploadApp(platform).catch((err: Error) => {
  console.error(`\n✖  ${err.message}`);
  process.exit(1);
});
