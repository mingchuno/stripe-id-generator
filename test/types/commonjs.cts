import IdGenerator = require('stripe-id-generator')

const generator = new IdGenerator(['cus', 'con'])
const id: string = generator.new('cus')
const uid: string = generator.newUid(10)
void [id, uid]

// @ts-expect-error Prefixes must be strings.
new IdGenerator(123)
// @ts-expect-error UID length must be a number.
generator.newUid('10')
