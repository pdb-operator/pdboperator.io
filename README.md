<p align="center">
  <a href="https://pdboperator.io">
    <img src="https://raw.githubusercontent.com/pdb-operator/pdboperator.io/main/static/img/logo.svg" alt="PDB Operator logo" width="80">
  </a>
</p>

<h1 align="center">pdboperator.io</h1>

<p align="center">
  The source repository for the <a href="https://pdboperator.io">PDB Operator</a> website, documentation, and blog.
  <br />
  Built with <a href="https://docusaurus.io/">Docusaurus 3</a> and hosted on <a href="https://pages.github.com/">GitHub Pages</a>.
</p>

<p align="center">
  <a href="https://github.com/pdb-operator/pdboperator.io/actions/workflows/deploy.yml"><img src="https://github.com/pdb-operator/pdboperator.io/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
  <a href="https://github.com/pdb-operator/pdboperator.io/actions/workflows/check-links.yml"><img src="https://github.com/pdb-operator/pdboperator.io/actions/workflows/check-links.yml/badge.svg" alt="Check Links"></a>
</p>

---

## Get Involved

To learn how to contribute to this project, read the
[Contributing Guide](https://pdboperator.io/docs/community/contributing).

If you are new to PDB Operator and just getting started, you are in a perfect
position to help us improve: the website and documentation is the entry point
for newcomers like you, so if something is unclear or missing,
[let us know](https://github.com/pdb-operator/pdboperator.io/issues/new).

## Development

Prerequisites: [Node.js](https://nodejs.org/) 22+

```bash
npm install            # Install dependencies
npm start              # Start dev server at localhost:3000
npm run build          # Production build
npm run serve          # Serve production build locally
```

## Deployment

The site is automatically deployed to [GitHub Pages](https://pages.github.com/)
via the [deploy workflow](https://github.com/pdb-operator/pdboperator.io/blob/main/.github/workflows/deploy.yml) on every push to `main`.

**Live site:** [https://pdboperator.io](https://pdboperator.io)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and verify with `npm run build`
4. Open a PR against `main`

All commits must include `Signed-off-by` (DCO):

```bash
git commit -s -m "docs: update installation guide"
```

## Found a Security Issue?

If you discover a security issue, read the
[Security Policy](https://pdboperator.io/docs/community/security) before
opening an issue.

## Roles

### Maintainers

- [Nick Nikolakakis](https://github.com/nicknikolakakis)

Learn more about roles in the
[Governance](https://pdboperator.io/docs/community/governance) document. Thanks
to [all who have already contributed](https://github.com/pdb-operator/pdboperator.io/graphs/contributors)!

## License

- Documentation: [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)
- Code: [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)

Copyright 2026 The PDB Operator Authors.
