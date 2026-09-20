# Maintaining stripe-id-generator

## Development

Use Node.js 24 LTS (`nvm use`).

```sh
npm ci
npm run check
npm run format # Apply lint and formatting fixes
```

`check` runs lint, build, coverage, type checks, and packed-package consumer tests.
`npm test` rebuilds before testing; `npm run build` emits JavaScript and declarations
into `dist/`. CI runs the checks on Node.js 22, 24, and 26.

Renovate maintains dependencies and pinned CI actions. Keep Node type definitions
on the oldest supported major version.

## Publishing

Publishing is a manual maintainer action. Prepare and commit the intended version
in both `package.json` and `package-lock.json` before publishing. Do not bump it
again if the checkout already contains the release version.

From a clean checkout of the release commit with passing CI:

```sh
npm ci
npm run check
npm pack --dry-run
npm publish
```

Inspect the dry-run version and file list before publishing. The archive should
contain only `dist/`, `package.json`, `README.md`, and `LICENSE`.

`prepack` rebuilds the package. `prepublishOnly` runs all checks before publishing.
After a successful publish, tag the release commit with its version and push the
tag to keep the repository aligned with npm.
