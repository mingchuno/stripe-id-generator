import IdGenerator from 'stripe-id-generator'

const generator: IdGenerator = new IdGenerator('cus')
const id: string = generator.new()
const uid: string = generator.newUid(10)
void [id, uid]

// @ts-expect-error Prefix must be a string.
generator.new(123)
