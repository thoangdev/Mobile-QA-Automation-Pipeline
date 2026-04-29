import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { resetApp, loginAs } from '../../helpers';
import { snapshot, Snapshots } from '../../../percy/snapshots';

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
    await snapshot(Snapshots.SETTINGS);
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

  it('should toggle dark mode and reflect the theme change', async () => {
    await SettingsScreen.toggleDarkMode();
    expect(await $('~dark-theme-indicator').isDisplayed()).toBe(true); // PLACEHOLDER: replace with real dark-mode indicator selector
    await SettingsScreen.toggleDarkMode(); // restore original state
  });

  it('should log out and return to the login screen', async () => {
    await SettingsScreen.logout();
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });

  it('should handle offline gracefully', async () => {
    // setNetworkConnection: 0 = no connection (Android only)
    // PLACEHOLDER: for iOS use network conditioner or a proxy instead
    await driver.setNetworkConnection({ type: 0 });
    try {
      expect(await $('~offline-banner').isDisplayed()).toBe(true); // PLACEHOLDER: replace with real offline indicator selector
    } finally {
      await driver.setNetworkConnection({ type: 6 }); // restore: wifi + data
    }
  });
});
