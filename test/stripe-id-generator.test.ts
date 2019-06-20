import IdGenerator from '../src/stripe-id-generator'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('IdGenerator is instantiable', () => {
    expect(new IdGenerator()).toBeInstanceOf(IdGenerator)
  })
})

describe('with no accepted prefix list', () => {
  let idGenerator: IdGenerator

  beforeAll(() => {
    idGenerator = new IdGenerator()
  })

  it('should generate id with provided prefix', () => {
    const id = idGenerator.new('cus')
    expect(id).toHaveLength(20)
    expect(id).toMatch(/^cus_[a-zA-Z0-9]{16}$/)
  })

  it('should throw if no prefix is provided', () => {
    expect(() => {
      idGenerator.new()
    }).toThrow(/missing prefix for id/)
  })
})

describe('with accepted prefix list', () => {
  let idGenerator: IdGenerator

  beforeAll(() => {
    idGenerator = new IdGenerator(['cus', 'con'])
  })

  it('should generate id if prefix is in list', () => {
    const id = idGenerator.new('cus')
    expect(id).toHaveLength(20)
    expect(id).toMatch(/^cus_[a-zA-Z0-9]{16}$/)
  })

  it('should throw prefix is not in list', () => {
    expect(() => {
      idGenerator.new('cli')
    }).toThrow(/invalid prefix cli, valid: cus,con/)
  })
})

describe('with one accepted prefix', () => {
  let idGenerator: IdGenerator

  beforeAll(() => {
    idGenerator = new IdGenerator('cus')
  })

  it('should generate the id with the default prefix', () => {
    let id = idGenerator.new()
    expect(id).toHaveLength(20)
    expect(id).toMatch(/^cus_[a-zA-Z0-9]{16}$/)
  })
})

describe('uid', () => {
  let idGenerator: IdGenerator

  beforeAll(() => {
    idGenerator = new IdGenerator('cus')
  })

  it('should generate an uid with specified len', () => {
    const id = idGenerator.newUid(30)
    expect(id).toHaveLength(30)
    expect(id).toMatch(/^[a-zA-Z0-9]{30}$/)
  })
})
