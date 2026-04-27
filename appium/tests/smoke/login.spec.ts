import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { resetApp, loginAs, Credentials } from '../../helpers';

describe('@smoke Login', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('should display the login screen on app launch', async () => {
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });

  it('should log in with valid credentials and land on Home', async () => {
    await loginAs();
    expect(await HomeScreen.isDisplayed()).toBe(true);
  });

  it('should show an error message for invalid credentials', async () => {
    await LoginScreen.login(Credentials.invalid.username, Credentials.invalid.password);
    const error = await LoginScreen.getErrorText();
    // PLACEHOLDER: replace 'Invalid' with the exact error copy your app displays
    expect(error).toContain('Invalid');
  });

  it('should log out and return to the login screen', async () => {
    await loginAs();
    await HomeScreen.openSettings();
    await SettingsScreen.waitForLoad();
    await SettingsScreen.logout();
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });
});
