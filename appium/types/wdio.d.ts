/// <reference types="webdriverio" />
/// <reference types="@wdio/globals/types" />

/* eslint-disable @typescript-eslint/no-explicit-any */

// Minimal shims for IDE support on a fresh clone before `npm install`.
// After install, the real types come from the reference directives above.
// Empty interfaces merge harmlessly with the real declarations.

declare namespace WebdriverIO {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Element {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Browser {}
}
