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

  it('keeps its allowlist when the caller changes the original array', () => {
    const prefixes = ['cus', 'con']
    const generator = new IdGenerator(prefixes)
    prefixes[0] = 'admin'
    prefixes.length = 0
    assert.match(generator.new(), /^cus_[a-zA-Z0-9]{16}$/)
    assert.match(generator.new('con'), /^con_[a-zA-Z0-9]{16}$/)
    assert.throws(() => generator.new('admin'), /invalid prefix/)
  })

  it('rejects malformed configured and explicit prefixes', () => {
    const invalid = [
      '',
      'cus\n',
      'cus con',
      '../cus',
      'cus_con',
      'cüs',
      null,
      false,
      123,
      {},
      undefined,
    ]
    for (const prefix of invalid) {
      assert.throws(() => new IdGenerator([prefix]), TypeError)
      if (prefix !== undefined) {
        assert.throws(() => new IdGenerator(prefix), TypeError)
        assert.throws(() => new IdGenerator().new(prefix), TypeError)
        assert.throws(() => new IdGenerator('cus').new(prefix), TypeError)
      }
    }
    assert.throws(() => new IdGenerator(new Array(1)), TypeError)
  })

  it('accepts ASCII letters and digits in prefixes', () => {
    assert.match(new IdGenerator('Cus123').new(), /^Cus123_[a-zA-Z0-9]{16}$/)
  })
})

describe('UIDs', () => {
  it('maps accepted bytes uniformly and replaces rejected bytes', (t) => {
    const batches = [
      Buffer.from(Array.from({ length: 256 }, (_, i) => i)),
      Buffer.from([7, 6, 5, 4, 3, 2, 1, 0]),
    ]
    t.mock.method(require('node:crypto'), 'randomBytes', (length) => {
      const bytes = batches.shift()
      assert.ok(bytes, 'unexpected random byte request')
      assert.equal(bytes.length, length)
      return bytes
    })
    const alphabet =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    assert.equal(new IdGenerator().newUid(256), `${alphabet.repeat(4)}76543210`)
    assert.equal(batches.length, 0)
  })

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
