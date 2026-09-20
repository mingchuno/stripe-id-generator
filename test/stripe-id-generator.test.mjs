import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'
import IdGenerator from 'stripe-id-generator'

const require = createRequire(import.meta.url)

describe('package entry points', () => {
  it('exports the same constructor through CommonJS and ESM', () => {
    assert.equal(require('stripe-id-generator'), IdGenerator)
    assert.ok(new IdGenerator() instanceof IdGenerator)
  })
})

describe('prefixes', () => {
  it('accepts an explicit prefix without an allowlist', () => {
    assert.match(new IdGenerator().new('cus'), /^cus_[a-zA-Z0-9]{16}$/)
  })

  it('requires a prefix without an allowlist', () => {
    for (const prefixes of [undefined, []]) {
      assert.throws(() => new IdGenerator(prefixes).new(), {
        message: 'missing prefix for id',
      })
    }
  })

  it('accepts every prefix in the allowlist', () => {
    const generator = new IdGenerator(['cus', 'con'])
    assert.match(generator.new('cus'), /^cus_[a-zA-Z0-9]{16}$/)
    assert.match(generator.new('con'), /^con_[a-zA-Z0-9]{16}$/)
  })

  it('rejects prefixes outside the allowlist', () => {
    assert.throws(() => new IdGenerator(['cus', 'con']).new('cli'), {
      message: 'invalid prefix cli, valid: cus,con',
    })
  })

  it('defaults to the first allowed prefix', () => {
    assert.match(new IdGenerator(['cus', 'con']).new(), /^cus_[a-zA-Z0-9]{16}$/)
  })

  it('accepts a single allowed prefix', () => {
    assert.match(new IdGenerator('cus').new(), /^cus_[a-zA-Z0-9]{16}$/)
  })

  it('treats an empty argument as a request for the default prefix', () => {
    assert.match(new IdGenerator('cus').new(''), /^cus_[a-zA-Z0-9]{16}$/)
  })
})

describe('UIDs', () => {
  it('uses the requested length and alphanumeric alphabet', () => {
    const generator = new IdGenerator()
    for (const length of [1, 16, 30, 256]) {
      const uid = generator.newUid(length)
      assert.equal(uid.length, length)
      assert.match(uid, /^[a-zA-Z0-9]+$/)
    }
  })

  it('returns an empty UID for length zero', () => {
    assert.equal(new IdGenerator().newUid(0), '')
  })

  it('rejects negative lengths', () => {
    assert.throws(() => new IdGenerator().newUid(-1), RangeError)
  })
})
