---
sidebar_position: 1
title: What is PDB Operator?
---

# What is PDB Operator?

PDB Operator is a Kubernetes operator that automates [PodDisruptionBudget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) management through **policy-driven availability classes**.

Define your availability requirements declaratively and let the operator create, update, and reconcile PDBs across your cluster.

## Why PDB Operator?

Managing PodDisruptionBudgets at scale is painful. Teams forget to create them, set incorrect values, or leave stale PDBs behind. PDB Operator solves this by:

- **Policy-driven:** define availability classes (`non-critical`, `standard`, `high-availability`, `mission-critical`) and the operator calculates the right PDB settings
- **Selector-based:** target workloads by labels, names, functions, or namespaces
- **Enforcement modes:** choose `strict`, `flexible`, or `advisory` enforcement per policy
- **Maintenance windows:** automatically relax PDBs during scheduled maintenance
- **Workload-aware:** security workloads get automatically boosted availability
- **Observable:** built-in Prometheus metrics, OpenTelemetry tracing, structured logging, and Kubernetes events

## Current Status

PDB Operator is currently in **alpha** (`v0.1.0`). The API version is `v1alpha1`, meaning the API may change before reaching v1. See the [Roadmap](/docs/community/roadmap) for planned features.

## Installation

PDB Operator can be installed via **Helm** (recommended) or plain manifests. See the [Installation guide](/docs/getting-started/installation) for details.

```bash
helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --create-namespace
```

## Next Steps

- [Install PDB Operator](/docs/getting-started/installation)
- [Create your first policy](/docs/getting-started/quickstart)
- [Learn about availability classes](/docs/core-concepts/availability-classes)
- [Helm chart configuration](/docs/guides/helm-values)
