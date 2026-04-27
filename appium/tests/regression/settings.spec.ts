import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { resetApp, loginAs } from '../../helpers';

// Each test gets a clean session: reset → login → navigate to Settings.
// This makes every test fully independent and eliminates shared-state failures.
async function navigateToSettings(): Promise<void> {
  await resetApp();
  await loginAs();
  await HomeScreen.openSettings();
  await SettingsScreen.waitForLoad();
}

describe('Regression: Settings', () => {
  beforeEach(async () => {
    await navigateToSettings();
  });

  it('should display the settings screen', async () => {
    expect(await SettingsScreen.isDisplayed()).toBe(true);
  });

  it('should toggle notifications off then back on', async () => {
    const initial = await SettingsScreen.isNotificationsEnabled();

    await SettingsScreen.toggleNotifications();
    expect(await SettingsScreen.isNotificationsEnabled()).toBe(!initial);

    await SettingsScreen.toggleNotifications();
    expect(await SettingsScreen.isNotificationsEnabled()).toBe(initial);
  });

  it('should persist the notifications setting across app restarts', async () => {
    const initial = await SettingsScreen.isNotificationsEnabled();
    await SettingsScreen.toggleNotifications();
    const toggled = !initial;

    await driver.closeApp();
    await driver.launchApp();
    await loginAs();
    await HomeScreen.openSettings();
    await SettingsScreen.waitForLoad();

    expect(await SettingsScreen.isNotificationsEnabled()).toBe(toggled);
  });

  it.skip('should toggle dark mode and reflect the theme change', async () => {
    // PLACEHOLDER: toggle dark mode and assert a theme-specific element is visible
    // await SettingsScreen.toggleDarkMode();
    // expect(await $('~dark-theme-indicator').isDisplayed()).toBe(true);
  });

  it('should log out and return to the login screen', async () => {
    await SettingsScreen.logout();
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });

  it.skip('should handle offline gracefully', async () => {
    // PLACEHOLDER: disable network, assert graceful error / offline banner appears
    // await driver.setNetworkConnection(0); // 0 = no connection (Android)
    // expect(await $('~offline-banner').isDisplayed()).toBe(true);
    // await driver.setNetworkConnection(6); // restore: wifi + data
  });
});
