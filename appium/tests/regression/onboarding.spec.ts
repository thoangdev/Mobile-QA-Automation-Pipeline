import OnboardingScreen from '../../screens/OnboardingScreen';
import LoginScreen from '../../screens/LoginScreen';
import { resetApp } from '../../helpers';

// PLACEHOLDER: replace with a real API helper that creates/tears down test users
const NEW_USER = {
  email:    'new-user@example.com',
  password: 'PlaceholderPassword1!',
  name:     'Test User',
};

describe('Regression: Onboarding', () => {
  before(async () => {
    await resetApp();
    // PLACEHOLDER: create a fresh user via your backend API before the suite runs
    // await ApiHelper.createUser(NEW_USER);
  });

  after(async () => {
    // PLACEHOLDER: delete the test user after the suite finishes
    // await ApiHelper.deleteUser(NEW_USER.email);
  });

  it('should display the welcome screen on first launch for a new user', async () => {
    expect(await OnboardingScreen.isDisplayed()).toBe(true);
  });

  it.skip('should step through all onboarding pages', async () => {
    // PLACEHOLDER: tap Next on each page and assert copy / illustration changes
    // await OnboardingScreen.tapNext();
    // expect(await $('~onboarding-step-2-title').isDisplayed()).toBe(true);
    // await OnboardingScreen.tapNext();
    // ...
  });

  it.skip('should grant OS permission prompts during onboarding', async () => {
    // PLACEHOLDER: handle system dialogs for notifications / location / camera
    // await OnboardingScreen.allowPermissionIfPresent();
    // expect(await $('~permission-granted-badge').isDisplayed()).toBe(true);
  });

  it.skip('should persist profile data after completing onboarding', async () => {
    // PLACEHOLDER: complete onboarding and assert data is shown on the profile screen
    // await OnboardingScreen.completeOnboarding();
    // const ProfileScreen = require('../../screens/ProfileScreen').default;
    // await ProfileScreen.waitForLoad();
    // expect(await ProfileScreen.getDisplayedName()).toBe(NEW_USER.name);
  });

  it('should skip onboarding on subsequent launches', async () => {
    await driver.closeApp();
    await driver.launchApp();
    // After first-run onboarding is complete, the app should land on Login (not onboarding)
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });
});

// Suppress "unused variable" warning until API helper is wired up
void NEW_USER;
