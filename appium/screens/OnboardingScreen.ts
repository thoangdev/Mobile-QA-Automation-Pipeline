import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class OnboardingScreen extends BasePage {
  private get welcomeTitle()     { return $('~onboarding-welcome-title'); }
  private get nextButton()       { return $('~onboarding-next-button'); }
  private get skipButton()       { return $('~onboarding-skip-button'); }
  private get getStartedButton() { return $('~onboarding-get-started-button'); }
  private get allowButton()      { return $('~permission-allow-button'); }

  protected get anchor()         { return this.welcomeTitle; }

  async tapNext(): Promise<void> {
    await this.nextButton.waitForDisplayed();
    await this.nextButton.click();
  }

  async skip(): Promise<void> {
    await this.skipButton.waitForDisplayed();
    await this.skipButton.click();
  }

  /**
   * Steps through every onboarding page and taps "Get Started" on the final screen.
   * PLACEHOLDER: update the loop count to match the number of pages in your app.
   */
  async completeOnboarding(pageCount = 3): Promise<void> {
    for (let i = 0; i < pageCount - 1; i++) {
      await this.tapNext();
    }
    await this.getStartedButton.waitForDisplayed();
    await this.getStartedButton.click();
  }

  /**
   * Dismisses an OS-level permission dialog (notifications, location, etc.).
   * Safe to call even when no dialog is present.
   */
  async allowPermissionIfPresent(): Promise<void> {
    try {
      await this.allowButton.waitForDisplayed({ timeout: 3_000 });
      await this.allowButton.click();
    } catch {
      // No dialog — continue silently
    }
  }
}

export default new OnboardingScreen();
