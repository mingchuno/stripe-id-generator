# stripe-id-generator

[![Sanity check](https://github.com/mingchuno/stripe-id-generator/actions/workflows/sanity.yml/badge.svg)](https://github.com/mingchuno/stripe-id-generator/actions/workflows/sanity.yml)

Generate random alphanumeric IDs with a prefix (a la Stripe). No runtime dependencies.

## Install

Requires Node.js 22, 24, or 26+.

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

Prefixes must be nonempty strings containing only ASCII letters and digits
(`A-Z`, `a-z`, `0-9`); invalid values throw `TypeError`. Omit the prefix or pass
`undefined` to use the default; an empty string is rejected. The generator copies
the allowed-prefix array, so later changes to that array do not affect it.

UID characters are sampled uniformly using cryptographic random bytes.

## Author and license

Forked from [Auth0](https://github.com/auth0/id-generator). Licensed under [MIT](LICENSE).
