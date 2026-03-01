---
sidebar_position: 2
title: Installation
---

# Installation

## Prerequisites

- Kubernetes 1.28+
- kubectl
- [cert-manager](https://cert-manager.io/) (for webhook TLS)

## Install

```bash
kubectl apply -f https://raw.githubusercontent.com/pdb-operator/pdb-operator/main/dist/install.yaml
```

## Verify

Check the operator is running:

```bash
kubectl get pods -n pdb-operator-system
```

You should see the controller manager pod in `Running` state.

## Development Installation

For contributing or local development:

```bash
# Clone the repository
git clone https://github.com/pdb-operator/pdb-operator.git
cd pdb-operator

# Install CRDs
make install

# Run the controller locally
make run
```

See the [Contributing Guide](/docs/community/contributing) for full development setup instructions.

## Uninstall

```bash
# Remove sample resources
kubectl delete -k config/samples/

# Remove CRDs
make uninstall

# Remove the operator
make undeploy
```
