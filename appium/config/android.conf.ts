import type { Options } from '@wdio/types';
import { Env } from '../../config/env';
import { sharedConfig } from './shared.conf';

export const config: Options.Testrunner = {
  ...sharedConfig,

  // BrowserStack remote hub
  user:     Env.browserstackUsername,
  key:      Env.browserstackAccessKey,
  hostname: 'hub.browserstack.com',
  path:     '/wd/hub',
  port:     443,
  protocol: 'https',

  services: [['browserstack', { browserstackLocal: false }]],

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName':       'Google Pixel 8',
      'appium:platformVersion':  '14.0',
      'appium:automationName':   'UiAutomator2',
      'appium:app':              Env.androidAppHash,
      'appium:newCommandTimeout': 90,
      'bstack:options': {
        projectName: Env.bsProjectName,
        buildName:   `Build ${Env.githubRunNumber}`,
        sessionName: 'Android Tests',
      },
    },
    // Add more devices from the BrowserStack matrix as needed:
    // {
    //   platformName: 'Android',
    //   'appium:deviceName':      'Samsung Galaxy S24',
    //   'appium:platformVersion': '14.0',
    //   'appium:automationName':  'UiAutomator2',
    //   'appium:app':             Env.androidAppHash,
    //   'bstack:options': { projectName: Env.bsProjectName, buildName: `Build ${Env.githubRunNumber}`, sessionName: 'Android Tests — S24' },
    // },
  ],

  specs:   ['./appium/tests/**/*.spec.ts'],
  exclude: [],
};
