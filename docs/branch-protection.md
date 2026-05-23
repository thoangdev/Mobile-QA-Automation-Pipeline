# Branch Protection Rules

Configure these under **Settings → Branches → Branch protection rules → `main`**:

| Rule | Setting | Why |
|------|---------|-----|
| Require a pull request before merging | On | No direct pushes |
| Required approvals | 1 | Human review before merge |
| Dismiss stale reviews | On | New commits invalidate prior approvals |
| Require review from code owners | On | `.github/CODEOWNERS` auto-assigns |
| Require status checks to pass | On | `lint` + `smoke-android` must be green |
| Require branches to be up to date | On | No merging stale branches |
| Restrict push to `main` | Admins only | Non-admins cannot push directly |
| Allow force pushes | Off | History is immutable |

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New test | `feat/<ticket>-<slug>` | `feat/QA-123-checkout-tests` |
| Bug fix | `fix/<ticket>-<slug>` | `fix/QA-456-login-selector` |
| Screen object | `screen/<name>` | `screen/payment-screen` |
| CI/config | `chore/<slug>` | `chore/update-wdio` |

## Contributor Workflow

```
1. Branch    git checkout -b feat/QA-123-add-tests
2. Develop   write tests + screen objects locally
3. Gate      npm run typecheck && npm run lint && npm run test:smoke (local or BS)
4. Commit    git commit  (pre-commit hook auto-runs lint-staged)
5. Push      git push origin feat/QA-123-add-tests
6. PR        open PR → fill in template → CI runs automatically
7. Review    address comments → get 1 approval from CODEOWNERS
8. Merge     squash and merge
```
