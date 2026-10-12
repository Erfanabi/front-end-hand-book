/**
 * Fails unless public/signature.json is a valid signature by the author's key
 * over the current sources. Runs before every build, so an unsigned change
 * can't be deployed. Run with `pnpm verify`.
 */
import { existsSync, readFileSync } from 'node:fs'
import { checkSignature, hashFiles, signatureFile, type Manifest } from './signature.ts'

/**
 * The author's key. Changing it here proves nothing: compare it with the
 * fingerprint published outside this repo (see README → Authorship).
 */
const AUTHOR_FINGERPRINT = process.env.HANDBOOK_FINGERPRINT ?? 'SHA256:UMnCKsGkAlKFB7siG9BlEmJg0fVfE8DkLCv9cbfxKcA'

const fail = (msg: string): never => {
  console.error(`✗ Signature check failed: ${msg}\n  The author must run \`pnpm sign\` to approve these changes.`)
  process.exit(1)
}

if (!existsSync(signatureFile)) fail('public/signature.json is missing')
const { signature, ...manifest } = JSON.parse(readFileSync(signatureFile, 'utf8')) as Manifest & { signature: string }

if (manifest.fingerprint !== AUTHOR_FINGERPRINT) fail(`signed by an unknown key (${manifest.fingerprint})`)
if (!checkSignature(manifest, signature)) fail('the signature does not match the manifest')

const current = hashFiles()
const changed = [...new Set([...Object.keys(current), ...Object.keys(manifest.files)])].filter(
  (f) => current[f] !== manifest.files[f],
)
if (changed.length) fail(`${changed.length} file(s) changed since signing:\n    ${changed.slice(0, 20).join('\n    ')}`)

console.log(`✓ Signed by ${manifest.author.name} (${manifest.fingerprint}), ${Object.keys(current).length} files intact`)
