import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class HomeScreen extends BasePage {
  private get header()         { return $('~home-header'); }
  private get searchBar()      { return $('~search-bar'); }
  private get settingsIcon()   { return $('~settings-icon'); }
  private get cartIcon()       { return $('~cart-icon'); }
  private get searchSubmit()   { return $('~search-submit-button'); }
  // Public — tests may assert on count
  get featuredItems()          { return $$('~featured-item'); }
  get profileIcon()            { return $('~profile-icon'); }

  protected get anchor()       { return this.header; }

  async openSettings(): Promise<void> {
    await this.waitForLoad();
    await this.settingsIcon.click();
  }

  async openCart(): Promise<void> {
    await this.waitForLoad();
    await this.cartIcon.click();
  }

  async enterSearchQuery(query: string): Promise<void> {
    await this.searchBar.waitForDisplayed();
    await this.searchBar.click();
    await this.searchBar.setValue(query);
  }

  async submitSearch(): Promise<void> {
    // PLACEHOLDER: replace with platform-specific submit if needed
    // Android: await driver.pressKeyCode(66);
    // iOS: await $('~search-keyboard-search-button').click();
    await this.searchSubmit.waitForDisplayed();
    await this.searchSubmit.click();
  }

  async search(query: string): Promise<void> {
    await this.enterSearchQuery(query);
    await this.submitSearch();
  }

  async getCartBadgeCount(): Promise<number> {
    try {
      const badge = $('~cart-badge-count');
      await badge.waitForDisplayed({ timeout: 3_000 });
      const parsed = parseInt(await badge.getText(), 10);
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  }
}

export default new HomeScreen();
