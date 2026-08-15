---
sidebar_position: 6
title: LeaderWorkerSet Support
---

# LeaderWorkerSet Support

When the [LeaderWorkerSet](https://lws.sigs.k8s.io/) CRD (`leaderworkerset.x-k8s.io/v1`) is
installed, PDB Operator also manages PDBs for LWS workloads such as multi-host vLLM or SGLang
deployments. Support is detected at startup; without the CRD the operator runs unchanged.

Added in operator **v0.4.0**.

## Why groups, not pods

An LWS group restarts as a unit. Under the default `RecreateGroupOnPodRestart`, evicting a single
pod takes down all `size` pods in its group.

A budget that counts individual pods is wrong in both directions:

- It **under-protects** capacity, because losing one pod really means losing a whole group
- It can **deadlock node drains**, because the percentage never lines up with a group boundary

So the operator quantizes the budget to whole groups.

## The calculation

```
desiredGroups = ceil(class% × replicas), clamped to replicas - 1
minAvailable  = desiredGroups × size
```

Worked example, `replicas: 4` and `size: 8` under `mission-critical` (90%):

| Step | Value |
|------|-------|
| `ceil(0.90 × 4)` | 4 |
| clamped to `replicas - 1` | 3 |
| `minAvailable = 3 × 8` | **24** |

Exactly one group may be disrupted at a time, and a drain always makes progress.

Granularity is whole groups, so a 4-group set has only 4 protection steps. Availability classes
that land between group boundaries round to the nearest whole group.

## Special cases

| Shape | Behavior |
|-------|----------|
| `replicas: 1` | No PDB is created. Any budget over a single group would permanently block node drains, so the operator emits a Warning event explaining why instead |
| `size: 1` | Plain pod-level semantics, identical to a Deployment |
| `custom` with absolute `minAvailable` | Rounded up to the next whole group, so a hand-set budget can never split one |
| LWS CRD absent | The controller is not registered; nothing else changes |

## Pod selection and StatefulSet overlap

The managed PDB selects on the `leaderworkerset.sigs.k8s.io/name` label, which covers both leader
and worker pods.

LWS implements each set as a leader StatefulSet plus per-group worker StatefulSets. The
[StatefulSetController](/docs/core-concepts/architecture#statefulsetcontroller) skips those
(detected by the same label) so a pod never matches more than one managed PDB. If it did, the
eviction API would reject every eviction for those pods.

## Example

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: inference-critical
spec:
  availabilityClass: mission-critical
  enforcement: strict
  workloadSelector:
    matchLabels:
      workload: inference
```

Applied to a LeaderWorkerSet with `replicas: 4` and `size: 8`, this produces a PDB with
`minAvailable: 24`.

Verify what was created:

```bash
kubectl get pdb -l pdboperator.io/managed-by=pdb-operator
kubectl get events --field-selector involvedObject.name=<lws-name>
```

## Metrics

`pdb_operator_leaderworkersets_managed` reports currently managed LeaderWorkerSets by namespace
and availability class. See the [Metrics Reference](/docs/reference/metrics-reference).

## Related

- [Architecture](/docs/core-concepts/architecture): how the four controllers fit together
- [Availability Classes](/docs/core-concepts/availability-classes): the percentages feeding the calculation
- [Custom PDB Configuration](/docs/guides/custom-pdb-config): absolute `minAvailable` and group rounding
