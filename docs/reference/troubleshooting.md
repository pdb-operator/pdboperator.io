---
sidebar_position: 3
title: Troubleshooting
---

# Troubleshooting

Common issues and how to resolve them.

## PDBs not being created

1. Check the operator logs:
   ```bash
   kubectl logs -n pdb-operator-system deployment/pdb-operator-controller-manager
   ```

2. Verify the policy matches your deployment:
   ```bash
   kubectl get pdbpolicy -A -o wide
   kubectl get pdb -A -l pdboperator.io/managed-by=pdb-operator
   ```

3. Check policy status for matching workloads:
   ```bash
   kubectl describe pdbpolicy <name>
   ```

4. Ensure the deployment has **2+ replicas**. PDBs are not created for single-replica deployments.

## Webhook errors

1. Verify cert-manager is running and the certificate is ready:
   ```bash
   kubectl get certificate -n pdb-operator-system
   ```

2. Check webhook configuration:
   ```bash
   kubectl get validatingwebhookconfiguration,mutatingwebhookconfiguration | grep pdb
   ```

3. If cert-manager is not installed, the operator falls back to running without webhooks.

## Policy conflicts

When multiple policies match a deployment, the operator uses priority-based resolution. Check which policy was applied:

```bash
kubectl get deployment <name> -o jsonpath='{.metadata.annotations}'
kubectl get events --field-selector involvedObject.name=<name>
```

Higher priority (larger number) wins. If priorities are equal, the result is non-deterministic.

## Metrics not showing

1. Verify the metrics service is running:
   ```bash
   kubectl get svc -n pdb-operator-system | grep metrics
   ```

2. Check ServiceMonitor is picked up by Prometheus:
   ```bash
   kubectl get servicemonitor -n pdb-operator-system
   ```

3. Verify Prometheus targets include the pdb-operator endpoint.

## Getting Help

If the issue persists, open a [GitHub Issue](https://github.com/pdb-operator/pdb-operator/issues) with:
- Operator logs
- PDBPolicy YAML
- Deployment YAML
- Kubernetes version
- PDB Operator version
