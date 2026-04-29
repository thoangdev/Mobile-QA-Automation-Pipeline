import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env once, at module import time, before any accessor is called.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ─── Internal helpers ─────────────────────────────────────────────────────────

class EnvError extends Error {
  constructor(key: string) {
    super(
      `Required environment variable "${key}" is not set.\n` +
        `  → Copy .env.example to .env and fill in the value.`,
    );
    this.name = 'EnvError';
  }
}

/**
 * Returns the value of an env var, throwing a clear error if it is missing or empty.
 * Use for credentials and URLs that must be present at runtime.
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new EnvError(key);
  return value;
}

/**
 * Returns the value of an env var, or `fallback` if it is absent.
 * Use for optional config that has a sensible default.
 */
function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

// ─── Typed environment surface ────────────────────────────────────────────────

/**
 * Central, typed access point for every environment variable used in the pipeline.
 * All `required` getters throw `EnvError` at access time if the variable is absent,
 * giving a clear message instead of a cryptic undefined reference.
 */
export const Env = {
  // BrowserStack
  get browserstackUsername() {
    return required('BROWSERSTACK_USERNAME');
  },
  get browserstackAccessKey() {
    return required('BROWSERSTACK_ACCESS_KEY');
  },

  // App hashes — populated by `npm run upload:android|ios` and passed to CI
  get androidAppHash() {
    return optional('BS_ANDROID_APP_HASH', 'bs://PLACEHOLDER_APP_HASH');
  },
  get iosAppHash() {
    return optional('BS_IOS_APP_HASH', 'bs://PLACEHOLDER_APP_HASH');
  },

  // BrowserStack project label (shown in the BrowserStack dashboard)
  get bsProjectName() {
    return optional('BS_PROJECT_NAME', 'Mobile QA Pipeline');
  },

  // MobSF
  get mobsfUrl() {
    return required('MOBSF_URL').replace(/\/$/, '');
  },
  get mobsfApiKey() {
    return required('MOBSF_API_KEY');
  },

  // Percy
  get percyToken() {
    return optional('PERCY_TOKEN', '');
  },

  // Notifications
  get slackWebhook() {
    return required('SLACK_WEBHOOK');
  },
  get discordWebhook() {
    return required('DISCORD_WEBHOOK');
  },

  // Test credentials
  get testEnv() {
    return optional('TEST_ENV', 'staging') as 'staging' | 'production';
  },
  get testUsername() {
    return optional('TEST_USERNAME', 'placeholder@example.com');
  },
  get testPassword() {
    return optional('TEST_PASSWORD', 'PlaceholderPassword1!');
  },

  // CI / GitHub Actions context
  get githubRunNumber() {
    return optional('GITHUB_RUN_NUMBER', '0');
  },
  get githubRefName() {
    return optional('GITHUB_REF_NAME', 'local');
  },
  get githubServerUrl() {
    return optional('GITHUB_SERVER_URL', '');
  },
  get githubRepository() {
    return optional('GITHUB_REPOSITORY', '');
  },

  // Per-step pipeline result summaries (set by CI after each step, consumed by notifiers)
  get reportSecurity() {
    return optional('REPORT_SECURITY', '? Critical  ? Medium');
  },
  get reportApi() {
    return optional('REPORT_API', '? Passed  ? Failed');
  },
  get reportSmoke() {
    return optional('REPORT_SMOKE', '? Passed  ? Failed');
  },
  get reportRegression() {
    return optional('REPORT_REGRESSION', '? Passed  ? Failed');
  },
  get reportVisual() {
    return optional('REPORT_VISUAL', '? Approved  ? Diffs');
  },
  get reportA11y() {
    return optional('REPORT_A11Y', '? Violations');
  },

  // Logging
  get logLevel() {
    return optional('LOG_LEVEL', 'info') as
      | 'trace'
      | 'debug'
      | 'info'
      | 'warn'
      | 'error'
      | 'silent';
  },
} as const;

// ─── Full-pipeline validation (used by `npm run validate:env`) ────────────────

const REQUIRED_KEYS: ReadonlyArray<string> = [
  'BROWSERSTACK_USERNAME',
  'BROWSERSTACK_ACCESS_KEY',
  'MOBSF_URL',
  'MOBSF_API_KEY',
  'SLACK_WEBHOOK',
  'DISCORD_WEBHOOK',
  'TEST_USERNAME',
  'TEST_PASSWORD',
];

/**
 * Validates that every key required to run the full pipeline is set.
 * Throws a single aggregated error listing all missing keys.
 */
export function validateAllRequired(): void {
  const missing = REQUIRED_KEYS.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
        missing.map((k) => `  • ${k}`).join('\n') +
        `\n\nCopy .env.example → .env and fill in the values.`,
    );
  }
}
