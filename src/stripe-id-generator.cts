import { randomBytes } from 'node:crypto'

const ALPHA_NUM =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

class IdGenerator {
  private readonly prefixes: string[]
  constructor(prefixes?: string | string[]) {
    if (Array.isArray(prefixes)) {
      this.prefixes = prefixes
      return
    }
    if (typeof prefixes === 'string') {
      this.prefixes = [prefixes]
      return
    }
    this.prefixes = []
  }

  public newUid(len: number) {
    const rnd = randomBytes(len)
    const value = new Array(len)
    const charsLength = ALPHA_NUM.length

    for (let i = 0; i < len; i++) {
      value[i] = ALPHA_NUM[rnd[i] % charsLength]
    }

    return value.join('')
  }

  public new(prefix?: string) {
    if (!prefix) {
      if (this.prefixes.length === 0) {
        throw new Error('missing prefix for id')
      }
      prefix = this.prefixes[0]
    }

    if (this.prefixes.length && !this.prefixes.includes(prefix)) {
      throw new Error(`invalid prefix ${prefix}, valid: ${this.prefixes}`)
    }

    return `${prefix}_${this.newUid(16)}`
  }
}

export = IdGenerator
