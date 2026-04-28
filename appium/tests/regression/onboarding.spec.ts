import OnboardingScreen from '../../screens/OnboardingScreen';
import LoginScreen from '../../screens/LoginScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import { resetApp } from '../../helpers';
import { snapshot, Snapshots } from '../../../percy/snapshots';

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
    await snapshot(Snapshots.ONBOARDING_STEP_1);
  });

  it('should step through all onboarding pages', async () => {
    await OnboardingScreen.tapNext();
    expect(await $('~onboarding-step-2-title').isDisplayed()).toBe(true); // PLACEHOLDER: replace with real step-2 selector
    await snapshot(Snapshots.ONBOARDING_STEP_2);
    await OnboardingScreen.tapNext();
    expect(await $('~onboarding-step-3-title').isDisplayed()).toBe(true); // PLACEHOLDER: replace with real step-3 selector
  });

  it('should grant OS permission prompts during onboarding', async () => {
    await OnboardingScreen.allowPermissionIfPresent();
    // PLACEHOLDER: replace with the real indicator your app shows after permissions are granted
    expect(await $('~permission-granted-badge').isDisplayed()).toBe(true);
  });

  it('should persist profile data after completing onboarding', async () => {
    await OnboardingScreen.completeOnboarding();
    await ProfileScreen.waitForLoad();
    expect(await ProfileScreen.getDisplayedName()).toBe(NEW_USER.name);
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
