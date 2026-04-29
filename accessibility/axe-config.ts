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
    id: string;
    impact: string;
    description: string;
    nodes: unknown[];
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
      // @ts-expect-error axe is a browser global injected by the accessibility service
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
// PLACEHOLDER: Each entry below navigates to a WebView context and audits it.
// Replace the screen names and add driver navigation before each runAxeCheck call.
if (require.main === module) {
  const screens: string[] = [
    'Login Screen',
    'Home Screen',
    'Settings Screen',
    'Search Results',
    'Checkout — Cart Review',
    // PLACEHOLDER: add more screens as WebView contexts become available
  ];

  (async () => {
    let passed = 0;
    let failed = 0;

    for (const screen of screens) {
      try {
        // PLACEHOLDER: navigate driver to the correct WebView context for each screen
        // e.g. await driver.switchContext('WEBVIEW_com.your.app');
        await runAxeCheck(screen);
        console.log(`  ✓  ${screen}`);
        passed++;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`  ✗  ${screen}\n${message}`);
        failed++;
      }
    }

    console.log(`\nAccessibility audit complete: ${passed} passed, ${failed} failed.`);

    if (failed > 0) {
      process.exit(1);
    }
  })().catch((err) => {
    console.error('\nFatal error in accessibility runner:\n', err);
    process.exit(1);
  });
}
