import percyScreenshot from '@percy/appium-app';

/**
 * Capture a Percy visual snapshot at a named checkpoint.
 * Call this at key screen transitions inside your Appium test specs.
 *
 * Usage:
 *   import { snapshot } from '../../percy/snapshots';
 *   await snapshot('Home Screen — logged in');
 */
export async function snapshot(name: string): Promise<void> {
  await percyScreenshot(driver, name);
}

// Predefined snapshot names used across the regression suite.
// Keep these in sync with Percy dashboard baseline names.
export const Snapshots = {
  LOGIN:             'Login Screen',
  HOME:              'Home Screen',
  SETTINGS:          'Settings Screen',
  CHECKOUT_CART:     'Checkout — Cart Review',
  CHECKOUT_CONFIRM:  'Checkout — Order Confirmation',
  SEARCH_RESULTS:    'Search Results',
  ONBOARDING_STEP_1: 'Onboarding — Step 1',
  ONBOARDING_STEP_2: 'Onboarding — Step 2',
  // PLACEHOLDER: add more snapshot names as your screen inventory grows
} as const;
