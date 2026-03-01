---
sidebar_position: 3
title: Quick Start
---

# Quick Start

This guide walks you through creating your first PDBPolicy and seeing it in action.

## Create a Policy

Apply a policy that targets all production deployments with high-availability PDBs:

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: production-ha
  namespace: default
spec:
  availabilityClass: high-availability
  enforcement: strict
  priority: 100
  workloadSelector:
    matchLabels:
      env: production
    namespaces:
      - default
      - production
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "UTC"
      daysOfWeek: [0, 6]  # Sunday, Saturday
```

This ensures all `env: production` deployments in the `default` and `production` namespaces get PDBs with **75% minimum availability**, enforced strictly (annotations cannot override).

## Verify PDBs Were Created

```bash
# Check the policy status
kubectl get pdbpolicy production-ha -o wide

# List managed PDBs
kubectl get pdb -A -l pdboperator.io/managed-by=pdb-operator
```

## Annotate Deployments (Optional)

For `advisory` and `flexible` enforcement modes, deployments can override the policy:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service
  annotations:
    pdboperator.io/availability-class: "mission-critical"
    pdboperator.io/workload-function: "security"
    pdboperator.io/workload-name: "auth-service"
```

## What's Next?

- Learn about [Availability Classes](/docs/core-concepts/availability-classes)
- Understand [Enforcement Modes](/docs/core-concepts/enforcement-modes)
- See more [Policy Examples](/docs/guides/policy-examples)
