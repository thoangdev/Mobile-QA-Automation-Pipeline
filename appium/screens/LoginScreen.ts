import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class LoginScreen extends BasePage {
  private get usernameInput()    { return $('~username-input'); }
  private get passwordInput()    { return $('~password-input'); }
  private get loginButton()      { return $('~login-button'); }
  // Public — tests assert on text content directly
  get errorMessage()             { return $('~login-error-message'); }
  get forgotPasswordLink()       { return $('~forgot-password-link'); }

  // The login button is the anchor: if it's displayed, the screen is ready
  protected get anchor()         { return this.loginButton; }

  async login(username: string, password: string): Promise<void> {
    await this.waitForLoad();
    await this.usernameInput.clearValue();
    await this.usernameInput.setValue(username);
    await this.passwordInput.clearValue();
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitForDisplayed({ timeout: 5_000 });
    return this.errorMessage.getText();
  }
}

export default new LoginScreen();
