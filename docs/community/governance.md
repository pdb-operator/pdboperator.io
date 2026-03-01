---
sidebar_position: 2
title: Governance
---

# Governance

This document describes the governance model for the PDB Operator project.

## Principles

- **Open:** the project is open source and welcomes contributions from anyone
- **Transparent:** all decisions are made in public (GitHub issues, discussions, PRs)
- **Merit-based:** contributions and demonstrated commitment determine advancement in roles

## Roles

### Contributors

Anyone who contributes to the project (code, documentation, issues, reviews).

### Reviewers

Contributors who have demonstrated:
- Understanding of the codebase and project goals
- Consistent, high-quality code reviews
- Active participation over a sustained period

Reviewers can approve PRs but cannot merge without a maintainer's approval.

**How to become a reviewer**: Nominated by a maintainer, approved by majority of maintainers.

### Maintainers

Maintainers have full commit access and are responsible for:
- Setting the project direction and roadmap
- Reviewing and merging pull requests
- Managing releases
- Triaging issues
- Ensuring the project adheres to its governance and code of conduct

Current maintainers are listed in [MAINTAINERS.md](https://github.com/pdb-operator/pdb-operator/blob/main/MAINTAINERS.md).

**How to become a maintainer**: Nominated by an existing maintainer, approved by supermajority (2/3) of current maintainers. Candidates should have been active reviewers for at least 3 months.

## Decision Making

- **Lazy consensus:** a proposal is considered accepted if no maintainer objects within 72 hours
- **Voting:** for contentious issues, each maintainer gets one vote. Simple majority wins, except governance changes which require supermajority (2/3)
- **Conflict resolution:** if consensus cannot be reached, the lead maintainer makes the final decision

## Changes to Governance

Changes require:
- A pull request with the proposed changes
- Supermajority (2/3) approval from maintainers
- A minimum review period of 7 days
