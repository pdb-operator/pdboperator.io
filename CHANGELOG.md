# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Animated hero flow diagram: workloads reconcile through the operator into managed PDBs, cycling every 3s, pausable on hover or focus
- Layered coverage panel for workload kinds, policy, and operations
- `docs/core-concepts/leaderworkerset.md` covering group-aware budgets for multi-host inference
- `pdb_operator_statefulsets_managed` and `pdb_operator_leaderworkersets_managed` in the metrics reference
- CNCF Slack link in the navbar

### Changed

- Rebuilt the landing page around StatefulSet, LeaderWorkerSet, maintenance windows, and enforcement modes
- Display headings moved to Inter; JetBrains Mono retained for labels, code, and nav
- `architecture.md` now documents all four controllers; the mermaid diagram includes StatefulSet and LeaderWorkerSet
- Roadmap marks v0.2.0 through v0.4.1 shipped and renumbers planned work to v0.5.0 and v0.6.0
- Dropped planned DaemonSet support: DaemonSets have no replica count, so percentage-based availability classes do not apply
- `monitoring.md` corrects the alert group count to 11 and flags the circuit-breaker group as inert

### Fixed

- Scroll-reveal no longer leaves sections blank when JavaScript or `IntersectionObserver` is unavailable
- Global inline-code border no longer draws boxes inside landing-page code blocks
- Wide reference tables scroll inside themselves instead of overflowing the page on mobile
- Hero diagram type and the copy button now meet minimum legibility and touch-target sizes on mobile
- `community/roadmap` added to the sidebar; duplicate `sidebar_position: 4` in `guides/` resolved
- CHANGELOG link references for 0.3.0, 0.4.0, and 0.4.1

## [0.4.1] - 2026-08-15

### Changed

- Updated operator version references to v0.4.1 (managed-workload metrics fix)

## [0.4.0] - 2026-08-15

### Changed

- Updated operator version references to v0.4.0 (group-aware PDBs for LeaderWorkerSet, Go 1.26.6 security bump)

## [0.3.0] - 2026-06-27

### Changed

- Updated operator version references to v0.3.0

## [0.2.2] - 2026-06-21

### Changed

- Updated operator version references to v0.2.2

## [0.2.1] - 2026-06-21

### Changed

- Updated operator version references to v0.2.1

## [0.2.0] - 2026-06-20

### Changed

- Updated operator version references to v0.2.0
- Re-scoped v0.2.0 roadmap to StatefulSet Support; marked it complete and moved DaemonSet support and per-workload-type PDB strategies to v0.3.0
- Homepage release badge now reads the operator's latest GitHub release dynamically

## [0.1.1] - 2026-03-21

### Changed

- Updated operator version references to v0.1.1
- Updated roadmap with v0.1.1 release items

## [0.1.0] - 2026-03-01

### Added

- Docusaurus 3 site with Kubernetes blue theming and Geist fonts
- Documentation for getting started, core concepts, guides, reference, and community
- Landing page with terminal preview, feature cards, and how-it-works flow
- Blog with v0.1.0 release announcement
- GitHub Pages deployment workflow (SHA-pinned actions)
- Link checker workflow
- Dependabot configuration for npm and GitHub Actions
- CNCF governance files (LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, GOVERNANCE, MAINTAINERS)

[Unreleased]: https://github.com/pdb-operator/pdboperator.io/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/pdb-operator/pdboperator.io/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/pdb-operator/pdboperator.io/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/pdb-operator/pdboperator.io/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/pdb-operator/pdboperator.io/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/pdb-operator/pdboperator.io/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/pdb-operator/pdboperator.io/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/pdb-operator/pdboperator.io/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/pdb-operator/pdboperator.io/releases/tag/v0.1.0
