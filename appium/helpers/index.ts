import { Env } from '../../config/env';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

/**
 * Canonical test credentials pulled from the environment.
 * Use `Credentials.valid` in happy-path tests and `Credentials.invalid`
 * in negative tests — never hardcode values in spec files.
 */
export const Credentials = {
  valid: { username: Env.testUsername, password: Env.testPassword },
  invalid: { username: 'invalid@example.com', password: 'WrongPassword!' },
} as const;

/**
 * Resets the app to a clean launch state.
 * Prefers `driver.reloadSession()` (Appium 2.x) and falls back to
 * the deprecated `driver.reset()` for older setups.
 */
export async function resetApp(): Promise<void> {
  try {
    await driver.reloadSession();
  } catch {
    await (driver as WebdriverIO.Browser & { reset(): Promise<void> }).reset();
  }
}

/**
 * Logs in with the given credentials and waits for the Home screen to load.
 * Defaults to `Credentials.valid` so callers only pass args for non-standard accounts.
 */
export async function loginAs(
  username = Credentials.valid.username,
  password = Credentials.valid.password,
): Promise<void> {
  await LoginScreen.login(username, password);
  await HomeScreen.waitForLoad();
}

/**
 * Attempts to return the app to the Home screen via back navigation.
 * Falls back to a full reset + login if navigation fails (e.g. session is broken).
 */
export async function returnToHome(): Promise<void> {
  try {
    await driver.back();
    await HomeScreen.waitForLoad(5_000);
  } catch {
    await resetApp();
    await loginAs();
  }
}
