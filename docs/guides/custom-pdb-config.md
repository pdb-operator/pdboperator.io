---
sidebar_position: 2
title: Custom PDB Configuration
---

# Custom PDB Configuration

For fine-grained control over PDB settings, use `availabilityClass: custom` with a `customPDBConfig`.

## Usage

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: custom-policy
spec:
  availabilityClass: custom
  customPDBConfig:
    minAvailable: "3"
    unhealthyPodEvictionPolicy: IfHealthyBudget
  workloadSelector:
    matchLabels:
      app: my-database
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `minAvailable` | string | Minimum number or percentage of pods that must be available. Mutually exclusive with `maxUnavailable`. |
| `maxUnavailable` | string | Maximum number or percentage of pods that can be unavailable. Mutually exclusive with `minAvailable`. |
| `unhealthyPodEvictionPolicy` | string | Policy for evicting unhealthy pods: `IfHealthyBudget` or `AlwaysAllow` |

## Examples

### Fixed number of available pods

```yaml
customPDBConfig:
  minAvailable: "3"
```

### Maximum unavailable pods

```yaml
customPDBConfig:
  maxUnavailable: "1"
```

### Percentage-based with unhealthy pod eviction

```yaml
customPDBConfig:
  minAvailable: "80%"
  unhealthyPodEvictionPolicy: IfHealthyBudget
```
