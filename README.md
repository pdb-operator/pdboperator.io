# pdboperator.io

Documentation site for [PDB Operator](https://github.com/pdb-operator/pdb-operator), built with [Docusaurus 3](https://docusaurus.io/).

**Live site:** [https://pdboperator.io](https://pdboperator.io)

## Development

```bash
npm install            # Install dependencies
npm start              # Start dev server at localhost:3000
npm run build          # Production build
npm run serve          # Serve production build locally
```

## Deployment

The site is automatically deployed to GitHub Pages via the [deploy workflow](.github/workflows/deploy.yml) on every push to `main`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and verify with `npm run build`
4. Open a PR against `main`

All commits must include `Signed-off-by` (DCO):

```bash
git commit -s -m "docs: update installation guide"
```

## License

Copyright 2026 The PDB Operator Authors. Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
