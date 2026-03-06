---
sidebar_position: 4
title: Helm Chart Reference
---

# Helm Chart Reference

Complete reference for configuring the PDB Operator Helm chart.

## Install

```bash
helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --create-namespace
```

## Controller

| Parameter | Default | Description |
|-----------|---------|-------------|
| `controller.maxConcurrentReconciles` | `5` | Maximum concurrent reconciliation loops |
| `controller.watchNamespace` | `""` | Namespace to watch (empty = all namespaces) |
| `controller.syncPeriod` | `"10h"` | Full cache resync period |
| `controller.logLevel` | `"info"` | Log level: `debug`, `info`, `error` |

## Cache

| Parameter | Default | Description |
|-----------|---------|-------------|
| `cache.policyCacheTTL` | `"5m"` | Time-to-live for cached policies |
| `cache.policyCacheSize` | `100` | Maximum number of cached policies |
| `cache.maintenanceWindowCacheTTL` | `"1m"` | TTL for maintenance window evaluations |

## Retry

| Parameter | Default | Description |
|-----------|---------|-------------|
| `retry.maxAttempts` | `5` | Maximum retry attempts |
| `retry.initialDelay` | `"100ms"` | Initial backoff delay |
| `retry.maxDelay` | `"30s"` | Maximum backoff delay |
| `retry.backoffFactor` | `2.0` | Exponential backoff multiplier |

## Webhooks

| Parameter | Default | Description |
|-----------|---------|-------------|
| `webhooks.enabled` | `true` | Enable admission webhooks |
| `webhooks.port` | `443` | Webhook service port |
| `webhooks.targetPort` | `9443` | Webhook container port |
| `webhooks.failurePolicy` | `Fail` | Webhook failure policy |
| `webhooks.timeoutSeconds` | `10` | Webhook timeout |

## cert-manager

| Parameter | Default | Description |
|-----------|---------|-------------|
| `certManager.enabled` | `true` | Use cert-manager for webhook TLS |
| `certManager.selfSigned` | `true` | Create a self-signed Issuer |
| `certManager.issuerKind` | `Issuer` | `Issuer` or `ClusterIssuer` |
| `certManager.issuerName` | `""` | External issuer name (when not self-signed) |

## Metrics

| Parameter | Default | Description |
|-----------|---------|-------------|
| `metrics.bindAddress` | `":8443"` | Metrics bind address |
| `metrics.secure` | `true` | Serve metrics over HTTPS |
| `metrics.service.enabled` | `true` | Create metrics Service |
| `metrics.service.port` | `8443` | Metrics service port |

## Tracing

| Parameter | Default | Description |
|-----------|---------|-------------|
| `tracing.enabled` | `true` | Enable OpenTelemetry tracing |
| `tracing.endpoint` | `""` | OTLP collector endpoint |
| `tracing.sampleRate` | | Trace sampling rate (0.0-1.0) |

## High Availability

| Parameter | Default | Description |
|-----------|---------|-------------|
| `replicaCount` | `2` | Operator replicas |
| `leaderElection.enabled` | `true` | Enable leader election |
| `autoscaling.enabled` | `true` | Enable HPA |
| `autoscaling.minReplicas` | `2` | Minimum replicas |
| `autoscaling.maxReplicas` | `4` | Maximum replicas |
| `autoscaling.targetCPUUtilizationPercentage` | `80` | CPU target |
| `autoscaling.targetMemoryUtilizationPercentage` | `80` | Memory target |
| `podDisruptionBudget.enabled` | `true` | PDB for operator pods |
| `podDisruptionBudget.minAvailable` | `1` | Min available operator pods |

## Observability

| Parameter | Default | Description |
|-----------|---------|-------------|
| `serviceMonitor.enabled` | `false` | Create Prometheus ServiceMonitor |
| `serviceMonitor.interval` | | Scrape interval |
| `serviceMonitor.scrapeTimeout` | | Scrape timeout |
| `prometheusRule.enabled` | `false` | Create PrometheusRule with alerting rules |
| `prometheusRule.rules` | `[]` | Custom alert rules (uses built-in when empty) |

## Security

| Parameter | Default | Description |
|-----------|---------|-------------|
| `podSecurityContext.runAsNonRoot` | `true` | Run as non-root |
| `securityContext.allowPrivilegeEscalation` | `false` | No privilege escalation |
| `securityContext.readOnlyRootFilesystem` | `true` | Read-only root filesystem |
| `securityContext.capabilities.drop` | `["ALL"]` | Drop all capabilities |
| `networkPolicy.enabled` | `false` | Create NetworkPolicy for metrics |
| `http2.enabled` | `false` | Enable HTTP/2 (disabled for CVE mitigation) |
| `crdRoles.enabled` | `true` | Create admin/editor/viewer ClusterRoles for PDBPolicy |

## Resources

| Parameter | Default | Description |
|-----------|---------|-------------|
| `resources.limits.cpu` | `500m` | CPU limit |
| `resources.limits.memory` | `512Mi` | Memory limit |
| `resources.requests.cpu` | `100m` | CPU request |
| `resources.requests.memory` | `256Mi` | Memory request |

## Scheduling

| Parameter | Default | Description |
|-----------|---------|-------------|
| `nodeSelector` | `{}` | Node selector |
| `tolerations` | `[]` | Tolerations |
| `affinity` | `{}` | Affinity rules |
| `topologySpreadConstraints` | `[]` | Topology spread constraints |
| `priorityClassName` | `""` | Priority class name |

## Extension Points

| Parameter | Default | Description |
|-----------|---------|-------------|
| `extraEnv` | `[]` | Additional environment variables |
| `extraVolumes` | `[]` | Additional volumes |
| `extraVolumeMounts` | `[]` | Additional volume mounts |
| `commonLabels` | `{}` | Labels applied to all resources |
| `podAnnotations` | | Additional pod annotations |
| `podLabels` | `{}` | Additional pod labels |
