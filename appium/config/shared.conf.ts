import type { Options } from '@wdio/types';
import * as fs from 'fs';
import { Env } from '../../config/env';

// Ensure the JUnit output directory exists before the runner starts
fs.mkdirSync('reports/appium', { recursive: true });

export const sharedConfig: Partial<Options.Testrunner> = {
  runner: 'local',
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: 'reports/appium',
        outputFileFormat: (options: { cid: string }) => `results-${options.cid}.xml`,
      },
    ],
  ],
  mochaOpts: {
    timeout: 120_000,
    retries: 2,
  },
  maxInstances: 1,
  logLevel: Env.logLevel,
  bail: 0,
  waitforTimeout: 30_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
};
