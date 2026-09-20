import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// Test the tarball outside the repository so self-resolution cannot hide missing files.
const directory = mkdtempSync(join(tmpdir(), 'stripe-id-generator-'))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
try {
  const [archive] = JSON.parse(
    execFileSync(
      npm,
      ['pack', '--ignore-scripts', '--json', '--pack-destination', directory],
      {
        encoding: 'utf8',
      },
    ),
  )
  assert.ok(
    archive.files.some(({ path }) => path === 'dist/stripe-id-generator.cjs'),
  )
  assert.ok(
    archive.files.every(({ path }) =>
      /^(dist\/|package.json$|README.md$|LICENSE$)/.test(path),
    ),
  )
  const modules = join(directory, 'node_modules')
  mkdirSync(modules)
  execFileSync('tar', [
    '-xzf',
    join(directory, archive.filename),
    '-C',
    modules,
  ])
  cpSync(join(modules, 'package'), join(modules, 'stripe-id-generator'), {
    recursive: true,
  })
  const metadata = JSON.parse(
    readFileSync(join(modules, 'stripe-id-generator/package.json'), 'utf8'),
  )
  assert.equal(Object.keys(metadata.dependencies ?? {}).length, 0)
  cpSync(
    'test/stripe-id-generator.test.mjs',
    join(directory, 'consumer.test.mjs'),
  )
  execFileSync(process.execPath, ['--test', 'consumer.test.mjs'], {
    cwd: directory,
    stdio: 'inherit',
  })
  cpSync('test/types', join(directory, 'types'), { recursive: true })
  execFileSync(
    process.execPath,
    [
      resolve('node_modules/typescript/bin/tsc'),
      '-p',
      join(directory, 'types/tsconfig.json'),
    ],
    { stdio: 'inherit' },
  )
  console.log('Packed CommonJS, ESM, and TypeScript consumer checks passed.')
} finally {
  rmSync(directory, { recursive: true, force: true })
}
