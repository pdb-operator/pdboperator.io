---
sidebar_position: 5
title: Grafana Dashboards
---

# Grafana Dashboards

PDB Operator includes pre-built Grafana dashboards for monitoring operator health and PDB status.

## Available Dashboards

The dashboard JSON files are located in `config/grafana/dashboards/` in the [pdb-operator repository](https://github.com/pdb-operator/pdb-operator/tree/main/config/grafana).

## Import Instructions

### Manual Import (UI)

1. Open Grafana and go to **Dashboards > Import**
2. Upload the dashboard JSON file or paste its contents
3. Select your Prometheus data source
4. Click **Import**

### Automated Import (API)

```bash
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GRAFANA_TOKEN" \
  -d @config/grafana/dashboards/pdb-operator-overview.json
```

## Expected Metrics

After importing, you should see data for:

- Reconciliation duration and error rates
- PDB creation/update/deletion rates
- Active policies and managed deployments per namespace
- Compliance status across workloads
- Maintenance window activity

## Troubleshooting

### No data showing

1. Verify Prometheus is scraping the operator metrics endpoint:
   ```bash
   kubectl get servicemonitor -n pdb-operator-system
   ```

2. Check the Prometheus targets page for the pdb-operator target status

3. Verify the data source is correctly configured in Grafana

### Sample queries

```promql
# Reconciliation error rate (last 5 minutes)
rate(pdb_operator_reconciliation_errors_total[5m])

# Currently managed deployments
pdb_operator_deployments_managed

# Active policies
pdb_operator_policies_active

# PDB operations per second
rate(pdb_operator_pdbs_created_total[5m]) + rate(pdb_operator_pdbs_updated_total[5m])
```
