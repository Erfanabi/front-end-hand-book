/**
 * Signs the current sources with the author's private key and writes
 * public/signature.json. Run with `pnpm sign` after every change.
 *
 * The key lives OUTSIDE the repo (default ~/.handbook-signing/ed25519.pem,
 * override with HANDBOOK_SIGNING_KEY). `pnpm sign --init` creates it once.
 */
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { author, fingerprintOf, hashFiles, payload, signatureFile, type Manifest } from './signature.ts'

const keyFile = process.env.HANDBOOK_SIGNING_KEY ?? join(homedir(), '.handbook-signing', 'ed25519.pem')

if (process.argv.includes('--init')) {
  if (existsSync(keyFile)) throw new Error(`Refusing to overwrite the existing key at ${keyFile}`)
  const { privateKey } = generateKeyPairSync('ed25519')
  mkdirSync(dirname(keyFile), { recursive: true })
  writeFileSync(keyFile, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 })
  console.log(`New signing key written to ${keyFile} — back it up somewhere safe and never commit it.`)
}

if (!existsSync(keyFile)) {
  console.error(`No signing key at ${keyFile}. Run \`pnpm sign --init\` once (or set HANDBOOK_SIGNING_KEY).`)
  process.exit(1)
}

const privateKey = createPrivateKey(readFileSync(keyFile))
const rawPublic = Buffer.from(createPublicKey(privateKey).export({ format: 'jwk' }).x!, 'base64url')

const manifest: Manifest = {
  author,
  publicKey: rawPublic.toString('base64'),
  fingerprint: fingerprintOf(rawPublic),
  signedAt: new Date().toISOString(),
  files: hashFiles(),
}
const signature = sign(null, payload(manifest), privateKey).toString('base64')

writeFileSync(signatureFile, JSON.stringify({ ...manifest, signature }, null, 2) + '\n')
console.log(`✓ Signed ${Object.keys(manifest.files).length} files as ${author.name} (${manifest.fingerprint})`)
