---
sidebar_position: 5
title: Workload Functions
---

# Workload Functions

PDB Operator classifies workloads into three functions, each with different PDB behavior.

## Functions

| Function | Description | PDB Behavior |
|----------|-------------|-------------|
| `core` | Standard application workloads | Normal availability class applied |
| `management` | Infrastructure and management workloads | Normal availability class applied |
| `security` | Security-critical workloads (auth, certificates, firewalls) | Automatic availability class boosting |

## Setting the Function

### Via Policy Selector

Target workloads by function in the policy's workload selector:

```yaml
spec:
  workloadSelector:
    workloadFunctions:
      - security
```

### Via Deployment Annotation

Set the function directly on a deployment:

```yaml
metadata:
  annotations:
    pdboperator.io/workload-function: "security"
```

## Security Boosting

When a workload's function is `security`, its availability class is automatically boosted:

- `non-critical` (20%) becomes `standard` (50%)
- `standard` (50%) becomes `high-availability` (75%)
- `high-availability` and `mission-critical` remain unchanged

This ensures security workloads always have higher protection without requiring manual configuration.

## Related

- [Availability Classes](/docs/core-concepts/availability-classes): the full boosting table and class definitions
- [Annotations Reference](/docs/guides/annotations): setting workload function via annotations
- [Policy Examples](/docs/guides/policy-examples): policies targeting specific workload functions
