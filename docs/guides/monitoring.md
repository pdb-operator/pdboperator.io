---
sidebar_position: 4
title: Monitoring
---

# Monitoring

PDB Operator includes a comprehensive observability stack with Prometheus metrics, OpenTelemetry tracing, and structured logging.

## Prometheus Metrics

All metrics are exposed on the metrics endpoint and can be scraped by Prometheus via the ServiceMonitor.

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

## OpenTelemetry Tracing

Enable distributed tracing by setting the `OTLP_ENDPOINT` environment variable:

```yaml
env:
  - name: OTLP_ENDPOINT
    value: "otel-collector.observability:4317"
```

Traces are exported via OTLP/gRPC protocol and include spans for policy resolution, PDB creation, and reconciliation loops.

## Structured Logging

The operator outputs JSON-formatted structured logs with:

- Audit trails for policy and PDB changes
- Correlation IDs for request tracing
- Trace context propagation (W3C Trace Context)

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
```
