---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Kubernetes cluster | v1.26+ |
| [cert-manager](https://cert-manager.io/) | v1.13+ (when webhooks are enabled) |
| `kubectl` | Configured for your cluster |

:::info Why cert-manager?
The operator uses admission webhooks to validate and default `PDBPolicy` resources. cert-manager automatically provisions and rotates the TLS certificates for the webhook server. You can disable webhooks if cert-manager is not available.
:::

---

## Step 1: Install cert-manager

If you don't have cert-manager installed:

```bash title="Install cert-manager"
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=120s
```

---

## Step 2: Install the Operator

<Tabs>
  <TabItem value="helm" label="Helm" default>

```bash title="Install with Helm"
helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --create-namespace
```

Common overrides:

```bash title="Customize with --set flags"
helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --create-namespace \
  --set controller.watchNamespace=my-namespace \
  --set serviceMonitor.enabled=true \
  --set webhooks.enabled=false \
  --set certManager.enabled=false
```

See [Helm Values Reference](/docs/guides/helm-values) for all options.

  </TabItem>
  <TabItem value="flux" label="Flux CD">

Create the `HelmRepository` source:

```yaml title="flux-helmrepository.yaml"
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: pdb-operator
  namespace: flux-system
spec:
  type: oci
  url: oci://ghcr.io/pdb-operator/charts
  interval: 1h
```

Create the `HelmRelease`:

```yaml title="flux-helmrelease.yaml"
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: pdb-operator
  namespace: pdb-operator-system
spec:
  interval: 1h
  chart:
    spec:
      chart: pdb-operator
      sourceRef:
        kind: HelmRepository
        name: pdb-operator
        namespace: flux-system
  install:
    createNamespace: true
    skipCRDs: true
    remediation:
      retries: 3
  upgrade:
    skipCRDs: true
    remediation:
      retries: 3
  values:
    crds:
      install: true
    replicaCount: 2
    webhooks:
      enabled: true
    certManager:
      enabled: true
    serviceMonitor:
      enabled: false
```

:::tip CRD Management with Flux
Set `crds.install: true` and `skipCRDs: true` so CRDs are managed as Helm templates -- Flux can then upgrade them on chart updates. Without this, Helm only installs CRDs on the first install and never upgrades them.
:::

  </TabItem>
  <TabItem value="kubectl" label="kubectl">

```bash title="One-line install"
kubectl apply -f https://raw.githubusercontent.com/pdb-operator/pdb-operator/main/dist/install.yaml
```

  </TabItem>
  <TabItem value="source" label="From Source">

```bash title="Clone and deploy"
git clone https://github.com/pdb-operator/pdb-operator.git
cd pdb-operator
make deploy IMG=ghcr.io/pdb-operator/pdb-operator:latest
```

  </TabItem>
</Tabs>

---

## Step 3: Verify Installation

Check that the operator pods are running:

```bash
kubectl get pods -n pdb-operator-system
```

Expected output:

```text title="Two replicas with leader election"
NAME                                   READY   STATUS    RESTARTS   AGE
pdb-operator-controller-manager-xxx    1/1     Running   0          30s
pdb-operator-controller-manager-yyy    1/1     Running   0          30s
```

:::tip High Availability
The operator runs with **2 replicas** and leader election by default. Only the leader processes reconciliations -- the standby pod takes over automatically if the leader fails.
:::

Verify the CRD is installed:

```bash
kubectl get crd pdbpolicies.availability.pdboperator.io
```

---

## Disabling Webhooks

If cert-manager is not available, you can run the operator without admission webhooks:

<Tabs>
  <TabItem value="helm-no-wh" label="Helm">

```bash
helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --create-namespace \
  --set webhooks.enabled=false \
  --set certManager.enabled=false
```

  </TabItem>
  <TabItem value="kubectl-no-wh" label="kubectl">

The kubectl manifest deployment requires cert-manager. Use Helm for webhook-less installations.

  </TabItem>
</Tabs>

:::warning
Without webhooks, invalid `PDBPolicy` resources will not be rejected at admission time. The controller will still validate at reconciliation time and report errors in status conditions.
:::

---

## Helm Values Reference

The Helm chart exposes all operator configuration through `values.yaml`. Key sections:

| Section | Description |
|---------|-------------|
| `controller` | `maxConcurrentReconciles`, `watchNamespace`, `syncPeriod`, `logLevel` |
| `cache` | Policy cache TTL, size, maintenance window cache TTL |
| `retry` | Max attempts, backoff delays and factor |
| `webhooks` | Enable/disable admission webhooks, ports, failure policy |
| `certManager` | TLS certificate management (self-signed or external issuer) |
| `metrics` | Bind address, secure mode, service configuration |
| `tracing` | OpenTelemetry endpoint and sample rate |
| `autoscaling` | HPA with CPU/memory targets (default: 2-4 replicas) |
| `podDisruptionBudget` | PDB for safe node drains |
| `serviceMonitor` | Prometheus ServiceMonitor for metrics scraping |
| `prometheusRule` | Prometheus alerting rules (12 alert groups) |
| `networkPolicy` | Restrict metrics endpoint access |
| `crdRoles` | Create admin/editor/viewer ClusterRoles for PDBPolicy |

For the full list, see the [Helm Values Reference](/docs/guides/helm-values) guide.

---

## Uninstall

<Tabs>
  <TabItem value="helm-un" label="Helm" default>

```bash
helm uninstall pdb-operator --namespace pdb-operator-system
```

:::info
Helm does not delete CRDs on uninstall (by design). To fully remove:
```bash
kubectl delete crd pdbpolicies.availability.pdboperator.io
```
:::

  </TabItem>
  <TabItem value="kubectl-un" label="kubectl">

```bash
kubectl delete -f https://raw.githubusercontent.com/pdb-operator/pdb-operator/main/dist/install.yaml
```

  </TabItem>
  <TabItem value="source-un" label="From Source">

```bash
make undeploy
```

  </TabItem>
</Tabs>

:::caution
Deleting the CRD removes all `PDBPolicy` resources and their managed PDBs. Make sure you understand the impact before proceeding.
:::
