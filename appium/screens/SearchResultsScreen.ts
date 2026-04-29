import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class SearchResultsScreen extends BasePage {
  private get resultsList() {
    return $('~search-results-list');
  }
  private get emptyState() {
    return $('~search-empty-state');
  }
  private get filterButton() {
    return $('~search-filter-button');
  }
  private get clearButton() {
    return $('~search-clear-button');
  }
  private get resultItems() {
    return $$('~search-result-item');
  }

  protected get anchor() {
    return this.resultsList;
  }

  async getResultCount(): Promise<number> {
    await this.resultsList.waitForDisplayed();
    return this.resultItems.length;
  }

  async isEmptyStateDisplayed(): Promise<boolean> {
    try {
      await this.emptyState.waitForDisplayed({ timeout: 5_000 });
      return this.emptyState.isDisplayed();
    } catch {
      return false;
    }
  }

  async openFilters(): Promise<void> {
    await this.filterButton.waitForDisplayed();
    await this.filterButton.click();
  }

  async clearSearch(): Promise<void> {
    await this.clearButton.waitForDisplayed();
    await this.clearButton.click();
  }
}

export default new SearchResultsScreen();
