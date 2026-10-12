# Frontend Interview Handbook

A bilingual (Persian / English) handbook for frontend interviews — HTML, CSS, JavaScript, TypeScript, Browser and React — with live, editable examples.

**Live:** https://sina-bre.github.io/front-end-hand-book/

## Run locally

```bash
pnpm install
pnpm dev
```

Built with React 19, TypeScript, Vite, MDX and Tailwind CSS.

## Authorship

© 2026 **Sina Baradaran** ([@sina-bre](https://github.com/sina-bre), sinabaradaran01@gmail.com). All rights reserved; see [LICENSE](LICENSE).

Every source file is covered by an Ed25519 signature in [`public/signature.json`](public/signature.json).
The private key never leaves the author's machine, so nobody else can produce a valid signature, even with
full access to this repository. `pnpm build` (and so every deploy) fails if any file was changed without
the author re-signing it.

Author key fingerprint:

```
SHA256:UMnCKsGkAlKFB7siG9BlEmJg0fVfE8DkLCv9cbfxKcA
```

Verify it yourself:

```bash
pnpm verify
```

The author re-signs after each change with `pnpm sign` (one-time setup: `pnpm sign --init`).
