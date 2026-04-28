import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class FilterScreen extends BasePage {
  private get filterPanel()    { return $('~filter-panel'); }
  private get categoryItems()  { return $$('~filter-category-item'); }
  private get applyButton()    { return $('~filter-apply-button'); }
  private get clearAllButton() { return $('~filter-clear-button'); }

  protected get anchor()       { return this.filterPanel; }

  async selectCategory(name: string): Promise<void> {
    await this.waitForLoad();
    const items = await this.categoryItems;
    for (const item of items) {
      if ((await item.getText()) === name) {
        await item.click();
        return;
      }
    }
    throw new Error(`Filter category "${name}" not found`);
  }

  async applyFilters(): Promise<void> {
    await this.applyButton.waitForDisplayed();
    await this.applyButton.click();
  }

  async clearFilters(): Promise<void> {
    await this.clearAllButton.waitForDisplayed();
    await this.clearAllButton.click();
  }
}

export default new FilterScreen();
