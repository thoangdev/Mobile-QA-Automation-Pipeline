import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class SettingsScreen extends BasePage {
  private get header()               { return $('~settings-header'); }
  private get notificationsToggle()  { return $('~notifications-toggle'); }
  private get darkModeToggle()       { return $('~dark-mode-toggle'); }
  private get languageSelector()     { return $('~language-selector'); }
  private get logoutButton()         { return $('~logout-button'); }

  protected get anchor()             { return this.header; }

  /**
   * Reads the toggle's `value` attribute.
   * PLACEHOLDER: adjust the truthy values to match your platform/framework
   * (e.g. Android Switch: '1' / '0'; iOS Switch: 'true' / 'false').
   */
  async isNotificationsEnabled(): Promise<boolean> {
    await this.notificationsToggle.waitForDisplayed();
    const value = await this.notificationsToggle.getAttribute('value');
    return value === '1' || value === 'true';
  }

  async toggleNotifications(): Promise<void> {
    await this.waitForLoad();
    await this.notificationsToggle.click();
  }

  async toggleDarkMode(): Promise<void> {
    await this.waitForLoad();
    await this.darkModeToggle.click();
  }

  async selectLanguage(): Promise<void> {
    await this.waitForLoad();
    await this.languageSelector.click();
    // PLACEHOLDER: handle the language picker that appears after tap
  }

  async logout(): Promise<void> {
    await this.waitForLoad();
    await this.logoutButton.click();
  }
}

export default new SettingsScreen();
