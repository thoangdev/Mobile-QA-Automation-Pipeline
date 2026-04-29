import newman from 'newman';
import * as path from 'path';
import * as fs from 'fs';
import { Env } from '../config/env';

const VALID_ENVS = ['staging', 'production'] as const;
type TestEnv = (typeof VALID_ENVS)[number];

function resolveTestEnv(): TestEnv {
  const env = Env.testEnv;
  if (!VALID_ENVS.includes(env)) {
    throw new Error(`Invalid TEST_ENV "${env}". Must be one of: ${VALID_ENVS.join(' | ')}`);
  }
  return env;
}

function assertFileExists(filePath: string, label: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

((): void => {
  const testEnv = resolveTestEnv();
  const reportDir = 'reports/api';
  const collectionPath = path.resolve('api-tests/collections/mobile-api.postman_collection.json');
  const envPath = path.resolve(`api-tests/environments/${testEnv}.postman_environment.json`);
  const junitPath = path.resolve(`${reportDir}/newman-${testEnv}-report.xml`);

  assertFileExists(collectionPath, 'Postman collection');
  assertFileExists(envPath, `Postman environment (${testEnv})`);

  fs.mkdirSync(reportDir, { recursive: true });

  console.log(`\n── Newman API Tests (${testEnv}) ──`);

  newman.run(
    {
      collection: collectionPath,
      environment: envPath,
      reporters: ['cli', 'junit'],
      reporter: { junit: { export: junitPath } },
      // Inject credentials from env so the collection never contains real secrets
      envVar: [
        { key: 'TEST_USERNAME', value: Env.testUsername },
        { key: 'TEST_PASSWORD', value: Env.testPassword },
      ],
    },
    (err, summary) => {
      if (err) {
        console.error(`\n✖  Newman runner error: ${err.message}`);
        process.exit(1);
      }

      const { stats } = summary.run;
      console.log(
        `\nResults: ${stats.tests.total} tests, ` +
          `${stats.assertions.total} assertions, ` +
          `${stats.assertions.failed} failed`,
      );
      console.log(`JUnit report: ${junitPath}`);

      if (summary.run.failures.length > 0) {
        console.error(`\n✖  ${summary.run.failures.length} API test(s) failed.`);
        process.exit(1);
      }

      console.log('\n✔  All API tests passed.');
    },
  );
})();
