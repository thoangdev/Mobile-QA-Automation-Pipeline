import * as fs from 'fs';
import * as path from 'path';
import { Env } from '../config/env';

const SCAN_CONFIG_PATH = 'security/mobsf/scan-config.json';

interface ScanConfig {
  scan_targets:       { android: string; ios: string };
  report_output:      string;
  severity_threshold: { block_on: string };
}

interface MobSFUploadResponse { hash: string; file_name: string }
interface MobSFFinding        { severity: string; title: string }
interface MobSFReport         { findings?: MobSFFinding[]; appsec?: { security_score: number } }

type Platform = 'android' | 'ios';

function loadScanConfig(): ScanConfig {
  if (!fs.existsSync(SCAN_CONFIG_PATH)) {
    throw new Error(`Scan config not found: ${SCAN_CONFIG_PATH}`);
  }
  try {
    return JSON.parse(fs.readFileSync(SCAN_CONFIG_PATH, 'utf-8')) as ScanConfig;
  } catch {
    throw new Error(`Failed to parse ${SCAN_CONFIG_PATH} — ensure it is valid JSON.`);
  }
}

function resolvePlatform(arg: string | undefined): Platform {
  if (arg === 'ios') return 'ios';
  if (!arg || arg === 'android') return 'android';
  throw new Error(`Invalid platform "${arg}". Expected: android | ios`);
}

async function mobsfPost(
  url: string,
  apiKey: string,
  endpoint: string,
  body: string,
): Promise<Response> {
  return fetch(`${url}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

async function upload(url: string, apiKey: string, appPath: string): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(appPath)]), path.basename(appPath));

  const res = await fetch(`${url}/api/v1/upload`, {
    method: 'POST',
    headers: { Authorization: apiKey },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`MobSF upload failed (HTTP ${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as MobSFUploadResponse;
  console.log(`   Uploaded : ${data.file_name}`);
  console.log(`   Hash     : ${data.hash}`);
  return data.hash;
}

async function scan(url: string, apiKey: string, hash: string): Promise<void> {
  const res = await mobsfPost(url, apiKey, '/api/v1/scan', `hash=${hash}`);
  if (!res.ok) {
    throw new Error(`MobSF scan failed (HTTP ${res.status}): ${await res.text()}`);
  }
}

async function getReport(url: string, apiKey: string, hash: string): Promise<MobSFReport> {
  const res = await mobsfPost(url, apiKey, '/api/v1/report_json', `hash=${hash}`);
  if (!res.ok) {
    throw new Error(`MobSF report fetch failed (HTTP ${res.status}): ${await res.text()}`);
  }
  return res.json() as Promise<MobSFReport>;
}

(async (): Promise<void> => {
  const mobsfUrl = Env.mobsfUrl;   // throws EnvError if not set
  const apiKey   = Env.mobsfApiKey;

  const config   = loadScanConfig();
  const platform = resolvePlatform(process.argv[2]);
  const appPath  = platform === 'ios' ? config.scan_targets.ios : config.scan_targets.android;

  if (!fs.existsSync(appPath)) {
    throw new Error(
      `App binary not found: ${appPath}\n` +
        `  → Build the app and place it at that path, or update scan-config.json.`,
    );
  }

  console.log(`\n── MobSF Security Scan (${platform}) ──`);
  console.log(`   Target : ${appPath}`);

  const hash = await upload(mobsfUrl, apiKey, appPath);

  console.log('   Running scan…');
  await scan(mobsfUrl, apiKey, hash);
  console.log('   Scan complete.');

  console.log('   Fetching report…');
  const report = await getReport(mobsfUrl, apiKey, hash);

  fs.mkdirSync(path.dirname(config.report_output), { recursive: true });
  fs.writeFileSync(config.report_output, JSON.stringify(report, null, 2));
  console.log(`   Report saved: ${config.report_output}`);

  const criticals = (report.findings ?? []).filter(
    (f) => f.severity === config.severity_threshold.block_on,
  );

  if (criticals.length > 0) {
    console.error(`\n✖  ${criticals.length} CRITICAL finding(s) — pipeline blocked:`);
    criticals.forEach((f) => console.error(`   • ${f.title}`));
    process.exit(1);
  }

  console.log('\n✔  No critical security findings. Proceeding.');
})().catch((err: Error) => {
  console.error(`\n✖  ${err.message}`);
  process.exit(1);
});
