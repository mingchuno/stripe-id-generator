# stripe-id-generator

[![Sanity check](https://github.com/mingchuno/stripe-id-generator/actions/workflows/sanity.yml/badge.svg)](https://github.com/mingchuno/stripe-id-generator/actions/workflows/sanity.yml)

Generate random alphanumeric IDs with a prefix (a la Stripe). No runtime dependencies.

## Install

Requires Node.js 22, 24, or 26+. CI tests the latest releases of Node.js 22, 24, and 26.
Use Node.js 24 LTS for development (`nvm use`).

```sh
npm install stripe-id-generator
```

## Use

```js
const IdGenerator = require('stripe-id-generator')

const generator = new IdGenerator()
generator.new('cus') // cus_lO1DEQWBbQAACfHO
```

ES modules and TypeScript can use the default import:

```js
import IdGenerator from 'stripe-id-generator'

const generator = new IdGenerator(['cus', 'con'])
generator.new()      // Uses the first allowed prefix: cus_...
generator.new('con') // con_...
generator.new('cli') // Throws: invalid prefix cli, valid: cus,con
```

- `new IdGenerator(prefixes?)`: accept one prefix, an array of allowed prefixes, or any explicit prefix when omitted.
- `generator.new(prefix?)`: return the prefix, `_`, and 16 random alphanumeric characters. Defaults to the first allowed prefix; throws if none is available or the prefix is not allowed.
- `generator.newUid(length)`: return an unprefixed alphanumeric UID of the given length. Zero returns an empty string.

## Develop

```sh
npm ci
npm run check
npm run format # Apply lint and formatting fixes
```

`check` runs Biome, builds with TypeScript, runs Node's test runner with coverage thresholds, checks types, and tests CommonJS, ESM, and TypeScript consumers against the packed archive. `npm test` rebuilds before testing. `npm run build` emits JavaScript and declarations into `dist/`.

Renovate maintains dependencies and pinned CI actions. Node type definitions stay on the oldest supported major version.

## Release

This refresh drops Node.js 20 and older, Node.js 23/25, ES5/UMD output, and private `dist/*` imports. Public constructor and method signatures are unchanged. Consumers must import the package root. Development now uses npm and `package-lock.json` instead of Yarn.

For the next release, choose a breaking-change version (for example, `0.2.0` while pre-1.0). On a clean, reviewed checkout:

```sh
npm ci
npm run check
npm version minor
npm pack --dry-run
npm publish
```

`prepack` rebuilds the package; `prepublishOnly` runs all checks before publishing. Publishing remains a manual maintainer action. The package version is unchanged until release preparation.

## Author and license

Forked from [Auth0](https://github.com/auth0/id-generator). Licensed under [MIT](LICENSE).
