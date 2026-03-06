---
sidebar_position: 1
title: API Reference
---

# PDBPolicy API Reference

API Group: `availability.pdboperator.io/v1alpha1`

## PDBPolicy

| Field | Type | Description |
|-------|------|-------------|
| `apiVersion` | string | `availability.pdboperator.io/v1alpha1` |
| `kind` | string | `PDBPolicy` |
| `metadata` | ObjectMeta | Standard Kubernetes metadata |
| `spec` | PDBPolicySpec | Desired state |
| `status` | PDBPolicyStatus | Observed state (read-only) |

## PDBPolicySpec

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `availabilityClass` | string | *(required)* | One of: `non-critical`, `standard`, `high-availability`, `mission-critical`, `custom` |
| `workloadSelector` | WorkloadSelector | *(required)* | Defines which workloads this policy applies to |
| `enforcement` | string | `advisory` | Enforcement mode: `strict`, `flexible`, `advisory` |
| `priority` | int32 | `50` | Policy priority (0-1000). Higher number wins when multiple policies match |
| `minimumClass` | string | | Minimum allowed class (used with `flexible` enforcement) |
| `allowOverride` | bool | `true` | Whether annotations can override this policy |
| `overrideRequiresAnnotation` | string | | Annotation key required for override |
| `overrideRequiresReason` | bool | `false` | Require `pdboperator.io/override-reason` annotation for overrides |
| `maintenanceWindows` | []MaintenanceWindow | | Scheduled maintenance windows |
| `customPDBConfig` | PodDisruptionBudgetConfig | | Custom PDB settings (required when `availabilityClass: custom`) |
| `enforceMinReplicas` | bool | `true` | Skip PDB creation for single-replica deployments |

## WorkloadSelector

| Field | Type | Description |
|-------|------|-------------|
| `matchLabels` | map[string]string | Label key-value pairs that must match |
| `matchExpressions` | []LabelSelectorRequirement | Label selector expressions |
| `workloadNames` | []string | Specific deployment names to match |
| `workloadFunctions` | []string | Target by function: `core`, `management`, `security` |
| `namespaces` | []string | Namespaces to scope the policy to |

## MaintenanceWindow

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `start` | string | *(required)* | Start time in `HH:MM` format |
| `end` | string | *(required)* | End time in `HH:MM` format |
| `timezone` | string | `UTC` | IANA timezone |
| `daysOfWeek` | []int | *(required)* | Days of week (0=Sunday, 6=Saturday) |

## PodDisruptionBudgetConfig

| Field | Type | Description |
|-------|------|-------------|
| `minAvailable` | string | Minimum available pods (number or percentage). Mutually exclusive with `maxUnavailable` |
| `maxUnavailable` | string | Maximum unavailable pods (number or percentage). Mutually exclusive with `minAvailable` |
| `unhealthyPodEvictionPolicy` | string | `IfHealthyBudget` or `AlwaysAllow` |

## PDBPolicyStatus

| Field | Type | Description |
|-------|------|-------------|
| `conditions` | []Condition | Standard Kubernetes conditions |
| `appliedToWorkloads` | []string | List of workloads this policy currently applies to |
| `pdbsManaged` | []string | List of PDB names managed by this policy |
| `lastAppliedTime` | Time | Last time the policy was successfully applied |
| `observedGeneration` | int64 | Last observed generation of the policy |

## Short Names

The PDBPolicy resource supports the short name `pdbp`:

```bash
kubectl get pdbp
```
