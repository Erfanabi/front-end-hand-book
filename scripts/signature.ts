/**
 * Shared helpers for the authorship signature (`pnpm sign` / `pnpm verify`).
 *
 * The signature covers a SHA-256 hash of every source file listed below. It is
 * made with an Ed25519 private key that never enters the repository, so nobody
 * else can produce a valid signature, even with full access to the code.
 */
import { createHash, createPublicKey, verify } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

export const root = join(import.meta.dirname, '..')
export const signatureFile = join(root, 'public', 'signature.json')

export const author = {
  name: 'Sina Baradaran',
  email: 'sinabaradaran01@gmail.com',
  url: 'https://github.com/sina-bre',
}

/** Signed paths, relative to the repo root. Directories are walked recursively. */
const signedPaths = ['LICENSE', 'README.md', 'index.html', 'package.json', 'messages', 'src', 'build', 'scripts']
/** Generated or local-only paths that must not be signed. */
const skipped = new Set(['src/paraglide'])

const walk = (path: string): string[] => {
  const rel = relative(root, path).split(sep).join('/')
  if (skipped.has(rel)) return []
  return statSync(path).isDirectory() ? readdirSync(path).flatMap((name) => walk(join(path, name))) : [rel]
}

/** sha256 of each signed file. CR bytes are dropped so Windows (CRLF) and CI (LF) checkouts hash the same. */
export function hashFiles(): Record<string, string> {
  const files = signedPaths.flatMap((p) => walk(join(root, p))).sort()
  const bytes = (file: string) => readFileSync(join(root, file)).filter((b) => b !== 0x0d)
  return Object.fromEntries(files.map((f) => [f, createHash('sha256').update(bytes(f)).digest('hex')]))
}

export interface Manifest {
  author: typeof author
  publicKey: string // base64 of the raw 32-byte Ed25519 public key
  fingerprint: string
  signedAt: string
  files: Record<string, string>
}

/** The exact bytes that are signed. Key order is fixed, so JSON.stringify is stable. */
export const payload = (m: Manifest) =>
  Buffer.from(JSON.stringify([m.author, m.publicKey, m.fingerprint, m.signedAt, m.files]))

export const fingerprintOf = (rawPublicKey: Buffer) =>
  'SHA256:' + createHash('sha256').update(rawPublicKey).digest('base64').replace(/=+$/, '')

export const publicKeyFromRaw = (raw: Buffer) =>
  createPublicKey({ key: { kty: 'OKP', crv: 'Ed25519', x: raw.toString('base64url') }, format: 'jwk' })

export const checkSignature = (m: Manifest, signature: string) =>
  verify(null, payload(m), publicKeyFromRaw(Buffer.from(m.publicKey, 'base64')), Buffer.from(signature, 'base64'))
