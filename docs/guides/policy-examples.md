---
sidebar_position: 3
title: Policy Examples
---

# Policy Examples

Real-world PDBPolicy examples for common use cases.

## Core Workloads (High Availability)

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: core-workloads
  namespace: default
  labels:
    pdboperator.io/policy-type: workload
spec:
  availabilityClass: high-availability
  workloadSelector:
    workloadFunctions:
      - core
    matchLabels:
      tier: core
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "UTC"
      daysOfWeek: [0, 6]  # Sunday and Saturday
  priority: 10
```

## Security Workloads (Mission Critical)

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: security-workloads
  namespace: default
  labels:
    pdboperator.io/policy-type: workload
spec:
  availabilityClass: mission-critical
  workloadSelector:
    workloadFunctions:
      - security
    matchLabels:
      tier: security
  maintenanceWindows:
    - start: "03:00"
      end: "05:00"
      timezone: "UTC"
      daysOfWeek: [0]  # Sunday only
  priority: 20
```

## Management Workloads (Standard)

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: management-workloads
  namespace: default
  labels:
    pdboperator.io/policy-type: workload
spec:
  availabilityClass: standard
  workloadSelector:
    workloadFunctions:
      - management
    matchLabels:
      tier: management
  maintenanceWindows:
    - start: "01:00"
      end: "03:00"
      timezone: "UTC"
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]  # Every day
  priority: 5
```

## Strict Production Policy

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: strict-production
spec:
  availabilityClass: high-availability
  enforcement: strict
  priority: 100
  workloadSelector:
    matchLabels:
      env: production
    namespaces:
      - production
      - production-critical
```

## Flexible with Override Reason Required

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: flexible-policy
spec:
  availabilityClass: standard
  enforcement: flexible
  minimumClass: standard
  overrideRequiresReason: true
  workloadSelector:
    matchLabels:
      env: staging
```

Deployments overriding this policy must include:

```yaml
annotations:
  pdboperator.io/availability-class: "high-availability"
  pdboperator.io/override-reason: "Critical payment service needs higher availability"
```
