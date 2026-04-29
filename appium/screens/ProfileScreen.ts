import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class ProfileScreen extends BasePage {
  private get displayName() {
    return $('~profile-display-name');
  }
  private get avatar() {
    return $('~profile-avatar');
  }
  private get editButton() {
    return $('~profile-edit-button');
  }

  protected get anchor() {
    return this.displayName;
  }

  async getDisplayedName(): Promise<string> {
    await this.displayName.waitForDisplayed();
    return this.displayName.getText();
  }

  async tapEdit(): Promise<void> {
    await this.editButton.waitForDisplayed();
    await this.editButton.click();
  }

  async isAvatarDisplayed(): Promise<boolean> {
    try {
      return await this.avatar.isDisplayed();
    } catch {
      return false;
    }
  }
}

export default new ProfileScreen();
