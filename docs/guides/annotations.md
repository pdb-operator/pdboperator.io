---
sidebar_position: 1
title: Annotations Reference
---

# Annotations Reference

PDB Operator uses annotations on Deployments to allow workload-level overrides and configuration.

## Deployment Annotations

| Annotation | Description |
|-----------|-------------|
| `pdboperator.io/availability-class` | Override the availability class (`non-critical`, `standard`, `high-availability`, `mission-critical`, `custom`) |
| `pdboperator.io/workload-function` | Workload function: `core`, `management`, `security` |
| `pdboperator.io/workload-name` | Explicit workload name for selector matching |
| `pdboperator.io/maintenance-window` | Override maintenance window (format: `HH:MM-HH:MM TZ`) |
| `pdboperator.io/override-reason` | Required when `overrideRequiresReason` is enabled on the policy |

## Managed PDB Labels

PDBs created by the operator are labeled for identification:

| Label | Description |
|-------|-------------|
| `pdboperator.io/managed-by` | Marks PDB as managed by pdb-operator |
| `pdboperator.io/workload` | References the protected workload |
| `pdboperator.io/availability-class` | Applied availability class |

## Examples

### Override availability class

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  annotations:
    pdboperator.io/availability-class: "mission-critical"
    pdboperator.io/workload-function: "security"
```

### Query managed PDBs

```bash
kubectl get pdb -A -l pdboperator.io/managed-by=pdb-operator
```
