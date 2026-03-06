---
sidebar_position: 2
title: Metrics Reference
---

# Metrics Reference

All Prometheus metrics exposed by PDB Operator.

## Reconciliation Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `pdb_operator_reconciliation_duration_seconds` | Histogram | `controller`, `result` | Duration of reconciliation loops |
| `pdb_operator_reconciliation_errors_total` | Counter | `controller`, `error_type` | Total reconciliation errors |

## PDB Operation Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `pdb_operator_pdbs_created_total` | Counter | `namespace`, `availability_class`, `workload_function` | Total PDBs created |
| `pdb_operator_pdbs_updated_total` | Counter | `namespace`, `availability_class` | Total PDBs updated |
| `pdb_operator_pdbs_deleted_total` | Counter | `namespace`, `reason` | Total PDBs deleted |

## Status Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `pdb_operator_deployments_managed` | Gauge | `namespace`, `availability_class` | Currently managed deployments |
| `pdb_operator_policies_active` | Gauge | `namespace` | Currently active policies |
| `pdb_operator_compliance_status` | Gauge | `namespace`, `deployment`, `reason` | Compliance status (1=compliant, 0=non-compliant) |

## Operational Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `pdb_operator_maintenance_window_active` | Gauge | | Whether a maintenance window is currently active |
| `pdb_operator_enforcement_decisions_total` | Counter | `enforcement_mode`, `decision_type`, `namespace` | Enforcement decisions made |
| `pdb_operator_override_attempts_total` | Counter | `result`, `reason`, `namespace` | Override attempts (accepted/rejected) |

## Sample Queries

```promql
# Reconciliation error rate
rate(pdb_operator_reconciliation_errors_total[5m])

# Average reconciliation duration (p95)
histogram_quantile(0.95, rate(pdb_operator_reconciliation_duration_seconds_bucket[5m]))

# Total managed deployments
sum(pdb_operator_deployments_managed)

# PDB operations per minute
sum(rate(pdb_operator_pdbs_created_total[5m]) + rate(pdb_operator_pdbs_updated_total[5m])) * 60

# Enforcement decisions by mode
sum by (enforcement_mode, decision_type) (rate(pdb_operator_enforcement_decisions_total[5m]))

# Non-compliant deployments
pdb_operator_compliance_status == 0
```
