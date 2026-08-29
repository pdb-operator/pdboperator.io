---
sidebar_position: 7
title: Workload API Support
---

# Workload API Support

When the cluster serves the upstream Workload API (`scheduling.k8s.io/v1beta1`,
[KEP-4671](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4671-gang-scheduling/README.md)),
PDB Operator also manages PDBs for gang-scheduled workloads declared through it: distributed
training jobs, multi-host inference, and anything else that groups pods into `PodGroup`s. Support
is detected at startup; without the API the operator runs unchanged.

Added in operator **v0.5.0**. Requires Kubernetes 1.37 with the `GenericWorkload` feature gate
(beta, off by default) and `scheduling.k8s.io/v1beta1` enabled in the API server.

## Why the operator fills this gap

Upstream gang scheduling is placement-only. `disruptionMode` is consumed by scheduler preemption,
and PodDisruptionBudgets are an explicit non-goal of the KEP, so voluntary evictions such as node
drains are otherwise unprotected. A gang of 8 pods with `minCount: 8` can lose one pod to a drain
and stall the other 7 with nothing telling the eviction API to stop.

PDB Operator reads the declared gang shape and writes the budget the scheduler does not.

## Declared shape to PDB

| Declared shape | PDB behavior |
|----------------|--------------|
| `gang` policy with `disruptionMode: {all: {}}` | The group restarts as a unit, so the budget is quantized to whole pod groups, with the same math as [LeaderWorkerSet](/docs/core-concepts/leaderworkerset#the-calculation) |
| `gang` policy with `disruptionMode: {single: {}}` (or unset) | Pod-level semantics with `minAvailable` floored at the gang `minCount` |
| Single all-mode group, or a `minCount` that leaves no pod evictable | No PDB; a Warning event explains why, since any budget would permanently block drains |
| Multiple gang templates or composite templates | Skipped for now, with a Warning event |

Worked example, 4 groups of 2 pods under `mission-critical` (90%) in all mode:

| Step | Value |
|------|-------|
| `ceil(0.90 × 4)` | 4 |
| clamped to `groups - 1` | 3 |
| `minAvailable = 3 × 2` | **6** |

Both pods of one group can be evicted; the first eviction from a second group is rejected until the
first group is back.

## Pod selection

Pods reference their group through `spec.schedulingGroup.podGroupName`, which is a spec field and
not a label, so a PDB cannot select on it directly. The operator derives the selector from the
labels shared by every pod in the Workload's groups and verifies that the result matches exactly
those pods and nothing else in the namespace.

Until pods exist, or when no exact selector can be derived, no PDB is created and a Warning event
says which. Pods already covered by the LeaderWorkerSet path (carrying the
`leaderworkerset.sigs.k8s.io/name` label) are left to that controller so no pod ever matches two
managed PDBs.

## Policy resolution

The availability class is resolved on the `Workload` object itself: `PDBPolicy` selectors match
its labels, and the `pdboperator.io/*` annotations behave the same as on a Deployment.

## Events

Every skip carries its own event reason, so a single `kubectl get events` on the Workload tells you
what happened without reading operator logs:

| Reason | Meaning |
|--------|---------|
| `WorkloadPDBDeferred` | No pods exist yet; the operator retries every 30s |
| `WorkloadSelectorUnresolvable` | The group's pods share no label set that selects exactly them |
| `WorkloadUnsupported` | Multiple gang templates or a composite template |
| `WorkloadSkipped` | No valid PDB is possible for this shape (single all-mode group, `minCount` covering every pod) |
| `WorkloadUnmanaged` | No policy or annotation applies |

## Example

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: training-critical
spec:
  availabilityClass: mission-critical
  enforcement: strict
  workloadSelector:
    matchLabels:
      app: trainer
---
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: trainer
  labels:
    app: trainer
spec:
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        minCount: 2
    disruptionMode:
      all: {}
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: trainer-workers-0
spec:
  workloadRef:
    workloadName: trainer
    templateName: workers
  schedulingPolicy:
    gang:
      minCount: 2
  disruptionMode:
    all: {}
```

Each pod of the group sets `spec.schedulingGroup.podGroupName: trainer-workers-0` and carries the
`app: trainer` label. With four such groups this produces a PDB with `minAvailable: 6`.

Verify what was created:

```bash
kubectl get pdb -l pdboperator.io/managed-by=pdb-operator
kubectl get events --field-selector involvedObject.name=trainer
```

## Trying it on kind

kind v0.33.0 or newer with a 1.37 node image, and a cluster config that enables the gate and the
API version:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  GenericWorkload: true
runtimeConfig:
  "scheduling.k8s.io/v1beta1": "true"
nodes:
- role: control-plane
  image: kindest/node:v1.37.0
```

## Metrics

`pdb_operator_workloads_managed` reports currently managed Workloads by namespace and
availability class. See the [Metrics Reference](/docs/reference/metrics-reference).

## Related

- [LeaderWorkerSet Support](/docs/core-concepts/leaderworkerset): the same group math on the LWS CRD
- [Architecture](/docs/core-concepts/architecture): where the WorkloadAPIController fits
- [Availability Classes](/docs/core-concepts/availability-classes): the percentages feeding the calculation
