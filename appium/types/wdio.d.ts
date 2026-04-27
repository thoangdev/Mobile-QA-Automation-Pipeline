/**
 * Pre-install type shims for WebdriverIO's global APIs.
 *
 * TypeScript needs to know about `$`, `$$`, `driver`, and `browser` before
 * `npm install` has been run. These minimal declarations satisfy the compiler
 * and allow the IDE to work on a fresh clone.
 *
 * AFTER `npm install`:
 *   1. Uncomment the reference line below to activate full WebdriverIO types.
 *   2. `@types/node` and `@types/mocha` are auto-discovered from node_modules.
 *   3. The `declare function / namespace` shims below merge with the real types
 *      via TypeScript declaration merging — do not remove them.
 *
 * Uncomment after install:
 * /// <reference types="@wdio/globals/types" />
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// WebdriverIO selector globals
declare function $(selector: string | object): any;
declare function $$(selector: string | object): any;

// WebdriverIO session globals
declare const driver:  any;
declare const browser: any;

// Minimal WebdriverIO namespace — empty interfaces merge with the real
// declarations provided by `webdriverio` once the package is installed.
declare namespace WebdriverIO {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Element {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Browser {}
}
