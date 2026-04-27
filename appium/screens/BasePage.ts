const DEFAULT_LOAD_TIMEOUT = 15_000;

/**
 * Abstract base for all screen objects.
 *
 * Every screen must declare an `anchor` — the element whose visibility
 * confirms the screen is fully loaded and ready for interaction.
 *
 * - `waitForLoad()` — use at the start of any action method; throws on timeout
 * - `isDisplayed()` — use in test assertions; returns false instead of throwing
 */
export abstract class BasePage {
  protected abstract get anchor(): WebdriverIO.Element;

  async waitForLoad(timeout = DEFAULT_LOAD_TIMEOUT): Promise<void> {
    await this.anchor.waitForDisplayed({ timeout });
  }

  async isDisplayed(): Promise<boolean> {
    try {
      return await this.anchor.isDisplayed();
    } catch {
      return false;
    }
  }
}
