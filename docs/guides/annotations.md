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
| `pdboperator.io/managed-by` | Always set to `pdb-operator` |
| `pdboperator.io/workload` | Name of the protected deployment |
| `pdboperator.io/workload-function` | Workload function (`core`, `management`, `security`) |
| `pdboperator.io/availability-class` | Applied availability class |

## Managed PDB Annotations

PDBs created by the operator include metadata annotations:

| Annotation | Description |
|-----------|-------------|
| `pdboperator.io/created-by` | Always set to `pdb-operator` |
| `pdboperator.io/creation-time` | Timestamp when the PDB was first created |
| `pdboperator.io/last-modified` | Timestamp of the last PDB update |
| `pdboperator.io/policy-source` | Name of the PDBPolicy that created this PDB |
| `pdboperator.io/enforcement-mode` | Enforcement mode applied (`strict`, `flexible`, `advisory`) |

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

### Override with reason (when required by policy)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
  annotations:
    pdboperator.io/availability-class: "mission-critical"
    pdboperator.io/override-reason: "Critical payment service needs higher availability"
```

### Query managed PDBs

```bash
# List all managed PDBs
kubectl get pdb -A -l pdboperator.io/managed-by=pdb-operator

# Find PDBs for a specific workload
kubectl get pdb -A -l pdboperator.io/workload=my-service

# Find PDBs by availability class
kubectl get pdb -A -l pdboperator.io/availability-class=mission-critical
```
