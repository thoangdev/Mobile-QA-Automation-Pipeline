import type { Capabilities, Options } from '@wdio/types';
import { Env } from '../../config/env';
import { sharedConfig } from './shared.conf';

type TestrunnerConfig = Options.Testrunner & Capabilities.WithRequestedTestrunnerCapabilities;

export const config: TestrunnerConfig = {
  ...sharedConfig,

  // BrowserStack remote hub
  user: Env.browserstackUsername,
  key: Env.browserstackAccessKey,
  hostname: 'hub.browserstack.com',
  path: '/wd/hub',
  port: 443,
  protocol: 'https',

  services: [['browserstack', { browserstackLocal: false }]],

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 15 Pro',
      'appium:platformVersion': '17',
      'appium:automationName': 'XCUITest',
      'appium:app': Env.iosAppHash,
      'appium:newCommandTimeout': 90,
      'bstack:options': {
        projectName: Env.bsProjectName,
        buildName: `Build ${Env.githubRunNumber}`,
        sessionName: 'iOS Tests',
      },
    },
    // Add more devices from the BrowserStack matrix as needed:
    // {
    //   platformName: 'iOS',
    //   'appium:deviceName':      'iPhone 14',
    //   'appium:platformVersion': '16',
    //   'appium:automationName':  'XCUITest',
    //   'appium:app':             Env.iosAppHash,
    //   'bstack:options': { projectName: Env.bsProjectName, buildName: `Build ${Env.githubRunNumber}`, sessionName: 'iOS Tests — iPhone 14' },
    // },
  ],

  specs: ['./appium/tests/**/*.spec.ts'],
  exclude: [],
};
