import { randomBytes } from 'node:crypto'

const ALPHA_NUM =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BYTE_LIMIT = 256 - (256 % ALPHA_NUM.length)

function validatePrefix(prefix: unknown): asserts prefix is string {
  if (
    typeof prefix !== 'string' ||
    prefix.length === 0 ||
    /[^a-zA-Z0-9]/.test(prefix)
  ) {
    throw new TypeError('prefix must be a nonempty ASCII alphanumeric string')
  }
}

class IdGenerator {
  private readonly prefixes: string[]
  constructor(prefixes?: string | string[]) {
    if (prefixes === undefined) {
      this.prefixes = []
      return
    }
    this.prefixes = Array.isArray(prefixes) ? [...prefixes] : [prefixes]
    for (const prefix of this.prefixes) {
      validatePrefix(prefix)
    }
  }

  public newUid(len: number) {
    let rnd = randomBytes(len)
    const value = new Array(len)
    let written = 0

    while (written < len) {
      for (const byte of rnd) {
        // Reject the incomplete group so every character is equally likely.
        if (byte < BYTE_LIMIT) {
          value[written++] = ALPHA_NUM[byte % ALPHA_NUM.length]
        }
      }
      if (written < len) {
        rnd = randomBytes(len - written)
      }
    }

    return value.join('')
  }

  public new(prefix?: string) {
    if (prefix === undefined) {
      if (this.prefixes.length === 0) {
        throw new Error('missing prefix for id')
      }
      prefix = this.prefixes[0]
    }
    validatePrefix(prefix)

    if (this.prefixes.length && !this.prefixes.includes(prefix)) {
      throw new Error(`invalid prefix ${prefix}, valid: ${this.prefixes}`)
    }

    return `${prefix}_${this.newUid(16)}`
  }
}

export = IdGenerator
