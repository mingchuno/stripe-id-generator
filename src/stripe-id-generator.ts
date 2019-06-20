// import crypto from 'crypto' NOT working in test case!
import * as crypto from 'crypto'

const ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default class IdGenerator {
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
    const rnd = crypto.randomBytes(len)
    const value = new Array(len)
    const charsLength = ALPHA_NUM.length

    for (let i = 0; i < len; i++) {
      value[i] = ALPHA_NUM[rnd[i] % charsLength]
    }

    return value.join('')
  }

  public new(prefix?: string) {
    if (!prefix) {
      if (this.prefixes.length !== 1) {
        throw new Error('missing prefix for id')
      }
      prefix = this.prefixes[0]
    }

    if (this.prefixes.length && !~this.prefixes.indexOf(prefix)) {
      throw new Error('invalid prefix ' + prefix + ', valid: ' + this.prefixes)
    }

    return prefix + '_' + this.newUid(16)
  }
}
