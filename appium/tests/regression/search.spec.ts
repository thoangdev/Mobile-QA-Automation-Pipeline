import HomeScreen from '../../screens/HomeScreen';
import SearchResultsScreen from '../../screens/SearchResultsScreen';
import FilterScreen from '../../screens/FilterScreen';
import { resetApp, loginAs, returnToHome } from '../../helpers';
import { snapshot, Snapshots } from '../../../percy/snapshots';

describe('Regression: Search & Filters', () => {
  before(async () => {
    await resetApp();
    await loginAs();
  });

  // Return to Home between tests so each one starts from a known screen.
  afterEach(async () => {
    await returnToHome();
  });

  it('should return results for a valid search query', async () => {
    await HomeScreen.search('shoe'); // PLACEHOLDER: replace with a term that returns results
    const count = await SearchResultsScreen.getResultCount();
    await snapshot(Snapshots.SEARCH_RESULTS);
    expect(count).toBeGreaterThan(0);
  });

  it('should show an empty state for a query with no results', async () => {
    await HomeScreen.search('xyzzy_no_results_12345');
    expect(await SearchResultsScreen.isEmptyStateDisplayed()).toBe(true);
  });

  it('should apply a filter and narrow the result set', async () => {
    await HomeScreen.search('shoe');
    const before = await SearchResultsScreen.getResultCount();
    await SearchResultsScreen.openFilters();
    await FilterScreen.selectCategory('Sneakers'); // PLACEHOLDER: replace with a real category
    await FilterScreen.applyFilters();
    const after = await SearchResultsScreen.getResultCount();
    expect(after).toBeLessThan(before);
  });

  it('should clear the search and restore the home view', async () => {
    await HomeScreen.search('shoe');
    await SearchResultsScreen.clearSearch();
    expect(await HomeScreen.isDisplayed()).toBe(true);
  });
});
