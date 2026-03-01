---
sidebar_position: 2
title: Availability Classes
---

# Availability Classes

Availability classes define how much of a workload must remain available during voluntary disruptions (node drains, upgrades, scaling).

## Predefined Classes

| Class | MinAvailable | Use Case |
|-------|-------------|----------|
| `non-critical` | 20% | Batch jobs, dev workloads |
| `standard` | 50% | General applications |
| `high-availability` | 75% | Production APIs, databases |
| `mission-critical` | 90% | Payment systems, auth services |
| `custom` | User-defined | Full control via `customPDBConfig` |

## Security Workload Boosting

Workloads with `pdboperator.io/workload-function: security` are automatically boosted to a higher availability class:

| Original Class | Security-Boosted Class | Effective MinAvailable |
|---------------|----------------------|----------------------|
| `non-critical` | `standard` | 50% |
| `standard` | `high-availability` | 75% |
| `high-availability` | (unchanged) | 75% |
| `mission-critical` | (unchanged) | 90% |

This ensures security-critical workloads like authentication services, firewalls, and certificate managers always have higher availability protection.

## Example

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: production-policy
spec:
  availabilityClass: high-availability
  workloadSelector:
    matchLabels:
      env: production
```

This creates PDBs with `minAvailable: 75%` for all deployments labeled `env: production`.

## Related

- [Enforcement Modes](/docs/core-concepts/enforcement-modes): control whether annotations can override the class
- [Workload Functions](/docs/core-concepts/workload-functions): how security workloads get automatic boosting
- [Custom PDB Configuration](/docs/guides/custom-pdb-config): fine-grained control with `availabilityClass: custom`
