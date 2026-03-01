# Contributing to pdboperator.io

Thank you for your interest in contributing to the PDB Operator documentation site.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- npm

## Development

```bash
npm install            # Install dependencies
npm start              # Start dev server at localhost:3000
npm run build          # Verify production build
```

## Making Changes

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Verify the build passes with `npm run build`
5. Open a PR against `main`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `docs:` documentation changes
- `feat:` new feature or page
- `fix:` bug fix
- `ci:` CI/CD changes
- `chore:` maintenance tasks

## Developer Certificate of Origin (DCO)

All commits must include a `Signed-off-by` line:

```bash
git commit -s -m "docs: update installation guide"
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
