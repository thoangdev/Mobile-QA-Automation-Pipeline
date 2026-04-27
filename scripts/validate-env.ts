/**
 * Standalone env validator — run with `npm run validate:env`.
 * Fails fast with a clear list of every missing variable before CI attempts to run.
 */
import { validateAllRequired } from '../config/env';

try {
  validateAllRequired();
  console.log('✔  All required environment variables are set.');
  process.exit(0);
} catch (err) {
  console.error(`✖  Environment validation failed:\n\n${(err as Error).message}`);
  process.exit(1);
}
