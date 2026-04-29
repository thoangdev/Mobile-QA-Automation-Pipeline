import type { ChainablePromiseElement } from 'webdriverio';

const DEFAULT_LOAD_TIMEOUT = 15_000;

export abstract class BasePage {
  protected abstract get anchor(): ChainablePromiseElement;

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
