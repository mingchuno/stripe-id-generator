# stripe-id-generator

[![Travis](https://img.shields.io/travis/mingchuno/stripe-id-generator.svg)](https://travis-ci.org/mingchuno/stripe-id-generator)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Generates random ids with a prefix (a la Stripe)

## Installing

```bash
npm i stripe-id-generator # or
yarn add stripe-id-generator
```

## Using

Simple case:
```javascript
const IdGenerator = require('stripe-id-generator');

const generator = new IdGenerator();
const id = generator.new('cus');

console.log(id); // cus_lO1DEQWBbQAACfHO
```

Predefined set of allowed prefixes (to avoid mistakes):
```javascript
const IdGenerator = require('stripe-id-generator');

const generator = new IdGenerator(['cus', 'con']);
const id = generator.new('cus');

console.log(id); // cus_lO1DEQWBbQAACfHO

generator.new('cli'); // throws
```

To get a uid (id with a given length and without prefix):
```javascript
const IdGenerator = require('stripe-id-generator');

const generator = new IdGenerator(['cus', 'con']);
const id = generator.newUid(10);

console.log(id); // lO1DEQWBbQ
```

## Author

Fork from [Auth0](https://github.com/auth0/id-generator)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.