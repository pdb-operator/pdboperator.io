---
sidebar_position: 3
---

# Quick Start

Create your first `PDBPolicy` and watch it protect workloads with PodDisruptionBudgets.

---

## 1. Deploy sample workloads

Create a namespace with sample deployments:

```bash title="Create demo workloads"
kubectl create namespace demo
kubectl create deployment api-server --image=nginx:latest -n demo --replicas=3
kubectl create deployment auth-service --image=nginx:latest -n demo --replicas=2
kubectl label deployment api-server tier=core -n demo
kubectl label deployment auth-service tier=core -n demo
kubectl wait --for=condition=Available deployment --all -n demo --timeout=60s
```

---

## 2. Create a PDBPolicy

```yaml title="production-ha.yaml"
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: production-ha
  namespace: demo
spec:
  availabilityClass: high-availability
  enforcement: strict
  priority: 100
  workloadSelector:
    matchLabels:
      tier: core
    namespaces:
      - demo
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "UTC"
      daysOfWeek: [0, 6]  # Sunday, Saturday
```

Apply it:

```bash
kubectl apply -f production-ha.yaml
```

This ensures all `tier: core` deployments in the `demo` namespace get PDBs with **75% minimum availability**, enforced strictly (annotations cannot override).

---

## 3. Verify PDBs were created

```bash
kubectl get pdbp production-ha -o wide
```

```text title="Policy status"
NAME            CLASS               ENFORCEMENT   PRIORITY   WORKLOADS   AGE
production-ha   high-availability   strict        100        2           10s
```

```bash
kubectl get pdb -n demo -l pdboperator.io/managed-by=pdb-operator
```

```text title="Managed PDBs"
NAME                  MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
api-server-pdb        75%             N/A               1                     10s
auth-service-pdb      75%             N/A               0                     10s
```

:::tip Short name
The PDBPolicy resource supports the short name `pdbp` -- use it to save typing:
```bash
kubectl get pdbp -A
```
:::

---

## 4. Check events

```bash
kubectl get events -n demo --field-selector reason=PDBCreated --sort-by=.lastTimestamp
```

```text title="Events emitted during reconciliation"
LAST SEEN   TYPE     REASON       OBJECT                      MESSAGE
10s         Normal   PDBCreated   deployment/api-server        Created PDB api-server-pdb (high-availability, 75%)
10s         Normal   PDBCreated   deployment/auth-service      Created PDB auth-service-pdb (high-availability, 75%)
```

---

## 5. Annotate deployments (optional)

For `advisory` and `flexible` enforcement modes, deployments can override the policy via annotations:

```yaml title="Override availability class"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
  annotations:
    pdboperator.io/availability-class: "mission-critical"
    pdboperator.io/workload-function: "security"
```

:::info
In `strict` mode (like our example), annotations are ignored. Switch to `advisory` or `flexible` to allow overrides. See [Enforcement Modes](/docs/core-concepts/enforcement-modes).
:::

---

## 6. Clean up

```bash
kubectl delete pdbpolicy production-ha -n demo
kubectl delete namespace demo
```

---

## Next Steps

| Guide | Description |
|-------|-------------|
| [Availability Classes](/docs/core-concepts/availability-classes) | Predefined levels and security boosting |
| [Enforcement Modes](/docs/core-concepts/enforcement-modes) | Control how annotations override policies |
| [Maintenance Windows](/docs/core-concepts/maintenance-windows) | Schedule disruption windows |
| [Policy Examples](/docs/guides/policy-examples) | Real-world policy configurations |
| [API Reference](/docs/reference/api-reference) | Full spec and status documentation |
