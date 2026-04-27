import * as dotenv from 'dotenv';

dotenv.config();

// WCAG 2.1 Level AA rules enforced in primary flows (blocks pipeline on violation).
// Secondary flows should downgrade impact to 'serious' | 'moderate' and warn only.
const A11Y_RULES = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa'],
  },
  resultTypes: ['violations'] as const,
};

interface AxeResult {
  violations: Array<{
    id:          string;
    impact:      string;
    description: string;
    nodes:       unknown[];
  }>;
}

/**
 * Inject and run axe-core in the current WebView context.
 * Must be called while the driver is focused on a WebView (not native context).
 *
 * PLACEHOLDER: For fully native apps, use a mobile-a11y driver instead.
 * See: https://github.com/nickmccurdy/mobile-a11y
 */
export async function runAxeCheck(screenName: string): Promise<void> {
  const results: AxeResult = await browser.executeAsync(
    (rules: typeof A11Y_RULES, done: (r: AxeResult) => void) => {
      // axe is expected to be injected via the accessibility driver/service
      // @ts-ignore
      axe.run(document, rules, done);
    },
    A11Y_RULES,
  );

  if (results.violations.length > 0) {
    const lines = results.violations.map(
      (v) => `  [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`,
    );
    throw new Error(`Axe a11y violations on "${screenName}":\n${lines.join('\n')}`);
  }
}

// Standalone runner — invoked by `npm run test:a11y`
// PLACEHOLDER: replace with actual screens/contexts to audit
if (require.main === module) {
  console.log('Axe accessibility runner — wire up screen contexts below.');
  // Example:
  // await runAxeCheck('Login Screen');
  // await runAxeCheck('Home Screen');
  process.exit(0);
}
