---
sidebar_position: 4
title: Monitoring
---

# Monitoring

PDB Operator includes a comprehensive observability stack with Prometheus metrics, OpenTelemetry tracing, and structured logging.

## Prometheus Metrics

All metrics are exposed on the metrics endpoint (default `:8443` over HTTPS) and can be scraped by Prometheus via the ServiceMonitor.

| Metric | Type | Description |
|--------|------|-------------|
| `pdb_operator_reconciliation_duration_seconds` | Histogram | Reconciliation duration |
| `pdb_operator_reconciliation_errors_total` | Counter | Reconciliation errors |
| `pdb_operator_pdbs_created_total` | Counter | PDBs created |
| `pdb_operator_pdbs_updated_total` | Counter | PDBs updated |
| `pdb_operator_pdbs_deleted_total` | Counter | PDBs deleted |
| `pdb_operator_deployments_managed` | Gauge | Managed deployments per namespace/class |
| `pdb_operator_policies_active` | Gauge | Active policies per namespace |
| `pdb_operator_compliance_status` | Gauge | Deployment compliance status |
| `pdb_operator_maintenance_window_active` | Gauge | Maintenance window active |
| `pdb_operator_enforcement_decisions_total` | Counter | Enforcement decisions |
| `pdb_operator_override_attempts_total` | Counter | Override attempts |

See the [Metrics Reference](/docs/reference/metrics-reference) for full label details and sample queries.

### Enable ServiceMonitor

With Helm:

```bash
helm upgrade pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --set serviceMonitor.enabled=true
```

### Enable Prometheus Alerting Rules

The Helm chart includes 12 alert groups covering operator health, performance, circuit breaker, compliance, workqueue depth, resources, and more:

```bash
helm upgrade pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --set prometheusRule.enabled=true
```

## OpenTelemetry Tracing

Tracing is enabled by default. Configure the OTLP collector endpoint:

```bash
helm upgrade pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --set tracing.endpoint=otel-collector.observability:4317
```

Or set the `OTLP_ENDPOINT` environment variable directly:

```yaml
extraEnv:
  - name: OTLP_ENDPOINT
    value: "otel-collector.observability:4317"
```

Traces are exported via OTLP/gRPC protocol and include spans for:
- Policy resolution and evaluation
- PDB creation, update, and deletion
- Reconciliation loops with correlation IDs
- Maintenance window checks

## Structured Logging

The operator outputs JSON-formatted structured logs with:

- Audit trails for policy and PDB changes
- Correlation IDs and reconcile IDs for request tracing
- Trace context propagation (W3C Trace Context)

Configure the log level:

```bash
helm upgrade pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \
  --namespace pdb-operator-system \
  --set controller.logLevel=debug
```

## Kubernetes Events

The operator records events on both PDBPolicy and Deployment resources:

| Event | Description |
|-------|-------------|
| `PolicyApplied` | Policy successfully applied to workloads |
| `PolicyUpdated` | Policy configuration updated |
| `PolicyRemoved` | Policy removed from workloads |
| `PolicyConflict` | Multiple policies match a deployment |
| `PolicyEnforced` | Enforcement mode blocked an override |
| `PDBCreated` | New PDB created for a deployment |
| `PDBUpdated` | Existing PDB updated |
| `PDBDeleted` | PDB removed |
| `DeploymentManaged` | Deployment is now managed by the operator |
| `DeploymentSkipped` | Deployment skipped (single replica or no match) |
| `AnnotationAccepted` | Annotation override accepted |

## Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/healthz` | Liveness probe, confirms the operator is running |
| `/readyz` | Readiness probe, confirms caches are synced and ready to serve |

## Verify Metrics

```bash
# Check the metrics service
kubectl get svc -n pdb-operator-system | grep metrics

# Verify ServiceMonitor is picked up by Prometheus
kubectl get servicemonitor -n pdb-operator-system

# Check PrometheusRule alerts
kubectl get prometheusrule -n pdb-operator-system
```
